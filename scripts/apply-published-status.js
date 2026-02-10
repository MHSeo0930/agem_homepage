const fs = require("fs");
const path = require("path");

const contentPath = path.join(__dirname, "../data/content.json");
const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));

let pubs = JSON.parse(content.journalPublications);
if (!Array.isArray(pubs)) {
  console.error("journalPublications is not an array");
  process.exit(1);
}

const needPublished = (s) =>
  s === undefined || s === null || s === "" || s === "게재됨";
const keepAsIs = (s) =>
  s === "submitted" || s === "accepted" || s === "in press" || s === "published";

let updated = 0;
pubs = pubs.map((p) => {
  const current = p.status;
  if (keepAsIs(current)) return p;
  if (needPublished(current)) {
    updated++;
    return { ...p, status: "published" };
  }
  // any other value → treat as published for display
  updated++;
  return { ...p, status: "published" };
});

content.journalPublications = JSON.stringify(pubs);
fs.writeFileSync(contentPath, JSON.stringify(content), "utf8");
console.log("Applied status 'published' to", updated, "publications (was empty or 게재됨).");
