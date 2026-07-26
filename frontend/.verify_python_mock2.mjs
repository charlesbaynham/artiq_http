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

  // Expand the "rabi" group in the fragment tree.
  const rabiGroup = page.getByText("rabi", { exact: true }).first();
  await rabiGroup.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOT_DIR}/py-03-rabi-expanded.png` });

  const bodyText1 = await page.locator("body").innerText();
  console.log("--- after expanding rabi ---");
  console.log(bodyText1.slice(0, 4000));

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
