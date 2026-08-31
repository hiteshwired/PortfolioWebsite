import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const h = readFileSync(join(__dirname, "..", "index.html"), "utf8");

const tags = ["html", "head", "body", "header", "nav", "main", "footer", "section", "ul", "li"];
let ok = true;
for (const t of tags) {
  const open = (h.match(new RegExp("<" + t + "\\b", "g")) || []).length;
  const close = (h.match(new RegExp("</" + t + ">", "g")) || []).length;
  const status = open === close ? "ok" : "MISMATCH";
  if (open !== close) ok = false;
  console.log(`${t}: open=${open} close=${close} ${status}`);
}
console.log("doctype:", /^<!DOCTYPE html>/i.test(h));
console.log("lang attr:", /<html lang="en">/i.test(h));
console.log(ok ? "STRUCTURE OK" : "STRUCTURE ISSUE");
process.exit(ok ? 0 : 1);
