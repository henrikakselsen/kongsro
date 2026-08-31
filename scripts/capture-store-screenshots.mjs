/**
 * Render Chrome Web Store screenshots (1280×800) from local HTML sources.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "docs/screenshots/source");
const outDir = path.join(root, "docs/screenshots");

const shots = [
  ["01-overview.html", "01-overview.png"],
  ["02-filtered-front.html", "02-filtered-front.png"],
  ["03-how-it-works.html", "03-how-it-works.png"],
];

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

for (const [html, png] of shots) {
  const fileUrl = `file://${path.join(sourceDir, html)}`;
  await page.goto(fileUrl);
  await page.waitForTimeout(200);
  const out = path.join(outDir, png);
  await page.screenshot({ path: out, type: "png", clip: { x: 0, y: 0, width: 1280, height: 800 } });
  console.log("wrote", out);
}

await browser.close();
