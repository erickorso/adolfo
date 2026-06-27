import fs from "node:fs";
import { PDFDocument } from "pdf-lib";

const INPUT = process.argv[2];
if (!INPUT) {
  console.error("Usage: node inspect-pdf-fields.mjs <pdf>");
  process.exit(1);
}

const pdf = await PDFDocument.load(fs.readFileSync(INPUT));
const form = pdf.getForm();
const fields = form.getFields();

console.log(`Pages: ${pdf.getPageCount()}`);
console.log(`Fields (${fields.length}):`);
for (const field of fields) {
  const name = field.getName();
  const type = field.constructor.name;
  let extra = "";
  try {
    if (type === "PDFTextField") extra = ` = "${field.getText()}"`;
    if (type === "PDFCheckBox") extra = ` checked=${field.isChecked()}`;
    if (type === "PDFRadioGroup") extra = ` options=${field.getOptions().join("|")}`;
  } catch {
    // ignore
  }
  console.log(`- ${name} [${type}]${extra}`);
}
