"""Generate the GitHub Pages site-root ``404.html``.

GitHub Pages has no SPA rewrite rules, and it serves only the *site root*
``404.html`` — a ``404.html`` sitting inside a subdirectory is never consulted.
Our Pages site puts the Sphinx docs at ``/`` and the static demo (a
``BrowserRouter`` SPA) at ``/<repo>/demo/``, so a deep link such as
``/<repo>/demo/plots`` has no matching file and lands on GitHub's own error
page instead of the app.

The page written here is that root 404. It hands demo routes back to the SPA as
``?spa=<route>`` — ``frontend/index.html`` turns that back into the real path
via ``history.replaceState`` before the bundle mounts, so the address bar never
shows the redirect — and leaves every other path as an ordinary not-found for
the documentation.

Kept as a script rather than inlined in the workflow so the generated HTML can
be tested (``tests/test_pages_404.py``) instead of only existing as a heredoc
inside YAML.
"""

from __future__ import annotations

import argparse
from pathlib import Path

_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page not found</title>
    <script>
      // Hand deep links under the demo back to the SPA. Everything else falls
      // through to the static not-found body below.
      (function () {{
        var demo = "{base}demo/";
        var path = window.location.pathname;
        if (path.indexOf(demo) === 0 && path !== demo) {{
          var route = "/" + path.slice(demo.length);
          window.location.replace(
            demo +
              "?spa=" +
              encodeURIComponent(route) +
              window.location.search.replace(/^\\?/, "&") +
              window.location.hash
          );
        }}
      }})();
    </script>
    <style>
      body {{
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0e0f10;
        color: #e8e6df;
        font: 14px/1.6 system-ui, sans-serif;
        text-align: center;
      }}
      a {{ color: #f08a4d; }}
      h1 {{ font-size: 18px; font-weight: 600; margin: 0 0 8px; }}
    </style>
  </head>
  <body>
    <div>
      <h1>Page not found</h1>
      <p>
        <a href="{base}">Documentation</a>
        &middot;
        <a href="{base}demo/">Interactive demo</a>
      </p>
    </div>
  </body>
</html>
"""


def render(repo: str) -> str:
    """Return the 404 page HTML for a project site published at ``/<repo>/``.

    An empty *repo* means the site is served from the host root (a user or
    organisation site), in which case the base path is just ``/``.
    """
    slug = repo.strip("/")
    base = f"/{slug}/" if slug else "/"
    return _TEMPLATE.format(base=base)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default="", help="repository name the site is published under")
    parser.add_argument("--out", required=True, type=Path, help="path to write the 404 page to")
    args = parser.parse_args()

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(render(args.repo), encoding="utf-8")
    print(f"wrote {args.out} (base=/{args.repo.strip('/')}/)")


if __name__ == "__main__":
    main()
