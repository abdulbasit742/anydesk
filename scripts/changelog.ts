import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';

interface ChangelogEntry {
  hash: string;
  subject: string;
  author: string;
  date: string;
}

function getCommits(sinceTag?: string): ChangelogEntry[] {
  const format = '%H|%s|%an|%ad';
  const range = sinceTag ? `${sinceTag}..HEAD` : 'HEAD~30..HEAD';
  const output = execSync(`git log ${range} --format="${format}" --date=short`, { encoding: 'utf-8' });

  return output.trim().split('\n').filter(Boolean).map((line) => {
    const [hash, subject, author, date] = line.split('|');
    return { hash: hash.slice(0, 7), subject, author, date };
  });
}

function generateChangelog(): string {
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  const version = pkg.version;
  const date = new Date().toISOString().split('T')[0];
  const commits = getCommits();

  const sections: Record<string, string[]> = {
    feat: [],
    fix: [],
    chore: [],
    docs: [],
    other: [],
  };

  for (const commit of commits) {
    if (commit.subject.startsWith('feat:')) sections.feat.push(commit.subject);
    else if (commit.subject.startsWith('fix:')) sections.fix.push(commit.subject);
    else if (commit.subject.startsWith('chore:')) sections.chore.push(commit.subject);
    else if (commit.subject.startsWith('docs:')) sections.docs.push(commit.subject);
    else sections.other.push(commit.subject);
  }

  let markdown = `## [${version}] - ${date}\n\n`;

  if (sections.feat.length) markdown += `### Features\n${sections.feat.map((s) => `- ${s}`).join('\n')}\n\n`;
  if (sections.fix.length) markdown += `### Bug Fixes\n${sections.fix.map((s) => `- ${s}`).join('\n')}\n\n`;
  if (sections.chore.length) markdown += `### Chores\n${sections.chore.map((s) => `- ${s}`).join('\n')}\n\n`;
  if (sections.docs.length) markdown += `### Documentation\n${sections.docs.map((s) => `- ${s}`).join('\n')}\n\n`;
  if (sections.other.length) markdown += `### Other\n${sections.other.map((s) => `- ${s}`).join('\n')}\n\n`;

  return markdown;
}

function main() {
  const changelogPath = 'CHANGELOG.md';
  const newEntry = generateChangelog();

  let existing = '';
  if (existsSync(changelogPath)) {
    existing = readFileSync(changelogPath, 'utf-8');
  } else {
    existing = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
  }

  const headerEnd = existing.indexOf('## [');
  const insertPoint = headerEnd === -1 ? existing.length : headerEnd;

  const updated = existing.slice(0, insertPoint) + newEntry + existing.slice(insertPoint);
  writeFileSync(changelogPath, updated);

  console.log('Changelog updated');
}

main();
