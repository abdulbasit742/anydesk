// TemplateLibrary.js — Core database of pre-configured variable patterns
const TEMPLATES = [
  {
    id: 'crm-dashboard',
    name: 'CRM Dashboard',
    category: 'business',
    description: 'Enterprise CRM with contacts, deals pipeline, and analytics',
    template: 'Build a {{framework}} CRM dashboard with {{theme}} theme for {{companyName}}. Include contacts list, deals pipeline (kanban), analytics charts, and email integration.',
    variables: { framework: 'React', theme: 'dark', companyName: 'Acme Corp' },
  },
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    category: 'marketing',
    description: 'Modern landing page with hero, features, pricing sections',
    template: 'Create a {{framework}} landing page for {{appName}}, a {{description}}. Include hero section, features grid, pricing table with {{pricingTiers}} tiers, and CTA buttons.',
    variables: { framework: 'React', appName: 'MyApp', description: 'productivity tool', pricingTiers: '3' },
  },
  {
    id: 'api-backend',
    name: 'REST API Backend',
    category: 'backend',
    description: 'Express.js REST API with authentication and database',
    template: 'Build a {{language}} REST API using {{framework}} with JWT authentication, {{database}} database, CRUD endpoints for {{resource}}, and rate limiting.',
    variables: { language: 'TypeScript', framework: 'Express', database: 'PostgreSQL', resource: 'users' },
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    category: 'mobile',
    description: 'React Native cross-platform mobile application',
    template: 'Create a {{platform}} mobile app called {{appName}} with {{primaryColor}} primary color. Features: {{features}}. Use {{stateManagement}} for state management.',
    variables: { platform: 'React Native', appName: 'MyMobileApp', primaryColor: '#6366F1', features: 'auth, dashboard, settings', stateManagement: 'Zustand' },
  },
];

export function getTemplate(id) { return TEMPLATES.find(t => t.id === id) || null; }
export function getAllTemplates() { return [...TEMPLATES]; }
export function getByCategory(category) { return TEMPLATES.filter(t => t.category === category); }
export function searchTemplates(query) {
  const q = query.toLowerCase();
  return TEMPLATES.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
}
export function getCategories() { return [...new Set(TEMPLATES.map(t => t.category))]; }
