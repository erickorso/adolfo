import { readFileSync, writeFileSync } from "node:fs";

const url = process.argv[2];
if (!url) {
  console.error("Uso: node scripts/set-auth-url.mjs <url>");
  process.exit(1);
}

let content = readFileSync(".env", "utf8");
const line = `AUTH_URL="${url}"`;
if (/^AUTH_URL=/m.test(content)) {
  content = content.replace(/^AUTH_URL=.*$/m, line);
} else {
  content = `${content.trimEnd()}\n${line}\n`;
}
writeFileSync(".env", content);
console.log(`AUTH_URL=${url}`);
