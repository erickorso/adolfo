/**
 * Fill Landbot application form (does NOT submit unless --submit).
 *
 * Usage:
 *   node jobs/scripts/landbot-apply.mjs
 *   node jobs/scripts/landbot-apply.mjs --submit
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SUBMIT = process.argv.includes("--submit");
const URL =
  "https://jobs.landbot.io/o/senior-frontend-engineer-ai-saas-1/c/new?source=LinkedIn+Basic+Jobs";

const CV_CANDIDATES = [
  path.join(
    process.env.USERPROFILE ?? "",
    "Downloads",
    "Erick Vargas Ramos - SSE Frontend Lead.pdf",
  ),
  path.join(root, "cv-erick-vargas.pdf"),
];

const COVER_PATH = path.join(root, "cover-letter-landbot.txt");

const APPLICANT = {
  fullName: "Erick Vargas Ramos",
  email: "erickorso@gmail.com",
  phone: "+34614769119",
  locationLabel: "Madrid",
};

function pickCv() {
  for (const p of CV_CANDIDATES) {
    if (p && fs.existsSync(p)) return p;
  }
  throw new Error("CV PDF not found. Place resume in Downloads or jobs/cv-erick-vargas.pdf");
}

async function fillByLabel(page, labelRe, value) {
  const field = page.getByLabel(labelRe, { exact: false }).first();
  if (await field.count()) {
    await field.fill(value);
    return true;
  }
  return false;
}

async function fillByPlaceholderOrName(page, hints, value) {
  for (const hint of hints) {
    const byName = page.locator(`[name="${hint}"], [id="${hint}"]`).first();
    if (await byName.count()) {
      await byName.fill(value);
      return true;
    }
    const byPh = page.getByPlaceholder(new RegExp(hint, "i")).first();
    if (await byPh.count()) {
      await byPh.fill(value);
      return true;
    }
  }
  return false;
}

const browser = await chromium.launch({ headless: false, slowMo: 80 });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1500);

  // Cookie banner
  const agreeAll = page.getByRole("button", { name: /agree to all/i });
  if (await agreeAll.isVisible().catch(() => false)) {
    await agreeAll.click();
    await page.waitForTimeout(500);
  } else {
    const agreeNec = page.getByRole("button", { name: /agree to necessary/i });
    if (await agreeNec.isVisible().catch(() => false)) await agreeNec.click();
  }

  // Only abort if the visible banner says already applied (template text may exist hidden in DOM)
  const already = page.getByText(/you have already applied for this job/i);
  if (await already.isVisible().catch(() => false)) {
    console.log("⚠️  Already applied for this job. Aborting submit.");
    await page.screenshot({
      path: path.join(root, "landbot-already-applied.png"),
      fullPage: true,
    });
    await page.waitForTimeout(4000);
    await browser.close();
    process.exit(0);
  }

  const cvPath = pickCv();
  const cover = fs.readFileSync(COVER_PATH, "utf8");
  console.log("CV:", cvPath);

  // Name / email / phone — try accessible labels first
  if (!(await fillByLabel(page, /full name/i, APPLICANT.fullName))) {
    await fillByPlaceholderOrName(page, ["name", "full_name", "fullName"], APPLICANT.fullName);
  }
  if (!(await fillByLabel(page, /email/i, APPLICANT.email))) {
    await fillByPlaceholderOrName(page, ["email", "email_address"], APPLICANT.email);
  }
  if (!(await fillByLabel(page, /phone/i, APPLICANT.phone))) {
    await fillByPlaceholderOrName(page, ["phone", "phone_number", "tel"], APPLICANT.phone);
  }

  // Country: already Spain in many Recruitee forms; click if needed
  const spain = page.getByRole("option", { name: /^Spain$/i }).first();
  if (await spain.count()) {
    // ignore
  }

  // CV upload — first file input (resume)
  const fileInputs = page.locator('input[type="file"]');
  const fileCount = await fileInputs.count();
  console.log("file inputs:", fileCount);
  if (fileCount < 1) throw new Error("No file input for CV");
  await fileInputs.nth(0).setInputFiles(cvPath);

  // Cover letter: "Write a cover letter" / "Write it here"
  const writeCover = page
    .getByRole("button", { name: /write (a )?cover letter|write it here/i })
    .or(page.getByText(/write (a )?cover letter|write it here/i))
    .first();
  if (await writeCover.isVisible().catch(() => false)) {
    await writeCover.click();
    await page.waitForTimeout(500);
  }
  const coverArea = page.locator("textarea").first();
  if (await coverArea.count()) {
    await coverArea.fill(cover);
  }

  // Preferred work location: Madrid (checkbox)
  const madrid = page.getByText(/Madrid \(Madrid/i).first();
  if (await madrid.isVisible().catch(() => false)) {
    await madrid.click();
  } else {
    await page.getByLabel(/Madrid/i).first().check({ force: true }).catch(() => {});
  }

  // Privacy Policy checkbox (required)
  const privacy = page.getByLabel(/privacy policy/i).first();
  if (await privacy.count()) {
    await privacy.check({ force: true }).catch(async () => {
      await page.locator('input[type="checkbox"]').last().check({ force: true });
    });
  }

  await page.screenshot({
    path: path.join(root, "landbot-form-filled.png"),
    fullPage: true,
  });
  console.log("Screenshot: jobs/landbot-form-filled.png");

  if (!SUBMIT) {
    console.log("────────────────────────────────────────");
    console.log("Formulario rellenado.");
    console.log("1) Resolvé el captcha / validación de robots");
    console.log("2) Revisá datos (nombre, email, CV, Madrid, Privacy)");
    console.log("3) Click en Send");
    console.log("Browser abierto 5 minutos…");
    console.log("────────────────────────────────────────");
    await page.waitForTimeout(300_000);
  } else {
    // Manual-assisted submit: wait for user to pass captcha then click Send if still enabled
    console.log("────────────────────────────────────────");
    console.log("Formulario rellenado. Resolvé el captcha ahora.");
    console.log("Cuando esté listo, el script intentará Send en ~90s");
    console.log("o hacé click vos en Send.");
    console.log("────────────────────────────────────────");
    await page.waitForTimeout(90_000);
    const send = page.getByRole("button", { name: /^send$/i }).first();
    if (await send.isEnabled().catch(() => false)) {
      await send.click().catch(() => {});
      await page.waitForTimeout(3000);
    }
    const successVisible = page.getByText(/your application has been successfully submitted/i);
    const ok = await successVisible.isVisible().catch(() => false);
    await page.screenshot({
      path: path.join(root, "landbot-form-submitted.png"),
      fullPage: true,
    });
    console.log(ok ? "✅ Envío confirmado en pantalla" : "⚠️  No vi confirmación — mirá si enviaste a mano");
    await page.waitForTimeout(15_000);
  }
} catch (err) {
  console.error(err);
  await page.screenshot({
    path: path.join(root, "landbot-form-error.png"),
    fullPage: true,
  }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
