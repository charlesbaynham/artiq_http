import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 744 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push("PAGE ERROR: " + e.message));

await page.addInitScript(() => {
  window.__esInstances = [];
  const OrigES = window.EventSource;
  window.EventSource = new Proxy(OrigES, {
    construct(target, args) {
      const inst = new target(...args);
      window.__esInstances.push({ url: args[0], inst });
      return inst;
    },
  });
});

await page.goto(
  "http://localhost:5173/?experiment=Spectroscopy/rabi_flop.py:RabiFlop",
  { waitUntil: "load" },
);
await page.waitForTimeout(5000);

const result = await page.evaluate(() =>
  window.__esInstances.map(({ url, inst }) => ({
    url,
    readyState: inst.readyState,
  })),
);
const openCount = result.filter((r) => r.readyState !== 2).length;
console.log("Total EventSource() calls:", result.length);
console.log("Currently open (non-closed) EventSource count:", openCount);
console.log(JSON.stringify(result, null, 2));
console.log("Console errors:", JSON.stringify(consoleErrors));

await browser.close();
