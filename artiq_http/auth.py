"""
FastAPI authentication dependency for the ARTIQ HTTP REST API.

Accepts two forms of credential on each request:

1. JWT bearer token (issued by the MCP server's OAuth flow)
   Authorization: Bearer <jwt>

2. Internal service key (used by the MCP server → backend calls,
   which travel over the internal Docker network only)
   X-Internal-Key: <INTERNAL_API_KEY>

If AUTH_DISABLED=true the dependency is a no-op (useful for local dev
without the full OAuth stack).  Never set this in production.
"""

import logging
import os

import jwt as pyjwt
from fastapi import HTTPException, Request, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

log = logging.getLogger(__name__)

TOKEN_SECRET: str = os.environ.get("TOKEN_SECRET", "")
INTERNAL_API_KEY: str = os.environ.get("INTERNAL_API_KEY", "")
AUTH_DISABLED: bool = os.getenv("AUTH_DISABLED", "false").lower() in ("true", "1")
_JWT_ALGORITHM = "HS256"

_bearer = HTTPBearer(auto_error=False)


async def require_auth(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Security(_bearer),
) -> dict:
    """
    FastAPI dependency — raises HTTP 401 if the request is not authenticated.
    Returns the JWT payload (or a synthetic dict for internal calls).
    """
    if AUTH_DISABLED:
        log.debug("Auth disabled — allowing unauthenticated request")
        return {}

    # Internal service-to-service call (MCP server → backend, internal network only)
    if INTERNAL_API_KEY:
        if request.headers.get("X-Internal-Key") == INTERNAL_API_KEY:
            return {"sub": "internal/mcp-server"}

    if not TOKEN_SECRET:
        raise HTTPException(status_code=500, detail="Server misconfiguration: TOKEN_SECRET not set")

    if creds is None:
        raise HTTPException(
            status_code=401,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = pyjwt.decode(creds.credentials, TOKEN_SECRET, algorithms=[_JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired", headers={"WWW-Authenticate": "Bearer"})
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token", headers={"WWW-Authenticate": "Bearer"})

    return payload
