import fs from "node:fs";
import { extractText, getDocumentProxy } from "unpdf";

const INPUT = process.argv[2];
const data = new Uint8Array(fs.readFileSync(INPUT));
const pdf = await getDocumentProxy(data);
const { totalPages, text } = await extractText(data, { mergePages: false });
console.log("pages:", totalPages);
for (let i = 0; i < text.length; i++) {
  console.log(`\n--- Page ${i + 1} ---\n`);
  console.log(text[i]);
}
