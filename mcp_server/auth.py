"""
GitHub OAuth 2.1 provider for the ARTIQ HTTP MCP server.

Flow:
  1. Claude.ai  → GET  /authorize        → redirect to GitHub
  2. GitHub     → GET  /github-callback  → our auth code → redirect to Claude.ai
  3. Claude.ai  → POST /token            → JWT access token + opaque refresh token
  4. Claude.ai  → MCP requests with Authorization: Bearer <jwt>

The REST API (artiq_http/auth.py) validates the same JWTs via the shared
TOKEN_SECRET, so a single login covers both MCP and REST access.

Required environment variables:
  EXTERNAL_BASE_URL     Public HTTPS root of your server, e.g. https://lab.example.com
                        (no trailing slash). The MCP endpoint is at {url}/mcp,
                        the GitHub callback at {url}/github-callback.
  GITHUB_CLIENT_ID      From your GitHub OAuth App.
  GITHUB_CLIENT_SECRET  From your GitHub OAuth App.
  TOKEN_SECRET          Random hex string used to sign JWTs.
                        Generate with: python -c "import secrets; print(secrets.token_hex(32))"
  ALLOWED_GITHUB_USERS  Comma-separated allowlist of GitHub usernames.
                        Leave empty to allow any GitHub user (not recommended).

Optional:
  ACCESS_TOKEN_TTL      Access token lifetime in seconds (default: 3600 = 1 hour).
  REFRESH_TOKEN_TTL     Refresh token lifetime in seconds (default: 2592000 = 30 days).
"""

import logging
import os
import secrets
import time
from urllib.parse import urlencode

import httpx
import jwt as pyjwt
from mcp.server.auth.provider import (
    AccessToken,
    AuthorizationCode,
    AuthorizationParams,
    OAuthAuthorizationServerProvider,
    RefreshToken,
)
from mcp.shared.auth import OAuthClientInformationFull, OAuthToken
from pydantic import AnyUrl
from starlette.requests import Request
from starlette.responses import HTMLResponse, RedirectResponse

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

EXTERNAL_BASE_URL: str = os.environ["EXTERNAL_BASE_URL"].rstrip("/")
GITHUB_CLIENT_ID: str = os.environ["GITHUB_CLIENT_ID"]
GITHUB_CLIENT_SECRET: str = os.environ["GITHUB_CLIENT_SECRET"]
TOKEN_SECRET: str = os.environ["TOKEN_SECRET"]
ALLOWED_GITHUB_USERS: frozenset[str] = frozenset(
    u.strip() for u in os.environ.get("ALLOWED_GITHUB_USERS", "").split(",") if u.strip()
)
ACCESS_TOKEN_TTL: int = int(os.getenv("ACCESS_TOKEN_TTL", "3600"))
REFRESH_TOKEN_TTL: int = int(os.getenv("REFRESH_TOKEN_TTL", str(86400 * 30)))

_AUTH_CODE_TTL = 300  # 5 minutes; not user-configurable
_JWT_ALGORITHM = "HS256"

# ---------------------------------------------------------------------------
# Extended Pydantic token models
# The MCP SDK types are BaseModel subclasses; extra fields are allowed and
# carried through but never serialised in OAuth responses.
# ---------------------------------------------------------------------------


class _StoredAuthCode(AuthorizationCode):
    github_username: str
    redirect_uri: AnyUrl | None = None
    redirect_uri_provided_explicitly: bool = False


class _StoredAccessToken(AccessToken):
    github_username: str


class _StoredRefreshToken(RefreshToken):
    github_username: str


# ---------------------------------------------------------------------------
# In-memory stores
# Single-process; restart invalidates all sessions (acceptable for a lab).
# ---------------------------------------------------------------------------

_clients: dict[str, OAuthClientInformationFull] = {}
_pending_github: dict[str, tuple[OAuthClientInformationFull, AuthorizationParams]] = {}
_auth_codes: dict[str, _StoredAuthCode] = {}
_refresh_tokens: dict[str, _StoredRefreshToken] = {}
_revoked_jtis: set[str] = set()

# ---------------------------------------------------------------------------
# JWT helpers (shared with artiq_http.auth for REST API validation)
# ---------------------------------------------------------------------------


def issue_jwt(github_username: str, client_id: str, scopes: list[str]) -> tuple[str, int]:
    """Sign and return a JWT access token plus its expiry timestamp."""
    now = int(time.time())
    exp = now + ACCESS_TOKEN_TTL
    payload = {
        "sub": github_username,
        "iat": now,
        "exp": exp,
        "jti": secrets.token_urlsafe(16),
        "client_id": client_id,
        "scopes": scopes,
        "iss": EXTERNAL_BASE_URL,
    }
    token = pyjwt.encode(payload, TOKEN_SECRET, algorithm=_JWT_ALGORITHM)
    return token, exp


def verify_jwt(token: str) -> dict | None:
    """Decode and validate a JWT. Returns the payload or None if invalid/expired/revoked."""
    try:
        payload = pyjwt.decode(token, TOKEN_SECRET, algorithms=[_JWT_ALGORITHM])
    except pyjwt.InvalidTokenError:
        return None
    if payload.get("jti") in _revoked_jtis:
        return None
    return payload


# ---------------------------------------------------------------------------
# OAuth 2.1 provider
# ---------------------------------------------------------------------------


class GitHubOAuthProvider:
    """
    OAuth 2.1 Authorization Server that delegates identity to GitHub.

    Claude.ai (or any MCP client) authenticates via GitHub; we issue our own
    short-lived JWT access tokens so the REST API can also validate them
    independently using the shared TOKEN_SECRET.
    """

    # --- Client registry ---

    async def get_client(self, client_id: str) -> OAuthClientInformationFull | None:
        return _clients.get(client_id)

    async def register_client(self, client_info: OAuthClientInformationFull) -> None:
        log.info("Registering OAuth client: %s (%s)", client_info.client_id, client_info.client_name)
        _clients[client_info.client_id] = client_info

    # --- Authorization ---

    async def authorize(self, client: OAuthClientInformationFull, params: AuthorizationParams) -> str:
        """Redirect the user to GitHub OAuth."""
        github_state = secrets.token_urlsafe(32)
        _pending_github[github_state] = (client, params)
        qs = urlencode(
            {
                "client_id": GITHUB_CLIENT_ID,
                "redirect_uri": f"{EXTERNAL_BASE_URL}/github-callback",
                "scope": "read:user",
                "state": github_state,
            }
        )
        return f"https://github.com/login/oauth/authorize?{qs}"

    # --- Authorization code ---

    async def load_authorization_code(
        self, client: OAuthClientInformationFull, authorization_code: str
    ) -> _StoredAuthCode | None:
        code = _auth_codes.get(authorization_code)
        if code is None or code.client_id != client.client_id:
            return None
        return code

    async def exchange_authorization_code(
        self, client: OAuthClientInformationFull, authorization_code: _StoredAuthCode
    ) -> OAuthToken:
        """Exchange a one-time auth code for a JWT access token + refresh token."""
        _auth_codes.pop(authorization_code.code, None)  # single-use

        token_str, exp = issue_jwt(authorization_code.github_username, client.client_id, authorization_code.scopes)
        refresh_str = secrets.token_urlsafe(48)
        now = int(time.time())

        _refresh_tokens[refresh_str] = _StoredRefreshToken(
            token=refresh_str,
            client_id=client.client_id,
            scopes=authorization_code.scopes,
            expires_at=now + REFRESH_TOKEN_TTL,
            github_username=authorization_code.github_username,
        )

        return OAuthToken(
            access_token=token_str,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_TTL,
            refresh_token=refresh_str,
            scope=" ".join(authorization_code.scopes),
        )

    # --- Refresh token ---

    async def load_refresh_token(
        self, client: OAuthClientInformationFull, refresh_token: str
    ) -> _StoredRefreshToken | None:
        tok = _refresh_tokens.get(refresh_token)
        if tok is None or tok.client_id != client.client_id:
            return None
        if tok.expires_at and tok.expires_at < time.time():
            _refresh_tokens.pop(refresh_token, None)
            return None
        return tok

    async def exchange_refresh_token(
        self,
        client: OAuthClientInformationFull,
        refresh_token: _StoredRefreshToken,
        scopes: list[str],
    ) -> OAuthToken:
        """Issue rotated tokens; old refresh token is immediately invalidated."""
        _refresh_tokens.pop(refresh_token.token, None)

        token_str, exp = issue_jwt(refresh_token.github_username, client.client_id, scopes)
        refresh_str = secrets.token_urlsafe(48)
        now = int(time.time())

        _refresh_tokens[refresh_str] = _StoredRefreshToken(
            token=refresh_str,
            client_id=client.client_id,
            scopes=scopes,
            expires_at=now + REFRESH_TOKEN_TTL,
            github_username=refresh_token.github_username,
        )

        return OAuthToken(
            access_token=token_str,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_TTL,
            refresh_token=refresh_str,
            scope=" ".join(scopes),
        )

    # --- Access token (JWT validation) ---

    async def load_access_token(self, token: str) -> _StoredAccessToken | None:
        payload = verify_jwt(token)
        if payload is None:
            return None
        return _StoredAccessToken(
            token=token,
            client_id=payload["client_id"],
            scopes=payload.get("scopes", []),
            expires_at=payload["exp"],
            github_username=payload["sub"],
        )

    # --- Revocation ---

    async def revoke_token(self, token: _StoredAccessToken | _StoredRefreshToken) -> None:
        if isinstance(token, _StoredRefreshToken):
            _refresh_tokens.pop(token.token, None)
        elif isinstance(token, _StoredAccessToken):
            payload = verify_jwt(token.token)
            if payload and (jti := payload.get("jti")):
                _revoked_jtis.add(jti)


# Singleton used by both server.py and the REST API
provider = GitHubOAuthProvider()

# ---------------------------------------------------------------------------
# GitHub callback — Starlette endpoint added directly to the app
# ---------------------------------------------------------------------------

_SIMPLE_ERROR = """\
<!DOCTYPE html><html><body>
<h2>Authentication error</h2>
<p>{msg}</p>
<p>Please close this window and try reconnecting.</p>
</body></html>"""


async def github_callback(request: Request):
    """
    GitHub redirects here after the user authorises (or denies) the OAuth request.
    We exchange the GitHub code for a GitHub token, validate the user, then issue
    our own MCP authorization code and redirect back to the original client.
    """
    code = request.query_params.get("code")
    state = request.query_params.get("state")

    if not state or state not in _pending_github:
        return HTMLResponse(_SIMPLE_ERROR.format(msg="Invalid or expired state."), status_code=400)

    client, params = _pending_github.pop(state)

    # ---- Exchange code with GitHub ----
    async with httpx.AsyncClient(timeout=15.0) as http:
        try:
            gh_resp = await http.post(
                "https://github.com/login/oauth/access_token",
                json={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": f"{EXTERNAL_BASE_URL}/github-callback",
                },
                headers={"Accept": "application/json"},
            )
            gh_resp.raise_for_status()
            gh_token = gh_resp.json().get("access_token")
        except Exception as exc:
            log.error("GitHub token exchange failed: %s", exc)
            return HTMLResponse(_SIMPLE_ERROR.format(msg="GitHub token exchange failed."), status_code=502)

        if not gh_token:
            log.warning("GitHub returned no access_token: %s", gh_resp.text)
            return HTMLResponse(_SIMPLE_ERROR.format(msg="GitHub did not return a token."), status_code=400)

        # ---- Get GitHub username ----
        try:
            user_resp = await http.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"token {gh_token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            )
            user_resp.raise_for_status()
            github_login: str = user_resp.json().get("login", "")
        except Exception as exc:
            log.error("GitHub user fetch failed: %s", exc)
            return HTMLResponse(_SIMPLE_ERROR.format(msg="Could not fetch GitHub user info."), status_code=502)

    if not github_login:
        return HTMLResponse(_SIMPLE_ERROR.format(msg="GitHub returned no username."), status_code=400)

    # ---- Check allowlist ----
    if ALLOWED_GITHUB_USERS and github_login not in ALLOWED_GITHUB_USERS:
        log.warning("Blocked login: GitHub user '%s' not in allowlist", github_login)
        return HTMLResponse(
            _SIMPLE_ERROR.format(msg=f"GitHub user '{github_login}' is not authorised."),
            status_code=403,
        )

    log.info("GitHub user '%s' authenticated successfully", github_login)

    # ---- Issue our authorization code ----
    our_code = secrets.token_urlsafe(32)
    _auth_codes[our_code] = _StoredAuthCode(
        code=our_code,
        scopes=params.scopes or [],
        expires_at=time.time() + _AUTH_CODE_TTL,
        client_id=client.client_id,
        code_challenge=params.code_challenge,
        github_username=github_login,
        redirect_uri=params.redirect_uri,
        redirect_uri_provided_explicitly=params.redirect_uri_provided_explicitly,
    )

    # ---- Redirect back to the MCP client ----
    from mcp.server.auth.provider import construct_redirect_uri

    redirect_params: dict[str, str] = {"code": our_code}
    if params.state:
        redirect_params["state"] = params.state

    redirect_url = construct_redirect_uri(str(params.redirect_uri), **redirect_params)
    return RedirectResponse(redirect_url, status_code=302, headers={"Cache-Control": "no-store"})
