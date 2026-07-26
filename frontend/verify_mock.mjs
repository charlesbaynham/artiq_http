// Verification script for the static GitHub Pages mock (VITE_MOCK=1 build).
// Drives dist/ served on :4180 with Playwright, chromium.
import { chromium } from "@playwright/test";

const BASE = "http://127.0.0.1:4180";
const results = {};
const externalRequests = [];

function log(name, ok, detail) {
  results[name] = { ok, detail };
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${detail ? ": " + detail : ""}`);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("requestfinished", (req) => {
  const url = req.url();
  if (!url.startsWith(BASE)) externalRequests.push(url);
});
page.on("request", (req) => {
  const url = req.url();
  // Flag anything that would have hit a real backend (port 8000, or any
  // non-4180 origin) -- proves the app never depends on a Python backend.
  if (url.includes(":8000") || (!url.startsWith(BASE) && !url.startsWith("data:"))) {
    externalRequests.push(url);
  }
});

await page.goto(BASE + "/", { waitUntil: "load" });
await page.waitForTimeout(1500);

// 1. App loads or at least the demo banner mounts + no fatal crash.
const bodyText = await page.textContent("body");
log("page loaded (body has content)", !!bodyText && bodyText.length > 10, `len=${bodyText?.length}`);

const bannerVisible = await page.locator("#artiq-mock-banner").count();
log("demo banner mounted", bannerVisible === 1);

// 2. Direct fetch() calls in-page to prove the adapter independent of UI progress.
const explist = await page.evaluate(async () => {
  const r = await fetch("/api/explist");
  return { status: r.status, body: await r.json() };
});
log(
  "GET /api/explist populated",
  explist.status === 200 && Array.isArray(explist.body.experiments) && explist.body.experiments.length === 3,
  `status=${explist.status} n=${explist.body?.experiments?.length}`,
);

const schedule = await page.evaluate(async () => {
  const r = await fetch("/api/schedule");
  return { status: r.status, body: await r.json() };
});
const scheduleRids = Object.keys(schedule.body || {}).sort();
log(
  "GET /api/schedule shows 4823/4824",
  schedule.status === 200 && scheduleRids.includes("4823") && scheduleRids.includes("4824"),
  `rids=${scheduleRids.join(",")} status4823=${schedule.body?.["4823"]?.status}`,
);

// 3. Live plot dataset streams points (SSE shim) for the seeded rid_4823 run.
const sseResult = await page.evaluate(async () => {
  return await new Promise((resolve) => {
    const es = new window.EventSource("/api/datasets/stream/ndscan.rid_4823");
    let initCount = null;
    let updateCount = 0;
    let lastLen = -1;
    const timer = setTimeout(() => {
      es.close();
      resolve({ initCount, updateCount, lastLen, timedOut: true });
    }, 6000);
    es.addEventListener("init", (evt) => {
      const data = JSON.parse(evt.data);
      const axisKey = Object.keys(data).find((k) => k.endsWith(".points.axis_0"));
      initCount = axisKey ? data[axisKey][1].length : null;
    });
    es.addEventListener("update", (evt) => {
      updateCount++;
      const data = JSON.parse(evt.data);
      const axisKey = Object.keys(data).find((k) => k.endsWith(".points.axis_0"));
      if (axisKey) lastLen = data[axisKey][1].length;
      if (updateCount > 8 && lastLen > (initCount ?? 0)) {
        clearTimeout(timer);
        es.close();
        resolve({ initCount, updateCount, lastLen, timedOut: false });
      }
    });
  });
});
log(
  "live plot (rid_4823) streams points via EventSource shim",
  sseResult.updateCount > 0 && sseResult.lastLen > -1 && !sseResult.timedOut,
  JSON.stringify(sseResult),
);

// 4. Submit a scan -> new RID -> starts streaming.
const submitResult = await page.evaluate(async () => {
  const argInfoRes = await fetch("/api/explist/Spectroscopy/rabi_flop.py/RabiFlop/arginfo");
  const argInfo = await argInfoRes.json();
  const scanBody = {
    file: "Spectroscopy/rabi_flop.py",
    class_name: "RabiFlop",
    axes: [
      {
        fqn: "rabi.pulse_duration",
        type: "linear",
        range: { start: 1e-6, stop: 5e-5, num_points: 11 },
      },
    ],
    fixed_params: {},
    num_repeats: 1,
    repo_rev: null,
    pipeline: "main",
    priority: 0,
    flush: false,
  };
  const submitRes = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scanBody),
  });
  const rid = await submitRes.json();

  const scheduleRes = await fetch("/api/schedule");
  const schedule = await scheduleRes.json();
  const item = schedule[String(rid)];

  return {
    argInfoOk: argInfoRes.status === 200 && !!argInfo.arginfo,
    submitStatus: submitRes.status,
    rid,
    scheduleHasRid: !!item,
    itemStatus: item?.status,
  };
});
log(
  "POST /api/scan returns new RID (>=4825) and inserts running schedule item",
  submitResult.submitStatus === 200 &&
    Number(submitResult.rid) >= 4825 &&
    submitResult.scheduleHasRid &&
    submitResult.itemStatus === "running",
  JSON.stringify(submitResult),
);

// Confirm the new run's dataset actually streams points too.
const newRunStream = await page.evaluate(async (rid) => {
  return await new Promise((resolve) => {
    const es = new window.EventSource(`/api/datasets/stream/ndscan.rid_${rid}`);
    let sawPoints = false;
    let updates = 0;
    const timer = setTimeout(() => {
      es.close();
      resolve({ sawPoints, updates, timedOut: true });
    }, 5000);
    es.addEventListener("update", (evt) => {
      updates++;
      const data = JSON.parse(evt.data);
      for (const [k, v] of Object.entries(data)) {
        if (k.endsWith(".points.axis_0") && Array.isArray(v[1]) && v[1].length > 0) sawPoints = true;
      }
      if (sawPoints) {
        clearTimeout(timer);
        es.close();
        resolve({ sawPoints, updates, timedOut: false });
      }
    });
  });
}, submitResult.rid);
log(
  "newly submitted scan streams live points",
  newRunStream.sawPoints && !newRunStream.timedOut,
  JSON.stringify(newRunStream),
);

// 5. Error shape check: FastAPI-style {"detail": ...}
const errCheck = await page.evaluate(async () => {
  const r = await fetch("/api/schedule/999999");
  const body = await r.json();
  return { status: r.status, hasDetail: typeof body.detail === "string" };
});
log("404 error shaped like FastAPI ({detail: ...})", errCheck.status === 404 && errCheck.hasDetail, JSON.stringify(errCheck));

// 6. Presets CRUD via localStorage
const presetResult = await page.evaluate(async () => {
  const createRes = await fetch("/api/presets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "verify preset",
      file: "Spectroscopy/rabi_flop.py",
      class_name: "RabiFlop",
      favourite: true,
      working_set: [{ fqn: "rabi.pulse_duration", mode: "fixed", value: 1e-5 }],
    }),
  });
  const created = await createRes.json();
  const listRes = await fetch("/api/presets?favourites_only=true");
  const list = await listRes.json();
  return {
    createStatus: createRes.status,
    hasId: typeof created.id === "string",
    listedAfterCreate: (list.presets || []).some((p) => p.id === created.id),
  };
});
log(
  "presets CRUD (create + list favourites) works",
  presetResult.createStatus === 200 && presetResult.hasId && presetResult.listedAfterCreate,
  JSON.stringify(presetResult),
);

// 7. Reload and confirm preset survived (localStorage persistence).
await page.reload({ waitUntil: "load" });
const presetsAfterReload = await page.evaluate(async () => {
  const r = await fetch("/api/presets");
  const body = await r.json();
  return body.presets.length;
});
log("presets survive reload", presetsAfterReload >= 1, `count=${presetsAfterReload}`);

// 8. Deep link works via the 404.html fallback. GitHub Pages serves the
// site's root 404.html *with an HTTP 404 status* for any unmatched path --
// that's the actual mechanism (not a 200) -- the browser still parses and
// renders the HTML body regardless of status code, which is what lets
// BrowserRouter boot and render /plots. Verified here against a tiny local
// server that reproduces exactly that GH-Pages-specific fallback (python's
// http.server / npm's http-server do not do this out of the box).
const deepLinkPage = await browser.newPage();
const resp = await deepLinkPage.goto(BASE + "/plots", { waitUntil: "load" });
const deepLinkStatus = resp.status();
await deepLinkPage.waitForTimeout(800);
const deepLinkHasRoot = await deepLinkPage.locator("#root").count();
const deepLinkBody = await deepLinkPage.textContent("body");
log(
  "deep link /plots renders app shell via 404.html fallback (status 404, body is the SPA)",
  deepLinkStatus === 404 && deepLinkHasRoot === 1 && !!deepLinkBody,
  `status=${deepLinkStatus} hasRoot=${deepLinkHasRoot} bodyLen=${deepLinkBody?.length}`,
);
await deepLinkPage.close();

// 9. No requests ever hit a real backend / external origin (Google Fonts is
// an expected external asset load, not a backend dependency -- excluded).
const nonFontExternal = externalRequests.filter((u) => !u.includes("fonts.googleapis.com") && !u.includes("fonts.gstatic.com"));
log(
  "no network requests left the static site for backend data (fonts excluded)",
  nonFontExternal.length === 0,
  JSON.stringify(nonFontExternal),
);

// 10. No console errors (font-load failures are a sandbox-has-no-internet
// artifact, not an app bug -- excluded).
const appConsoleErrors = consoleErrors.filter((e) => !/ERR_CONNECTION_RESET|fonts\.g(oogleapis|static)/.test(e));
log("no console errors (font-load noise excluded)", appConsoleErrors.length === 0, JSON.stringify(appConsoleErrors.slice(0, 5)));

await browser.close();

const failed = Object.entries(results).filter(([, r]) => !r.ok);
console.log("\n=== SUMMARY ===");
console.log(`${Object.keys(results).length - failed.length}/${Object.keys(results).length} passed`);
if (failed.length) {
  console.log("FAILURES:", failed.map(([k]) => k).join(", "));
  process.exit(1);
}
