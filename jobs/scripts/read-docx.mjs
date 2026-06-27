import fs from "node:fs";
import path from "node:path";

const docxPath = process.argv[2];
if (!docxPath) {
  console.error("Usage: node read-docx.mjs <file.docx>");
  process.exit(1);
}

const buf = fs.readFileSync(docxPath);
const zipMarker = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
if (buf.indexOf(zipMarker) !== 0) {
  console.error("Not a zip/docx file");
  process.exit(1);
}

// Minimal: extract word/document.xml from docx (zip)
import { inflateRawSync } from "node:zlib";

function findLocalFileEntries(data) {
  const entries = [];
  let offset = 0;
  while (offset < data.length - 30) {
    if (data.readUInt32LE(offset) !== 0x04034b50) break;
    const compMethod = data.readUInt16LE(offset + 8);
    const compSize = data.readUInt32LE(offset + 18);
    const nameLen = data.readUInt16LE(offset + 26);
    const extraLen = data.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const name = data.toString("utf8", nameStart, nameStart + nameLen);
    const dataStart = nameStart + nameLen + extraLen;
    const compData = data.subarray(dataStart, dataStart + compSize);
    entries.push({ name, compMethod, compData });
    offset = dataStart + compSize;
  }
  return entries;
}

const entries = findLocalFileEntries(buf);
const docEntry = entries.find((e) => e.name === "word/document.xml");
if (!docEntry) {
  console.error("document.xml not found");
  process.exit(1);
}

const xml =
  docEntry.compMethod === 0
    ? docEntry.compData.toString("utf8")
    : inflateRawSync(docEntry.compData).toString("utf8");

const text = xml
  .replace(/<w:tab[^/]*\/>/g, "\t")
  .replace(/<w:br[^/]*\/>/g, "\n")
  .replace(/<\/w:p>/g, "\n")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

console.log(text);
