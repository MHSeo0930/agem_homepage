const fs = require("fs");
const path = require("path");

const contentPath = path.join(__dirname, "../data/content.json");
const citationsPath = path.join(__dirname, "../data/journal_citations.txt");

const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const citationsText = fs.readFileSync(citationsPath, "utf8");

const lines = citationsText.split("\n").filter((l) => /^\d+\|/.test(l));
const citationByUserIndex = {};
lines.forEach((line) => {
  const match = line.match(/^(\d+)\|(.+)$/);
  if (match) citationByUserIndex[parseInt(match[1], 10)] = match[2].trim();
});

// user list 1 = site number 94, user 2 = site 93, ... user 94 = site 1
const citationBySiteNumber = {};
for (let i = 1; i <= 94; i++) {
  citationBySiteNumber[95 - i] = citationByUserIndex[i] || "";
}

let pubs = JSON.parse(content.journalPublications);
if (!Array.isArray(pubs)) {
  console.error("journalPublications is not an array");
  process.exit(1);
}

pubs = pubs.map((p) => {
  const num = typeof p.number === "number" ? p.number : parseInt(p.number, 10);
  if (num >= 1 && num <= 94 && citationBySiteNumber[num]) {
    return { ...p, citation: citationBySiteNumber[num] };
  }
  return p;
});

content.journalPublications = JSON.stringify(pubs);
fs.writeFileSync(contentPath, JSON.stringify(content), "utf8");
console.log("Injected citations for publications #1–#94.");
