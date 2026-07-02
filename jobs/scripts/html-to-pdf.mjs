import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const input = process.argv[2] ?? path.join(__dirname, "../cover-letter-en.html");
const output = process.argv[3] ?? input.replace(/\.html$/i, ".pdf");

const htmlPath = path.resolve(input);
const pdfPath = path.resolve(output);

if (!fs.existsSync(htmlPath)) {
  console.error(`Not found: ${htmlPath}`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
await browser.close();

console.log(`PDF written: ${pdfPath}`);
