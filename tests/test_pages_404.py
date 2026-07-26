"""Tests for the GitHub Pages site-root 404 page.

The redirect logic in this page is the only thing making deep links into the
static demo work (Pages serves no SPA rewrites and consults only the site-root
404), and it is otherwise unexercised until someone loads a bad URL on the live
site — so pin its shape here.
"""

import re

from scripts.make_pages_404 import render


def test_uses_project_site_base_path() -> None:
    html = render("artiq_http")
    assert 'var demo = "/artiq_http/demo/";' in html
    assert 'href="/artiq_http/"' in html
    assert 'href="/artiq_http/demo/"' in html


def test_user_site_falls_back_to_root_base() -> None:
    """An empty repo name means the site is served from the host root."""
    html = render("")
    assert 'var demo = "/demo/";' in html
    assert 'href="/"' in html


def test_repo_name_is_slash_normalised() -> None:
    assert render("/artiq_http/") == render("artiq_http")


def test_redirects_demo_deep_links_but_not_the_demo_root() -> None:
    """The demo root itself is a real file; only sub-paths need the handoff."""
    html = render("artiq_http")
    assert "path.indexOf(demo) === 0 && path !== demo" in html
    assert '"?spa=" +' in html
    assert "encodeURIComponent(route)" in html


def test_does_not_redirect_documentation_paths() -> None:
    """A mistyped docs URL must land on the static body, not load the demo."""
    html = render("artiq_http")
    # The only navigation is guarded by the demo-prefix check.
    assert html.count("window.location.replace") == 1
    assert "Page not found" in html
    assert "Documentation" in html


def test_is_self_contained() -> None:
    """Pages serves this with no build step, so it can reference no assets."""
    html = render("artiq_http")
    assert "<script src=" not in html
    assert not re.search(r'<link[^>]+rel="stylesheet"', html)
