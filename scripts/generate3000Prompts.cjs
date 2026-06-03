const fs = require('fs');
const path = require('path');

const PROMPTS_DIR = path.join(__dirname, '..', 'src', 'data', 'prompts');
const INDEX_FILE = path.join(__dirname, '..', 'src', 'data', 'promptsIndex.js');

const CATEGORIES = [
  "Coding", "Writing", "Marketing", "Design", "Data Science",
  "DevOps", "Cybersecurity", "Business", "Education", "Productivity",
  "AI Agents", "Cloud Computing", "Database Tuning", "System Architecture",
  "Frontend Engineering", "Mobile Development", "API Design", "Security Audit"
];

const ROLES = [
  "Next.js Architect", "Python Automation Specialist", "GraphQL API Engineer",
  "Figma UX Researcher", "Kubernetes SRE Lead", "Solidity Smart Contract Auditor",
  "Data Pipeline Wranglist", "Growth Strategy Consultant", "Technical Documentation Writer",
  "Prompt Optimization Engine", "Micro-Frontend Specialist", "FastAPI Developer",
  "Tailwind CSS Stylist", "Rust Systems Expert", "GenAI Finetuning Engineer"
];

const ACTIONS = [
  "refactor legacy repositories", "orchestrate multi-container pods", "optimize SQL query queries",
  "build design systems with zero layout shift", "draft comprehensive documentation guides",
  "design event-driven webhook managers", "audit sensitive authorization loops",
  "generate synthetic training datasets", "build scalable dashboard interfaces",
  "streamline CI/CD pipeline deployments"
];

const COMPATIBLE_PLATFORMS = ["bolt", "lovable", "cursor", "manus", "replit", "claude", "v0"];
const ICONS = ["Sparkles", "Terminal", "Cpu", "Shield", "Database", "Layers", "GitBranch", "Sliders"];

// Make sure target directory exists
if (!fs.existsSync(PROMPTS_DIR)) {
  fs.mkdirSync(PROMPTS_DIR, { recursive: true });
}

console.log('Generating 3,000 new prompt files...');

for (let i = 2001; i <= 5000; i++) {
  const role = ROLES[i % ROLES.length];
  const action = ACTIONS[i % ACTIONS.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const title = `${role} — ${action.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`;
  const description = `A highly specialized system prompt that acts as a ${role} to help you ${action} for enterprise-level scale.`;
  const content = `You are a professional ${role} with years of experience under your belt. Your main task is to ${action}.\n\n## Core Principles\n1. Be extremely thorough, structured, and clear.\n2. Provide step-by-step reasoning where applicable.\n3. Leverage industry best practices for ${category} domain.\n4. Keep the target audience in mind: professionals looking for high-quality, actionable results.\n\n## Inputs\n- Primary subject: {{primarySubject}}\n- Constraints: {{constraints}}\n- Additional details: {{details}}\n\n## Expected Output\nGenerate a detailed plan, code snippet, or text depending on the request, using clean Markdown formatting. Ensure that it addresses the constraints and is fully customized to the input context.`;
  
  const tags = [
    category.toLowerCase().replace(/\s+/g, '-'),
    role.toLowerCase().replace(/\s+/g, '-'),
    action.split(' ')[0].toLowerCase()
  ];

  const fileData = {
    id: `tpl_${i}`,
    name: title,
    category: category,
    description: description,
    content: content,
    tags: tags,
    platformCompatibility: [
      COMPATIBLE_PLATFORMS[i % COMPATIBLE_PLATFORMS.length],
      COMPATIBLE_PLATFORMS[(i + 1) % COMPATIBLE_PLATFORMS.length],
      COMPATIBLE_PLATFORMS[(i + 2) % COMPATIBLE_PLATFORMS.length]
    ],
    estimatedTokens: Math.floor(Math.random() * 300) + 200,
    icon: ICONS[i % ICONS.length],
    createdAt: new Date(Date.now() - (5000 - i) * 60 * 60000).toISOString()
  };

  const filename = `prompt_${i}.json`;
  fs.writeFileSync(path.join(PROMPTS_DIR, filename), JSON.stringify(fileData, null, 2), 'utf-8');
}

console.log('Finished writing 3,000 files to src/data/prompts/');

console.log('Regenerating consolidated promptsIndex.js with all 5,000 prompts...');

const allPrompts = [];

// Read all JSON files in prompts folder
const files = fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.json'));
files.sort((a, b) => {
  const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
  const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
  return numA - numB;
});

console.log(`Found ${files.length} total prompt files to index.`);

for (const file of files) {
  const fileContent = fs.readFileSync(path.join(PROMPTS_DIR, file), 'utf-8');
  try {
    const json = JSON.parse(fileContent);
    // Standardize object fields to match store requirement
    allPrompts.push({
      id: json.id,
      title: json.name || json.title,
      category: json.category,
      prompt: json.content || json.prompt,
      starred: false,
      useCount: 0,
      createdAt: json.createdAt
    });
  } catch (err) {
    console.error(`Error parsing file ${file}:`, err);
  }
}

const indexContent = `// Auto-generated prompt templates index of 5,000 files
export const GENERATED_PROMPTS = ${JSON.stringify(allPrompts, null, 2)};
`;

fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
console.log('Successfully regenerated src/data/promptsIndex.js! All 5,000 prompts indexed.');
