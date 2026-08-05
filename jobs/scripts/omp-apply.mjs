/**
 * Fill OMP apply form — selectors by placeholder / order (labels not wired).
 *   node jobs/scripts/omp-apply.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const URL =
  "https://careers.omp.com/apply?job=4831744101&title=Front+end+Software+Architect++(ES-Barcelona)&location=Spain-Barcelona&utm_source=linkedin&utm_medium=jobboard&utm_campaign=greenhouse&gh_src=f23af982teu";

const CV_CANDIDATES = [
  path.join(
    process.env.USERPROFILE ?? "",
    "Downloads",
    "Erick Vargas Ramos - SSE Frontend Lead.pdf",
  ),
  path.join(root, "cv-erick-vargas.pdf"),
];
const COVER_TXT = path.join(root, "cover-letter-en.txt");
const COVER_PDF = path.join(root, "cover-letter-en.pdf");

function pickCv() {
  for (const p of CV_CANDIDATES) {
    if (p && fs.existsSync(p)) return p;
  }
  throw new Error("CV not found");
}

async function fillNearLabel(page, labelRe, value) {
  const label = page.getByText(labelRe).first();
  if (!(await label.count())) return false;
  const box = label.locator(
    "xpath=ancestor::*[.//input or .//textarea or .//select][1]//input | ancestor::*[.//textarea][1]//textarea | ancestor::*[.//select][1]//select",
  ).first();
  // Simpler: following input in container
  const container = label.locator("xpath=ancestor::div[contains(@class,'field') or contains(@class,'Form') or contains(@class,'input')][1]");
  let input = container.locator("input, textarea, select").first();
  if (!(await input.count())) {
    input = label.locator("xpath=following::input[1] | following::textarea[1] | following::select[1]").first();
  }
  if (!(await input.count())) return false;
  const tag = await input.evaluate((el) => el.tagName.toLowerCase());
  if (tag === "select") {
    await input.selectOption({ label: value }).catch(async () => {
      await input.selectOption({ value });
    });
  } else {
    await input.fill(value);
  }
  return true;
}

const browser = await chromium.launch({ headless: false, slowMo: 40 });
const page = await browser.newPage();

try {
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90_000 }).catch(async () => {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  });
  await page.waitForTimeout(2500);

  // Dump for debug
  const meta = await page.evaluate(() =>
    [...document.querySelectorAll("input, textarea, select")].map((el, i) => ({
      i,
      tag: el.tagName,
      type: el.type || null,
      name: el.name || null,
      id: el.id || null,
      ph: el.placeholder || null,
    })),
  );
  console.log("fields:", JSON.stringify(meta, null, 2));

  // Fill by index / placeholder heuristics
  const texts = page.locator('input[type="text"], input:not([type]), input[type="email"], input[type="url"]');
  // Typical order after Job: first, last, email, linkedin, website, years...
  const allInputs = page.locator("input:visible, textarea:visible, select:visible");
  const count = await allInputs.count();
  console.log("visible controls:", count);

  await fillNearLabel(page, /^First name/i, "Erick");
  await fillNearLabel(page, /^Last name/i, "Vargas Ramos");
  await fillNearLabel(page, /^Email/i, "erickorso@gmail.com");
  await fillNearLabel(page, /LinkedIn/i, "https://linkedin.com/in/erick-vargas-ramos-1ab86b102");
  await fillNearLabel(page, /website/i, "https://github.com/erickorso/adolfo");

  // Years — try select or text
  const yearsFilled =
    (await fillNearLabel(page, /Years of experience/i, "10+")) ||
    (await fillNearLabel(page, /Years of experience/i, "10"));
  if (!yearsFilled) {
    const sel = page.locator("select").filter({ hasText: /10|\+/ }).first();
    await page.locator("select").nth(0).selectOption({ label: "10+" }).catch(async () => {
      await page.getByRole("combobox").nth(0).click();
      await page.getByRole("option", { name: "10+" }).click().catch(() => {});
    });
  }

  // Work permit radio
  await page.getByText(/I don't need a work permit/i).click({ force: true }).catch(async () => {
    await page.locator('input[type=radio]').nth(1).check({ force: true });
  });

  await fillNearLabel(page, /Country of residence/i, "Spain");
  await page.locator("select").filter({ hasText: /Spain|Afghanistan/ }).first().selectOption({ label: "Spain" }).catch(async () => {
    // try last country-looking select
    const selects = page.locator("select");
    const n = await selects.count();
    for (let i = 0; i < n; i++) {
      const opts = await selects.nth(i).locator("option").allTextContents();
      if (opts.some((o) => o.trim() === "Spain")) {
        await selects.nth(i).selectOption({ label: "Spain" });
        break;
      }
    }
  });

  await fillNearLabel(page, /How did you find us/i, "LinkedIn");
  await page.locator("select").nth(2).selectOption({ label: "LinkedIn" }).catch(async () => {
    const selects = page.locator("select");
    const n = await selects.count();
    for (let i = 0; i < n; i++) {
      const opts = await selects.nth(i).locator("option").allTextContents();
      if (opts.some((o) => /LinkedIn/i.test(o))) {
        await selects.nth(i).selectOption({ label: "LinkedIn" });
        break;
      }
    }
  });

  // Please specify if visible
  await fillNearLabel(page, /Please specify/i, "LinkedIn job board");

  const cvPath = pickCv();
  console.log("CV:", cvPath);
  const fileInputs = page.locator('input[type="file"]');
  const fn = await fileInputs.count();
  console.log("file inputs:", fn);
  if (fn > 0) await fileInputs.nth(0).setInputFiles(cvPath);
  if (fn > 1 && fs.existsSync(COVER_PDF)) {
    await fileInputs.nth(1).setInputFiles(COVER_PDF);
  } else {
    const ta = page.locator("textarea").first();
    if (await ta.isVisible().catch(() => false)) {
      await ta.fill(fs.readFileSync(COVER_TXT, "utf8").trim());
    }
  }

  await page.getByText(/I give consent/i).click({ force: true }).catch(async () => {
    await page.locator('input[type="checkbox"]').last().check({ force: true });
  });

  await page.screenshot({
    path: path.join(root, "omp-form-filled.png"),
    fullPage: true,
  });
  console.log("Screenshot: jobs/omp-form-filled.png");
  console.log("────────────────────────────────────────");
  console.log("Revisá el form. OMP prohíbe IA — cover = cover-letter-en existente.");
  console.log("Rol es Barcelona — confirmá si te encaja vs Madrid.");
  console.log("Click Submit vos. Browser 5 min…");
  console.log("────────────────────────────────────────");
  await page.waitForTimeout(300_000);
} catch (err) {
  console.error(err);
  await page
    .screenshot({ path: path.join(root, "omp-form-error.png"), fullPage: true })
    .catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close().catch(() => {});
}
