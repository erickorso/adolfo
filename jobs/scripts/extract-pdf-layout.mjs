import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const INPUT = process.argv[2];
const data = new Uint8Array(fs.readFileSync(INPUT));
const doc = await getDocument({ data, disableWorker: true }).promise;

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const viewport = page.getViewport({ scale: 1 });
  console.log(`Page ${p}: ${viewport.width}x${viewport.height}`);
  const content = await page.getTextContent();
  for (const item of content.items) {
    if (!item.str?.trim()) continue;
    const [a, b, c, d, x, y] = item.transform;
    console.log(`[${Math.round(x)},${Math.round(y)}] ${JSON.stringify(item.str)}`);
  }
}
