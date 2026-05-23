// Drive the dev server with Playwright to capture screenshots of the Plots view.
//
// Run via:
//   node scripts/take_screenshots.mjs
//
// Mock backend (scripts/mock_backend.py) must be on :8000, vite on :5173.

import pw from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = pw;
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "scripts/screenshots";
mkdirSync(OUT, { recursive: true });

const FRONTEND = "http://127.0.0.1:5173";

const SHOTS = [
  { name: "01-plots-1d-light", prefix: "ndscan.rid_1042", theme: "light" },
  { name: "02-plots-2d-light", prefix: "ndscan.rid_1041", theme: "light" },
  { name: "03-plots-0d-light", prefix: "ndscan.rid_1040", theme: "light" },
  { name: "04-plots-1d-dark", prefix: "ndscan.rid_1042", theme: "dark" },
  {
    name: "05-plots-1d-with-ghost",
    prefix: "ndscan.rid_1042",
    theme: "light",
    ghost: "ndscan.rid_1037",
  },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

async function expandPlotsSection() {
  // Click the Plots collapsible header so .plots-app is visible.
  const header = await page.evaluateHandle(() => {
    const sections = document.querySelectorAll(".collapsible-section");
    for (const s of sections) {
      const h2 = s.querySelector("h2");
      if (h2 && h2.textContent.trim() === "Plots") {
        return s.querySelector(".section-header.is-clickable");
      }
    }
    return null;
  });
  const el = header.asElement();
  if (el) {
    // only click if currently collapsed
    const isOpen = await el.evaluate(
      (node) => node.querySelector(".section-toggle.is-open") !== null,
    );
    if (!isOpen) await el.click();
  }
  await page.waitForSelector(".plots-app", {
    state: "visible",
    timeout: 15000,
  });
}

// Set theme preference up front via localStorage on the origin.
await page.goto(FRONTEND + "/plots");
await expandPlotsSection();

for (const shot of SHOTS) {
  await page.evaluate(
    ({ theme, ghost }) => {
      localStorage.setItem("artiq_http.plots.theme", theme);
      // Clear ghost selection — handled below by clicking timeline entry.
    },
    { theme: shot.theme, ghost: shot.ghost },
  );

  await page.goto(`${FRONTEND}/plots?scan=${encodeURIComponent(shot.prefix)}`);
  await expandPlotsSection();
  // Wait until SSE init has populated the plot (axes/channel polylines or 0D tiles render).
  try {
    await page.waitForFunction(
      () => {
        const app = document.querySelector(".plots-app");
        if (!app) return false;
        // 1D/2D = svg polyline or canvas; 0D = panel tile with large number.
        return (
          app.querySelector("svg polyline") !== null ||
          app.querySelector("canvas") !== null ||
          /\d/.test(app.querySelector(".p-mono.p-tnum")?.textContent || "")
        );
      },
      { timeout: 8000 },
    );
  } catch {
    /* fall through and screenshot whatever we have */
  }
  await page.waitForTimeout(500);

  if (shot.ghost) {
    // Click the timeline row matching the ghost prefix.
    const handle = await page.evaluateHandle((prefix) => {
      const rows = document.querySelectorAll(
        ".p-rail-timeline [class*='p-mono']",
      );
      for (const el of rows) {
        if (el.textContent && el.textContent.includes(prefix.split("_")[1])) {
          // climb to the row container (3-col grid)
          let cur = el;
          while (
            cur &&
            cur.style &&
            cur.style.gridTemplateColumns !== "14px 1fr auto"
          ) {
            cur = cur.parentElement;
          }
          return cur || el.parentElement;
        }
      }
      return null;
    }, shot.ghost);
    if (handle) {
      try {
        await handle.asElement()?.click();
      } catch {
        /* ignore */
      }
      await page.waitForTimeout(500);
    }
  }

  // Crop to the plots-app element for a clean shot.
  const el = await page.$(".plots-app");
  if (!el) throw new Error("plots-app not visible");
  const file = join(OUT, `${shot.name}.png`);
  await el.screenshot({ path: file });
  console.log("wrote", file);
}

await browser.close();
