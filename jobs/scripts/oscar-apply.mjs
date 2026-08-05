/**
 * Oscar Mobility join.com — interactive fill.
 * Join often keeps Continue disabled until captcha/email validation.
 *
 *   node jobs/scripts/oscar-apply.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const URL =
  "https://join.com/companies/oscar576/16413080-senior-react-engineer#apply-window";

const CV_CANDIDATES = [
  path.join(
    process.env.USERPROFILE ?? "",
    "Downloads",
    "Erick Vargas Ramos - SSE Frontend Lead.pdf",
  ),
  path.join(root, "cv-erick-vargas.pdf"),
];
const COVER_PATH = path.join(root, "cover-letter-oscar.txt");
const PHOTO_PATH = path.join(process.env.USERPROFILE ?? "", "Downloads", "img_user.jpg");

function pickCv() {
  for (const p of CV_CANDIDATES) {
    if (p && fs.existsSync(p)) return p;
  }
  throw new Error("CV not found");
}

async function fillVisibleForm(page) {
  const cvPath = pickCv();
  const cover = fs.readFileSync(COVER_PATH, "utf8");
  console.log("CV:", cvPath);

  const map = [
    [/first name/i, "Erick"],
    [/last name/i, "Vargas Ramos"],
    [/phone|mobile/i, "+34614769119"],
    [/linkedin/i, "https://linkedin.com/in/erick-vargas-ramos-1ab86b102"],
    [/github|portfolio|website/i, "https://github.com/erickorso/adolfo"],
    [/city|location/i, "Madrid, Spain"],
  ];
  for (const [re, val] of map) {
    const el = page.getByLabel(re).first();
    if (await el.isVisible().catch(() => false)) await el.fill(val);
  }

  const tas = page.locator("textarea:visible");
  const tn = await tas.count();
  for (let i = 0; i < tn; i++) {
    const ta = tas.nth(i);
    const id = (await ta.getAttribute("id")) || "";
    if (id.includes("recaptcha")) continue;
    await ta.fill(cover);
  }

  const files = page.locator('input[type="file"]');
  const fn = await files.count();
  console.log("file inputs:", fn);
  if (fn > 0) await files.nth(0).setInputFiles(cvPath);
  if (fn > 1 && fs.existsSync(PHOTO_PATH)) {
    await files.nth(1).setInputFiles(PHOTO_PATH).catch(() => {});
  }

  const checks = page.locator('input[type="checkbox"]:visible');
  const cn = await checks.count();
  for (let i = 0; i < cn; i++) {
    await checks.nth(i).check({ force: true }).catch(() => {});
  }
}

const browser = await chromium.launch({ headless: false, slowMo: 40 });
const page = await browser.newPage();

try {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1500);

  for (const re of [/accept all/i, /allow all/i]) {
    const b = page.getByRole("button", { name: re }).first();
    if (await b.isVisible().catch(() => false)) await b.click();
  }

  if (!(await page.locator("input[type=email]").first().isVisible().catch(() => false))) {
    await page.getByRole("button", { name: /apply now/i }).first().click().catch(() => {});
    await page.waitForTimeout(1200);
  }

  const email = page.locator("input[type=email]").first();
  await email.fill("erickorso@gmail.com");
  await email.blur();
  await page.waitForTimeout(500);

  console.log("────────────────────────────────────────");
  console.log("Email rellenado: erickorso@gmail.com");
  console.log("1) Si hay captcha → resolvelo");
  console.log("2) Click CONTINUE (puede estar disabled hasta captcha)");
  console.log("3) Cuando aparezca el form de CV, avisame o esperá — relleno automático al detectar file input");
  console.log("Cover: jobs/cover-letter-oscar.txt");
  console.log("────────────────────────────────────────");

  // Poll for application form (file input or name fields) up to ~4 min
  const deadline = Date.now() + 240_000;
  let filled = false;
  while (Date.now() < deadline) {
    const hasFile = await page.locator('input[type="file"]').count();
    const hasFirst = await page.getByLabel(/first name/i).count();
    const continueBtn = page.getByTestId("ContinueButton").or(page.getByRole("button", { name: /^continue$/i }));
    if ((await continueBtn.isEnabled().catch(() => false)) && !(await page.locator('input[type="file"]').count())) {
      // try click continue if enabled
      await continueBtn.first().click().catch(() => {});
      await page.waitForTimeout(1500);
    }
    if (hasFile > 0 || hasFirst > 0) {
      await fillVisibleForm(page);
      filled = true;
      await page.screenshot({
        path: path.join(root, "oscar-form-filled.png"),
        fullPage: true,
      });
      console.log("Form avanzado rellenado → jobs/oscar-form-filled.png");
      console.log("Revisá y Submit final.");
      break;
    }
    await page.waitForTimeout(2000);
  }

  if (!filled) {
    console.log("No apareció el form completo a tiempo. Seguí a mano; cover lista en txt.");
    await page.screenshot({
      path: path.join(root, "oscar-form-partial.png"),
      fullPage: true,
    });
  }

  console.log("Browser abierto 3 minutos más…");
  await page.waitForTimeout(180_000);
} catch (err) {
  console.error(err);
  await page
    .screenshot({ path: path.join(root, "oscar-form-error.png"), fullPage: true })
    .catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close().catch(() => {});
}
