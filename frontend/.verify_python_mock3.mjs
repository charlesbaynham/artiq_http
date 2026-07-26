import { chromium } from "playwright";

const SHOT_DIR = "/tmp/mockfix-shots";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function ts() {
  return new Date().toISOString();
}

async function main() {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
  });
  const page = await browser.newPage({
    deviceScaleFactor: 2,
    colorScheme: "dark",
    viewport: { width: 1440, height: 900 },
  });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  console.log(ts(), "loading bench with RabiFlop deep link...");
  await page.goto(
    "http://localhost:5173/?experiment=Spectroscopy/rabi_flop.py:RabiFlop",
    { waitUntil: "load" },
  );
  await page.waitForTimeout(1500);

  await page.getByText("rabi", { exact: true }).first().click();
  await page.waitForTimeout(300);

  // Find the row for pulse_duration and inspect its HTML.
  const row = page
    .locator("li, div")
    .filter({ hasText: "Length of the driving pulse on the qubit transition" })
    .last();
  const html = await row.evaluate((el) => el.outerHTML);
  console.log("--- pulse_duration row HTML ---");
  console.log(html.slice(0, 3000));

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
