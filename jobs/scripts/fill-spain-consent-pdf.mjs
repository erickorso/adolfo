import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT =
  process.env.CONSENT_INPUT ??
  "c:/Users/TrendingPc/Downloads/Spain Special Consent Form.pdf";
const OUTPUT =
  process.env.CONSENT_OUTPUT ??
  "c:/Users/TrendingPc/Downloads/Spain-Special-Consent-Erick-Vargas-COMPLETO.pdf";
const SIGNATURE_PATH =
  process.env.CONSENT_SIGNATURE ?? path.join(__dirname, "../assets/firma-erick.png");

const ANTECEDENTES_PENALES =
  process.env.ANTECEDENTES_PENALES ??
  "c:/Users/TrendingPc/Downloads/thay/erick_antecedentes_spain.jpeg";

const ANTECEDENTES_SEXUALES =
  process.env.ANTECEDENTES_SEXUALES ??
  "c:/Users/TrendingPc/Downloads/thay/erick_antecedentes_spain_sex.jpeg";

const DATA = {
  nombreCompleto: "ERICK MAXIMILIANO VARGAS RAMOS",
  documento: "186096343",
  padres: "D. PAUL VARGAS BALDA y Dª. MARIA RAMOS OVIEDO",
  fechaDia: "20",
  fechaMes: "06",
  fechaAnio: "2026",
};

async function embedImage(pdf, imagePath) {
  const bytes = fs.readFileSync(imagePath);
  const lower = imagePath.toLowerCase();
  if (lower.endsWith(".png")) return pdf.embedPng(bytes);
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return pdf.embedJpg(bytes);
  throw new Error(`Formato no soportado: ${imagePath}`);
}

async function appendImagePage(pdf, imagePath, label) {
  if (!fs.existsSync(imagePath)) {
    console.warn(`No encontrado (${label}): ${imagePath}`);
    return;
  }

  const image = await embedImage(pdf, imagePath);
  const page = pdf.addPage([595.32, 841.92]);
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const margin = 24;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;

  page.drawImage(image, {
    x: (pageWidth - drawWidth) / 2,
    y: (pageHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  });
}

const pdf = await PDFDocument.load(fs.readFileSync(INPUT));
const page = pdf.getPages()[0];
const font = await pdf.embedFont(StandardFonts.Helvetica);
const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
const size = 10;
const color = rgb(0, 0, 0.35);

function draw(text, x, y, opts = {}) {
  page.drawText(text, {
    x,
    y,
    size: opts.size ?? size,
    font: opts.bold ? fontBold : font,
    color: opts.color ?? color,
  });
}

// Líneas del formulario (coordenadas PDF, origen abajo-izquierda)
draw(DATA.nombreCompleto, 48, 672);
draw(DATA.documento, 48, 633);
draw(DATA.padres, 48, 600);
draw(DATA.fechaDia, 118, 252, { size: 11 });
draw(DATA.fechaMes, 158, 252, { size: 11 });
draw(DATA.fechaAnio, 198, 252, { size: 11 });

if (fs.existsSync(SIGNATURE_PATH)) {
  const image = await pdf.embedPng(fs.readFileSync(SIGNATURE_PATH));
  const boxWidth = 150;
  const boxHeight = Math.min((image.height / image.width) * boxWidth, 36);
  page.drawImage(image, {
    x: 130,
    y: 205,
    width: boxWidth,
    height: boxHeight,
  });
}

draw(DATA.nombreCompleto, 130, 195, { size: 7, color: rgb(0, 0, 0) });

await appendImagePage(pdf, ANTECEDENTES_PENALES, "antecedentes penales");
await appendImagePage(pdf, ANTECEDENTES_SEXUALES, "registro sexual");

fs.writeFileSync(OUTPUT, await pdf.save());
console.log(`Guardado: ${OUTPUT}`);
console.log(`Páginas: ${pdf.getPageCount()}`);
