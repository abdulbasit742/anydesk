#!/usr/bin/env node
const { execSync } = require("child_process");

function generateChangelog(from, to = "HEAD") {
  const log = execSync(`git log ${from}..${to} --pretty=format:"%s (%h)" --reverse`).toString();
  const lines = log.split("\n").filter(Boolean);

  const sections = { feat: [], fix: [], docs: [], chore: [], other: [] };
  lines.forEach((line) => {
    if (line.startsWith("feat:")) sections.feat.push(line.replace("feat:", "-").trim());
    else if (line.startsWith("fix:")) sections.fix.push(line.replace("fix:", "-").trim());
    else if (line.startsWith("docs:")) sections.docs.push(line.replace("docs:", "-").trim());
    else if (line.startsWith("chore:")) sections.chore.push(line.replace("chore:", "-").trim());
    else sections.other.push(`- ${line}`);
  });

  let md = "## Changelog\n\n";
  if (sections.feat.length) md += "### Features\n" + sections.feat.join("\n") + "\n\n";
  if (sections.fix.length) md += "### Bug Fixes\n" + sections.fix.join("\n") + "\n\n";
  if (sections.docs.length) md += "### Documentation\n" + sections.docs.join("\n") + "\n\n";
  if (sections.chore.length) md += "### Chores\n" + sections.chore.join("\n") + "\n\n";
  if (sections.other.length) md += "### Other\n" + sections.other.join("\n") + "\n\n";
  return md;
}

if (require.main === module) {
  const from = process.argv[2] || "$(git describe --tags --abbrev=0)";
  console.log(generateChangelog(from));
}

module.exports = { generateChangelog };
