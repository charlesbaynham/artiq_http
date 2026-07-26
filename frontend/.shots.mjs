import { chromium } from "@playwright/test";
import fs from "fs";

const OUT = "/tmp/polish-shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});

async function shot(name, { width, height, path, waitMs = 3500 } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") {
      const t = m.text();
      if (
        t.includes("ws://localhost:5173") ||
        t.includes("[vite] failed to connect")
      )
        return;
      errors.push(t);
    }
  });
  page.on("pageerror", (e) => errors.push("PAGE ERROR: " + e.message));
  await page.goto(`http://localhost:5173${path}`, { waitUntil: "load" });
  await page.waitForTimeout(waitMs);
  const outPath = `${OUT}/${name}.png`;
  await page.screenshot({ path: outPath });
  console.log(
    `wrote ${outPath}${
      errors.length
        ? " CONSOLE ERRORS: " + JSON.stringify(errors)
        : " (no console errors)"
    }`,
  );
  await ctx.close();
  return outPath;
}

const EXP = "/?experiment=Spectroscopy/rabi_flop.py:RabiFlop";

await shot("01-workspace-1280x744", { width: 1280, height: 744, path: EXP });
await shot("02-workspace-1440x900", { width: 1440, height: 900, path: EXP });
await shot("03-workspace-1100x744", { width: 1100, height: 744, path: EXP });
await shot("04-plots-standalone-1440x900", {
  width: 1440,
  height: 900,
  path: "/plots",
});
await shot("05-plots-standalone-375x812", {
  width: 375,
  height: 812,
  path: "/plots",
});
await shot("06-mobile-390x844", { width: 390, height: 844, path: "/" });

await browser.close();
