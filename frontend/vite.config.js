import { defineConfig } from "vite";

// `VITE_BASE` sets the deployed base path — used by `npm run build:mock` for
// the GitHub Pages static demo, which is served from a repo subdirectory
// (`/<repo>/`) rather than the site root. Read directly from `process.env`
// (this file runs in Node, not the browser) rather than `import.meta.env`,
// and defaulted to "/" so a plain `vite build`/`vite`/`vite preview` is
// unaffected. See `frontend/src/api/mockAdapter.js` for the matching
// `import.meta.env.BASE_URL`-relative fixture loading, and
// `.github/workflows/pages.yml` for where `VITE_BASE` gets set in CI.
const base = process.env.VITE_BASE || "/";
const isMock = process.env.VITE_MOCK === "1";

// `index.jsx` guards its adapter import with
// `if (import.meta.env.VITE_MOCK === "1") { await import("./api/mockAdapter.js"); }`.
// That condition is false at build time for a plain `vite build`, but Rollup
// still treats a dynamic `import()` as a real chunk boundary regardless of
// whether the branch is reachable — it does not prove branches dead the way a
// minifier proves expressions constant — so without this plugin the adapter
// (and the demo banner strings inside it) would ship as an unused chunk in
// every build, mock or not. This plugin redirects that one specifier to an
// empty virtual module whenever VITE_MOCK isn't set, so the adapter's code
// never enters the non-mock build's module graph at all. `npm run build:mock`
// (VITE_MOCK=1) is unaffected — the real file resolves normally.
function excludeMockAdapterWhenNotMocking() {
  const virtualId = "\0virtual:no-mock-adapter";
  return {
    name: "artiq-http-exclude-mock-adapter",
    enforce: "pre",
    resolveId(source) {
      if (isMock) return null;
      if (source.endsWith("api/mockAdapter.js")) return virtualId;
      return null;
    },
    load(id) {
      if (id === virtualId) return "export default null;";
      return null;
    },
  };
}

export default defineConfig({
  base,
  plugins: [excludeMockAdapterWhenNotMocking()],
  // index.jsx uses a top-level `await import("./api/mockAdapter.js")` guarded
  // on VITE_MOCK so the adapter installs before React renders. Top-level
  // await needs an ES2022+ target; Vite's default esbuild target predates it.
  build: {
    target: "es2022",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
