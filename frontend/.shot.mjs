import { chromium } from "@playwright/test";
const [, , url, out, w, h] = process.argv;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({
  viewport: { width: +(w || 1280), height: +(h || 744) },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await ctx.newPage();
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE ERROR:", m.text()); });
page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2500);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log("wrote", out);
