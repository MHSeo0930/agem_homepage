const fs = require("fs");
const path = require("path");

/**
 * Full citation string -> only "vol, pp" or "vol (issue), pp".
 * Removes journal name, year, IF/JCR and trailing notes.
 */
function toVolPpOnly(str) {
  if (!str || typeof str !== "string") return "";
  let s = str.trim();
  // Remove IF / JCR block and anything after
  const ifIdx = s.search(/\s*\(?\s*I\.?F\.?[^)]*\)/i);
  if (ifIdx !== -1) s = s.slice(0, ifIdx).trim();
  const jcrIdx = s.search(/\s*JCR\s*Ranking[^.]*\.?/i);
  if (jcrIdx !== -1) s = s.slice(0, jcrIdx).trim();
  // Remove trailing " - note" 
  const dashIdx = s.indexOf(" - ");
  if (dashIdx !== -1) s = s.slice(0, dashIdx).trim();
  s = s.replace(/\s*\.\s*$/, "");
  // Remove 4-digit year in parens (20xx or 19xx)
  s = s.replace(/\s*\(\s*20\d{2}\s*\)\s*/g, " ").replace(/\s*\(\s*19\d{2}\s*\)\s*/g, " ");
  s = s.trim();
  const dash = /[-\u2013]/g; // hyphen and en-dash
  const norm = (x) => (x || "").replace(/\s+/g, "").replace(/\u2013/g, "-");
  // Match "vol (issue), pp" e.g. "2 (6), 376-404" (allow ", , " after year removal)
  const volIssuePp = s.match(/(\d+)\s*\(\s*(\d+)\s*\)\s*,[\s,]*(\d+(?:\s*[-\u2013]\s*\d+)?)/);
  if (volIssuePp) return `${volIssuePp[1]} (${volIssuePp[2]}), ${norm(volIssuePp[3])}`;
  // Match "vol, pp" or "vol, pp-pp" at end - but not ") num, pp" (issue, pp)
  const volPp = s.match(/(\d+)\s*,\s*(\d+(?:[-–]\d+)?)\s*\.?$/);
  if (volPp) {
    const idx = s.lastIndexOf(volPp[0]);
    const notAfterParen = !(idx > 0 && s[idx - 1] === ")");
    const notYearAsVol = !/^(19|20)\d{2}$/.test(volPp[1]);
    if (notAfterParen && notYearAsVol) return `${volPp[1]}, ${norm(volPp[2])}`;
  }
  // Match "vol, artno" at end e.g. "8, e312" (skip when vol is year; skip single-digit pp that might be split art no)
  const volArt = s.match(/(\d+)\s*,\s*([e\d]+)\s*\.?$/);
  if (volArt && !/^(19|20)\d{2}$/.test(volArt[1]) && !(volArt[2].length === 1 && volArt[1].length > 4))
    return `${volArt[1]}, ${volArt[2]}`;
  // Match "vol, issue, pp" -> "vol, pp" e.g. "271, 1, 211-219" or "635, 1, 119471"
  const volIssueCommaPp = s.match(/(\d+)\s*,\s*\d+\s*,\s*(\d+(?:[-–]\d+)?)\s*\.?$/);
  if (volIssueCommaPp) return `${volIssueCommaPp[1]}, ${norm(volIssueCommaPp[2])}`;
  // "42(25) 16288-16293" -> "42 (25), 16288-16293"
  const compact = s.match(/(\d+)\s*\(\s*(\d+)\s*\)\s*(\d+[-–]\d+)/);
  if (compact) return `${compact[1]} (${compact[2]}), ${norm(compact[3])}`;
  // "vol, pp-pp" anywhere (not at end, to avoid ") 10, 225")
  const simple = s.match(/(\d+)\s*,\s*(\d+[-–]\d+)/);
  if (simple) return `${simple[1]}, ${norm(simple[2])}`;
  // "429-430 (2012) 39-47" -> "429-430, 39-47"
  const volRangePp = s.match(/(\d+[-–]?\d*)\s*,\s*(\d+[-–]\d+)\s*\.?$/);
  if (volRangePp) return `${norm(volRangePp[1])}, ${norm(volRangePp[2])}`;
  // After cleanup, take from first number: "Adv. Sci. 12 e02484" -> "12, e02484"
  const fromFirstNum = s.match(/(\d+)(?:\s*\(\s*(\d+)\s*\))?\s*,?\s*([\de]+(?:\s*[-\u2013]\s*[\de]+)?)\s*\.?$/);
  if (fromFirstNum) {
    const vol = fromFirstNum[1];
    const issue = fromFirstNum[2];
    const pp = norm(fromFirstNum[3]);
    // Don't use year as vol: return article number only e.g. "2401820", "2404540"
    if (/^(19|20)\d{2}$/.test(vol) && /^\d{5,}$/.test(pp)) return pp;
    if (issue) return `${vol} (${issue}), ${pp}`;
    if (vol === pp && vol.length > 4) return vol; // article number only e.g. 2404540
    // Single-digit pp with long vol likely split article number e.g. "2402389" -> "240238", "9"
    if (vol.length > 4 && /^\d$/.test(pp)) return vol + pp;
    return `${vol}, ${pp}`;
  }
  // "accepted" etc
  if (/accepted|in press/i.test(s)) return s.replace(/^[^,]+,?\s*/i, "").trim() || s;
  // Single article number at end (no comma) e.g. "Adv. Sci. 2402389" or "Small 2404540"
  const singleArtNo = s.match(/(\d{5,})\s*\.?$/);
  if (singleArtNo) return singleArtNo[1];
  return s;
}

const contentPath = path.join(__dirname, "../data/content.json");
const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
let pubs = JSON.parse(content.journalPublications);

pubs = pubs.map((p) => {
  const c = p.citation;
  if (!c) return p;
  const short = toVolPpOnly(c);
  return { ...p, citation: short || c };
});

content.journalPublications = JSON.stringify(pubs);
fs.writeFileSync(contentPath, JSON.stringify(content), "utf8");
console.log("Updated all citations to vol, pp only.");
console.log("Sample:", toVolPpOnly("J. Power Sources (2008) 179, 81-86. (IF = 9.794, JCR Ranking: 13.333 %)"));
