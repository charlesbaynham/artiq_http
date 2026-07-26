// Drives the real UI against the Python mock backend (localhost:8000) via
// the Vite dev server (localhost:5173) to verify the submit -> pending ->
// running -> streaming -> completion lifecycle for a freshly submitted
// RabiFlop scan.
import { chromium } from "playwright";

const SHOT_DIR = "/tmp/mockfix-shots";

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
  await page.screenshot({ path: `${SHOT_DIR}/py-01-loaded.png` });

  // Find and pin the rabi.pulse_duration axis as a scan axis. Use the
  // fragment tree search field to locate it quickly.
  const searchInput = page
    .locator(
      'input[type="text"], input[placeholder*="ilter" i], input[placeholder*="earch" i]',
    )
    .first();
  if (await searchInput.count()) {
    await searchInput.fill("pulse_duration");
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${SHOT_DIR}/py-02-filtered.png` });

  console.log(ts(), "dumping page text to find the pulse_duration row...");
  const bodyText = await page.locator("body").innerText();
  console.log(bodyText.slice(0, 3000));

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
