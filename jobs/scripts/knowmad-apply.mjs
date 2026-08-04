/**
 * Fill knowmad mood Teamtailor application (manual Enviar).
 *   node jobs/scripts/knowmad-apply.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const URL =
  "https://knowmadmood.teamtailor.com/jobs/7707399-frontend-react-senior-mentor-lider-equipo-100-remoto";

const CV_CANDIDATES = [
  path.join(
    process.env.USERPROFILE ?? "",
    "Downloads",
    "Erick Vargas Ramos - SSE Frontend Lead.pdf",
  ),
  path.join(root, "cv-erick-vargas.pdf"),
];

const COVER_PATH = path.join(root, "cover-letter-knowmad.txt");

function pickCv() {
  for (const p of CV_CANDIDATES) {
    if (p && fs.existsSync(p)) return p;
  }
  throw new Error("CV PDF not found");
}

const ANSWERS = {
  salary: "55000",
  redux:
    "Sí. +10 años con React; Redux / Redux Toolkit / Redux-Saga en producción (fintech y analytics). Uso habitual de Context, React Query y patrones modernos según el producto.",
  mfe:
    "Sí. Experiencia con shell de aplicación (Next.js App Router) como contenedor de paneles/módulos, composición de features y límites claros entre dominios. Familiarizado con microfrontends (Module Federation / shell+remotes) y listo para aplicar el patrón Inditex.",
  testing:
    "Sí, nivel alto: Jest + React Testing Library (unit/integración), Playwright/Cypress (E2E), MSW y tests de contrato/API. Impulso coverage en flujos críticos y calidad en PRs.",
  leadership:
    "Sí. Frontend Lead en Krunchbox: equipo de 3, mentoring, code review, arquitectura y entrega. Antes liderazgo técnico en J.P. Morgan. Enfoque hands-on + subir el listón del equipo.",
};

const browser = await chromium.launch({ headless: false, slowMo: 50 });
const page = await browser.newPage();

try {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(1000);

  const acceptCookies = page.getByRole("button", {
    name: /aceptar todas las cookies/i,
  });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
    await page.waitForTimeout(400);
  }

  // Scroll to form / click apply
  const apply = page.getByRole("link", { name: /enviar solicitud/i }).first();
  if (await apply.isVisible().catch(() => false)) {
    await apply.click();
  } else {
    await page.getByText(/enviar solicitud/i).first().click().catch(() => {});
  }
  await page.waitForSelector("#candidate_first_name", { timeout: 30_000 });

  // Custom questions
  await page.locator("#candidate_answers_attributes_0_number").fill(ANSWERS.salary);
  await page.locator("#candidate_answers_attributes_1_text").fill(ANSWERS.redux);
  await page.locator("#candidate_answers_attributes_2_text").fill(ANSWERS.mfe);
  await page.locator("#candidate_answers_attributes_3_text").fill(ANSWERS.testing);
  await page.locator("#candidate_answers_attributes_4_text").fill(ANSWERS.leadership);

  // Identity
  await page.locator("#candidate_first_name").fill("Erick");
  await page.locator("#candidate_last_name").fill("Vargas Ramos");
  await page.locator("#candidate_email").fill("erickorso@gmail.com");
  await page.locator("#candidate_phone").fill("+34614769119");

  // CV (first file input = resume)
  const cvPath = pickCv();
  console.log("CV:", cvPath);
  await page.locator("#candidate_resume_remote_url").setInputFiles(cvPath);

  // Cover letter
  const cover = fs.readFileSync(COVER_PATH, "utf8");
  await page
    .locator("#candidate_job_applications_attributes_0_cover_letter")
    .fill(cover);

  // Required consent
  await page.locator("#candidate_consent_given").check({ force: true });
  // Optional future jobs — check to keep door open
  await page
    .locator("#candidate_consent_given_future_jobs")
    .check({ force: true })
    .catch(() => {});

  await page.screenshot({
    path: path.join(root, "knowmad-form-filled.png"),
    fullPage: true,
  });
  console.log("Screenshot: jobs/knowmad-form-filled.png");
  console.log("────────────────────────────────────────");
  console.log("Formulario rellenado.");
  console.log("Revisá salario (55000), respuestas, CV y consent.");
  console.log("Luego click ENVIAR SOLICITUD.");
  console.log("Browser abierto 5 minutos…");
  console.log("────────────────────────────────────────");
  await page.waitForTimeout(300_000);
} catch (err) {
  console.error(err);
  await page
    .screenshot({ path: path.join(root, "knowmad-form-error.png"), fullPage: true })
    .catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close().catch(() => {});
}
