/* ============================================================
   verify.mjs — lightweight static checks for the 5 correctness
   properties defined in the design. No external dependencies:
   parses the static files directly and asserts structural facts.
   Run: node tests/verify.mjs
   ============================================================ */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const html = readFileSync(join(root, "index.html"), "utf8");
const css = readFileSync(join(root, "css", "styles.css"), "utf8");
const mainJs = readFileSync(join(root, "js", "main.js"), "utf8");
const bgJs = readFileSync(join(root, "js", "circuit-background.js"), "utf8");

let passed = 0;
let failed = 0;
const failures = [];

function assert(cond, msg) {
  if (cond) {
    passed++;
  } else {
    failed++;
    failures.push(msg);
  }
}

/* Helpers ---------------------------------------------------- */
function attrsOfAnchors(source) {
  // returns array of {href, target, rel, raw} for each <a ...>
  const out = [];
  const re = /<a\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(source)) !== null) {
    const raw = m[1];
    const href = (raw.match(/href\s*=\s*"([^"]*)"/i) || [])[1];
    const target = (raw.match(/target\s*=\s*"([^"]*)"/i) || [])[1];
    const rel = (raw.match(/rel\s*=\s*"([^"]*)"/i) || [])[1];
    out.push({ href, target, rel, raw });
  }
  return out;
}

const anchors = attrsOfAnchors(html);

/* ============================================================
   Property 1: Navigation and anchor correspondence
   ============================================================ */
(function property1() {
  // section ids from <section id="...">
  const sectionIds = [];
  const secRe = /<section\b[^>]*\bid\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = secRe.exec(html)) !== null) sectionIds.push(m[1]);

  // nav link targets from <a class="nav__link" href="#...">
  const navTargets = [];
  const navRe = /<a\b[^>]*class\s*=\s*"nav__link"[^>]*href\s*=\s*"#([^"]+)"/gi;
  while ((m = navRe.exec(html)) !== null) navTargets.push(m[1]);

  const expected = ["home", "about", "projects", "skills", "experience", "ai", "contact"];

  // all section ids unique
  const uniqueSections = new Set(sectionIds);
  assert(uniqueSections.size === sectionIds.length, "P1: section ids are not unique: " + sectionIds.join(","));

  // exactly the expected set of sections
  assert(
    expected.every((id) => uniqueSections.has(id)) && sectionIds.length === expected.length,
    "P1: sections != expected set. got=" + sectionIds.join(",")
  );

  // every nav target resolves to exactly one section
  navTargets.forEach((t) => {
    assert(uniqueSections.has(t), "P1: nav link #" + t + " has no matching section");
  });

  // every section is targeted by exactly one nav link
  sectionIds.forEach((id) => {
    const count = navTargets.filter((t) => t === id).length;
    assert(count === 1, "P1: section #" + id + " is targeted by " + count + " nav links (expected 1)");
  });

  // AI link labeled "AI" targeting #ai
  const aiLink = /<a\b[^>]*class\s*=\s*"nav__link"[^>]*href\s*=\s*"#ai"\s*>\s*AI\s*<\/a>/i.test(html);
  assert(aiLink, "P1: nav link labeled 'AI' targeting #ai not found");
})();

/* ============================================================
   Property 2: Every project card is complete
   (data-driven from js/main.js projects array)
   ============================================================ */
(function property2() {
  // crude but effective: pull the projects array literal and eval titles/descriptions
  const titleMatches = [...mainJs.matchAll(/title:\s*"([^"]*)"/g)].map((m) => m[1]);
  const descMatches = [...mainJs.matchAll(/description:\s*\n?\s*"([^"]*)"/g)].map((m) => m[1]);

  assert(titleMatches.length === 6, "P2: expected 6 project titles, found " + titleMatches.length);
  assert(descMatches.length === 6, "P2: expected 6 project descriptions, found " + descMatches.length);

  titleMatches.forEach((t, i) => assert(t.trim().length > 0, "P2: project " + i + " has empty title"));
  descMatches.forEach((d, i) => assert(d.trim().length > 0, "P2: project " + i + " has empty description"));

  // required project keywords present
  const required = ["OTTER", "FSK IR", "IEEE", "Parking Lot", "Dijkstra", "Firebase"];
  required.forEach((kw) => {
    assert(mainJs.includes(kw), "P2: required project keyword missing: " + kw);
  });
})();

/* ============================================================
   Property 3: External contact links open safely in a new tab
   ============================================================ */
(function property3() {
  anchors.forEach((a) => {
    if (!a.href) return;
    const isExternal = /^https?:\/\//i.test(a.href);
    if (!isExternal) return; // mailto/tel/relative excluded
    assert(a.target === "_blank", "P3: external link " + a.href + " missing target=_blank");
    assert(/noopener/.test(a.rel || ""), "P3: external link " + a.href + " missing rel=noopener");
  });

  // mailto and tel present and NOT target=_blank
  const mailto = anchors.find((a) => (a.href || "").startsWith("mailto:"));
  const tel = anchors.find((a) => (a.href || "").startsWith("tel:"));
  assert(!!mailto, "P3: mailto link missing");
  assert(!!tel, "P3: tel link missing");
  assert(mailto && mailto.target !== "_blank", "P3: mailto should not open new tab");
  assert(tel && tel.target !== "_blank", "P3: tel should not open new tab");
})();

/* ============================================================
   Property 4: Background never obstructs content or interaction
   ============================================================ */
(function property4() {
  // canvas exists, aria-hidden
  assert(/<canvas\b[^>]*id\s*=\s*"circuit-bg"[^>]*aria-hidden\s*=\s*"true"/i.test(html),
    "P4: canvas #circuit-bg missing or not aria-hidden");

  // CSS: #circuit-bg has negative/low z-index and pointer-events: none
  const bgBlock = (css.match(/#circuit-bg\s*\{[^}]*\}/i) || [""])[0];
  assert(/pointer-events\s*:\s*none/i.test(bgBlock), "P4: #circuit-bg missing pointer-events:none");
  assert(/z-index\s*:\s*-?\d+/i.test(bgBlock), "P4: #circuit-bg missing z-index");
  const z = parseInt((bgBlock.match(/z-index\s*:\s*(-?\d+)/i) || [])[1], 10);
  assert(z < 1, "P4: #circuit-bg z-index (" + z + ") should be below content");

  // header sits above content
  assert(/\.site-header\s*\{[^}]*z-index\s*:\s*1000/i.test(css), "P4: sticky header z-index not above content");
})();

/* ============================================================
   Property 5: Local asset references are relative
   ============================================================ */
(function property5() {
  // collect all href/src values
  const refs = [];
  const attrRe = /\b(?:href|src)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = attrRe.exec(html)) !== null) refs.push(m[1]);

  refs.forEach((ref) => {
    const isExternalProfile = /^https?:\/\//i.test(ref);
    const isMailOrTel = /^(mailto:|tel:)/i.test(ref);
    const isAnchor = ref.startsWith("#");
    if (isExternalProfile || isMailOrTel || isAnchor) return; // excluded

    // local asset: must not start with "/" and must not have a scheme+origin
    assert(!ref.startsWith("/"), "P5: local asset ref has leading slash: " + ref);
    assert(!/^[a-z]+:\/\//i.test(ref), "P5: local asset ref has absolute origin: " + ref);
  });

  // sanity: expected local assets referenced relatively
  ["css/styles.css", "js/main.js", "js/circuit-background.js", "assets/resume.pdf"].forEach((asset) => {
    assert(refs.includes(asset), "P5: expected relative asset reference missing: " + asset);
  });
})();

/* Extra structural sanity: reduced-motion + visibility handling in bg */
(function bgSanity() {
  assert(/prefers-reduced-motion/.test(bgJs), "BG: reduced-motion not handled");
  assert(/visibilitychange/.test(bgJs), "BG: visibilitychange not handled");
  assert(/devicePixelRatio/.test(bgJs), "BG: devicePixelRatio not used");
  assert(/getContext/.test(bgJs), "BG: canvas not feature-detected");
})();

/* Report ----------------------------------------------------- */
console.log("Passed: " + passed);
console.log("Failed: " + failed);
if (failed > 0) {
  console.log("\nFailures:");
  failures.forEach((f) => console.log("  - " + f));
  process.exit(1);
} else {
  console.log("\nAll correctness property checks passed.");
}
