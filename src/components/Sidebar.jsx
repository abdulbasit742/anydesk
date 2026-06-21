import { useState, useMemo } from 'react';
import { PLATFORMS } from '../data/constants';
import { sound } from '../lib/soundEngine';

// ─── Keyboard shortcut map ────────────────────────────────────────────────────
const SHORTCUT_MAP = {
  dashboard:           'G  D',
  innovativefeatures:  'G  I F',
  missioncontrol:      'G  M',
  analytics:           'G  G',
  automation:          'G  A',
  promptqueue:         'G  .',
  accounts:            'G  U',
  creditmonitor:       'G  C',
  broadcast:           'G  B',
  screenwall:          'G  W',
  projects:            'G  P',
  workflows:           'G  F',
  scheduler:           'G  S',
  library:             'G  L',
  promptbuilder:       'G  R',
  optimizer:           'G  O',
  history:             'G  H',
  scratchpad:          'G  J',
  vault:               'G  V',
  terminal:            'G  T',
  settings:            'G  ,',
  featuremarketplace:  'G  X',
  agentworkflows:      'G  1',
  apiintegrations:     'G  2',
  devutilities:        'G  3',
  dataanalytics:       'G  4',
  uiextensions:        'G  5',
  securityguards:      'G  6',
  aichat:              'G  Q',
  deploymentcenter:    'G  Y',
  codeeditor:          'G  E',
  performanceprofiler: 'G  Z',
  collaborationhub:    'G  K',
  commandcenter:       'G  N',
  autopromptengine:    'G  ;',
  aiinsights:          'G  I',
  marketintelligence:  'G  T',
  aitraining:          'G  7',
  datapipeline:        'G  8',
  networkmap:          'G  9',
  smartalerts:         'G  0',
  usagequotas:         'G  U',
  promptmarketplace:   'G  P',
  modelbenchmarks:     'G  /',
  webscraper:          'G  \\',
  containermanager:    'G  -',
  loadbalancer:        'G  =',
  dbmanager:           'G  [',
  loganalyzer:         'G  ]',
  emailstudio:         'G  @',
  learningcenter:      'G  ?',
  observabilityhub:    'G  %',
  voicecommander:      'G  #',
  multiagentorchestrator: 'G  &',
  cryptowallet:        'G  $',
  scholarshipagent:    'G  ^',
  apparelagent:        'G  A 1',
  quantumexploration:  'G  Q',
  aivideostudio:       'G  ~',
  systemstatus:        'G  S 8',
  landing:             'G  S 1',
  pricing:             'G  S 2',
  signup:              'G  S 3',
  login:               'G  S 4',
  billing:             'G  S 5',
  admin:               'G  S 6',
  affiliates:          'G  S 7',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const ICONS = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  missioncontrol: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
  analytics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  accounts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="19" cy="11" r="2"/><path d="M23 21v-1a2 2 0 0 0-2-2h-1"/></svg>,
  creditmonitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  broadcast: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  screenwall: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  projects: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  workflows: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>,
  scheduler: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  automation: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2l-3 9-4 1-3 3 2 2 1.5 1.5L15 22l3-3 1-4 9-3z"/><path d="M9 15l-3-3-4 1v2l3 3h2l2-3z"/><path d="M14 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>,
  promptqueue: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  library: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  promptbuilder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="11" height="4" rx="1"/><rect x="3" y="17" width="14" height="4" rx="1"/></svg>,
  optimizer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>,
  scratchpad: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  vault: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  terminal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  featuremarketplace: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  agentworkflows: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M12 11l-5 6M12 11l5 6"/></svg>,
  apiintegrations: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  devutilities: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  dataanalytics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>,
  uiextensions: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  securityguards: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  aichat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="12" y1="7" x2="12" y2="13"/></svg>,
  deploymentcenter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  codeeditor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  performanceprofiler: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  collaborationhub: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  commandcenter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
  autopromptengine: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>,
  aiinsights: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>,
  marketintelligence: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>,
  aitraining: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="12" y1="12" x2="12" y2="15"/></svg>,
  datapipeline: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="4" height="10" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="18" y="9" width="4" height="8" rx="1"/><path d="M6 12h4M14 12h4"/></svg>,
  networkmap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="12" cy="12" r="2"/><path d="M7 12h3M14 12l3-5M14 12l3 5"/></svg>,
  smartalerts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="12" cy="4" r="1" fill="currentColor"/></svg>,
  usagequotas: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  promptmarketplace: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,

  // Custom extra icons for pinning system
  templates: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  comparison: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L20 4M21 16v5h-5M4 4l16 16"/></svg>,
  sandbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5M12 2v14M12 2L8 6M12 2l4 4"/></svg>,
  responseinbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  reports: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  notifications: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  integrations: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  teamhub: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  knowledgebase: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  changelog: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  costtracker: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  liveconsole: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  tokenanalyzer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>,
  modelbenchmarks: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 21v-4a4 4 0 0 1 8 0v4"/><path d="M12 11l-3-3m0 0l3-3m-3 3h8"/></svg>,
  webscraper: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><circle cx="12" cy="12" r="9"/></svg>,
  containermanager: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  loadbalancer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  dbmanager: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>,
  loganalyzer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M6 21h12M12 17v4"/></svg>,
  emailstudio: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  learningcenter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/></svg>,
  observabilityhub: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10M2 12h20"/></svg>,
  voicecommander: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v10M19 8a7 7 0 0 1-14 0M12 18v5M8 23h8"/></svg>,
  multiagentorchestrator: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="12" cy="20" r="2"/><line x1="12" y1="6" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="18"/><line x1="6" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="18" y2="12"/></svg>,
  cryptowallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><rect x="14" y="11" width="8" height="4" rx="2"/></svg>,
  aivideostudio: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  systemstatus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  landing: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  pricing: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  signup: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  login: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
  billing: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M7 15h0M11 15h2"/></svg>,
  admin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg>,
  affiliates: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  scholarshipagent: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/></svg>,
  apparelagent: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.37 4.65a2.11 2.11 0 0 0-1.84-.96h-1.92a2.31 2.31 0 0 1-2.11-1.6 1.48 1.48 0 0 0-2.8 0 2.31 2.31 0 0 1-2.11 1.6H7.67a2.11 2.11 0 0 0-1.84.96L2.3 8.8a2.1 2.1 0 0 0 .61 2.92l2.67 1.83a2.1 2.1 0 0 0 2.76-.32l1.66-1.7V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8.47l1.66 1.7a2.1 2.1 0 0 0 2.76.32l2.67-1.83a2.1 2.1 0 0 0 .61-2.92z"/></svg>,
  quantumexploration: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3" transform="rotate(150 12 12)"/></svg>,
  innovativefeatures: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15 9L22 10L17 15L18 22L12 18L6 22L7 15L2 10L9 9L12 2Z"/></svg>,
};

// ─── Nav structure ────────────────────────────────────────────────────────────
const INITIAL_NAV_ITEMS = [
  { section: 'MAIN', items: [
    { id: 'dashboard',       label: 'Dashboard' },
    { id: 'innovativefeatures', label: 'Innovative Features' },
    { id: 'aichat',          label: 'Universal Chat' },
    { id: 'accounts',        label: 'Accounts' },
  ]},
  { section: 'AUTOMATION', items: [
    { id: 'automation',      label: 'Automation' },
    { id: 'workflows',       label: 'Workflows' },
    { id: 'scheduler',       label: 'Scheduler' },
    { id: 'multiagentorchestrator', label: 'Orchestrator' },
    { id: 'scholarshipagent', label: 'Scholarship Agent' },
    { id: 'apparelagent',    label: 'Apparel Agent' },
  ]},
  { section: 'PROMPTS', items: [
    { id: 'broadcast',       label: 'Broadcast' },
    { id: 'library',         label: 'Prompt Library' },
    { id: 'comparison',      label: 'Compare' },
  ]},
  { section: 'PLATFORMS', items: [
    { id: 'platforms',       label: 'All Platforms' },
    { id: 'handoff',         label: 'Handoff Center' },
    { id: 'screenwall',      label: 'Screen Wall' },
  ]},
  { section: 'REMOTE', items: [
    { id: 'remote',          label: 'Remote Desktop' },
  ]},
  { section: 'ANALYTICS', items: [
    { id: 'analytics',       label: 'Analytics' },
    { id: 'quantumexploration', label: 'Quantum Discovery' },
    { id: 'credits',         label: 'Credits' },
    { id: 'creditmonitor',   label: 'Credit Monitor' },
    { id: 'systemstatus',    label: 'System Status' },
  ]},
  { section: 'TOOLS', items: [
    { id: 'aiinsights',      label: 'AI Insights' },
    { id: 'digest',          label: 'Daily Digest' },
    { id: 'knowledgebase',   label: 'Knowledge Base' },
  ]},
  { section: 'ACCOUNT', items: [
    { id: 'billing',         label: 'Billing' },
    { id: 'teamhub',         label: 'Team' },
    { id: 'referrals',       label: 'Referrals' },
    { id: 'settings',        label: 'Settings' },
    { id: 'admin',           label: 'Admin' },
    { id: 'docs',            label: 'Help' },
    { id: 'changelog',       label: 'Changelog' },
  ]},
];

const MASTER_PAGES_LIST = [
  { id: 'dashboard',       label: 'Dashboard', emoji: '🏠' },
  { id: 'aichat',          label: 'Universal Chat', emoji: '💬' },
  { id: 'accounts',        label: 'Accounts', emoji: '🤖' },
  { id: 'automation',      label: 'Automation', emoji: '⚡' },
  { id: 'workflows',       label: 'Workflows', emoji: '🔁' },
  { id: 'scheduler',       label: 'Scheduler', emoji: '⏰' },
  { id: 'multiagentorchestrator', label: 'Orchestrator', emoji: '🎯' },
  { id: 'scholarshipagent', label: 'Scholarship Agent', emoji: '🎓' },
  { id: 'apparelagent',    label: 'Apparel Agent', emoji: '👕' },
  { id: 'broadcast',       label: 'Broadcast', emoji: '📡' },
  { id: 'library',         label: 'Prompt Library', emoji: '📚' },
  { id: 'comparison',      label: 'Compare', emoji: '⚖️' },
  { id: 'platforms',       label: 'All Platforms', emoji: '🔗' },
  { id: 'handoff',         label: 'Handoff Center', emoji: '🔀' },
  { id: 'screenwall',      label: 'Screen Wall', emoji: '🖥️' },
  { id: 'remote',          label: 'Remote Desktop', emoji: '💻' },
  { id: 'analytics',       label: 'Analytics', emoji: '📊' },
  { id: 'credits',         label: 'Credits', emoji: '💳' },
  { id: 'creditmonitor',   label: 'Credit Monitor', emoji: '📈' },
  { id: 'systemstatus',    label: 'System Status', emoji: '🌡️' },
  { id: 'aiinsights',      label: 'AI Insights', emoji: '🧠' },
  { id: 'digest',          label: 'Daily Digest', emoji: '📋' },
  { id: 'knowledgebase',   label: 'Knowledge Base', emoji: '🗂️' },
  { id: 'billing',         label: 'Billing', emoji: '💰' },
  { id: 'teamhub',         label: 'Team', emoji: '👥' },
  { id: 'referrals',       label: 'Referrals', emoji: '🔑' },
  { id: 'settings',        label: 'Settings', emoji: '⚙️' },
  { id: 'admin',           label: 'Admin', emoji: '🛡️' },
  { id: 'docs',            label: 'Help', emoji: '📖' },
  { id: 'changelog',       label: 'Changelog', emoji: '📝' },
  { id: 'quantumexploration', label: 'Quantum Discovery', emoji: '⚛️' },
];

function getBadge(id, accounts, broadcasts, workflows) {
  if (id === 'accounts')  return accounts.length || null;
  if (id === 'broadcast') {
    const today = broadcasts.filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString()).length;
    return today || null;
  }
  if (id === 'workflows') return workflows?.filter(w => w.status === 'active')?.length || null;
  return null;
}

// ─── Recent Pages helpers ─────────────────────────────────────────────────────
const RECENT_KEY = 'bsp_recent_pages';
const MAX_RECENT = 3;

function loadRecentPages() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function pushRecentPage(id, label) {
  const prev = loadRecentPages().filter(p => p.id !== id);
  const next = [{ id, label }, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

// ─── Gear icon ────────────────────────────────────────────────────────────────
const GearIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function Sidebar({ page, onNav, accounts = [], onConnect, broadcasts = [], workflows = [], className = '' }) {
  const [collapsed, setCollapsed] = useState(false);
  const [customizing, setCustomizing] = useState(false);

  // Feature 1: Permanent inline page query state
  const [navSearch, setNavSearch] = useState('');

  // Feature 2: Collapsible nav categories
  const [collapsedSections, setCollapsedSections] = useState(() => {
    const saved = localStorage.getItem('bsp_sidebar_collapsed_sections');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleSectionCollapse = (sectName) => {
    sound.play('click');
    setCollapsedSections(prev => {
      const next = { ...prev, [sectName]: !prev[sectName] };
      localStorage.setItem('bsp_sidebar_collapsed_sections', JSON.stringify(next));
      return next;
    });
  };

  // Custom layout states synced to localStorage
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('bsp_sidebar_sections');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_NAV_ITEMS; }
    }
    return INITIAL_NAV_ITEMS;
  });

  const [pinnedIds, setPinnedIds] = useState(() => {
    const saved = localStorage.getItem('bsp_sidebar_pinned');
    if (saved) {
      try { return JSON.parse(saved); } catch { return ['dashboard', 'missioncontrol', 'broadcast']; }
    }
    return ['dashboard', 'missioncontrol', 'broadcast'];
  });

  // NEW Feature 3: Recent pages
  const [recentPages, setRecentPages] = useState(() => loadRecentPages());

  // NEW Feature 5: Hovered item for shortcut hint
  const [hoveredId, setHoveredId] = useState(null);

  // Drag states
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverPos, setDragOverPos] = useState(null);

  const activeCount  = accounts.filter(a => a.status === 'active').length;
  const expiredCount = accounts.filter(a => a.status === 'expired_session').length;

  // Push to recent page transition during render
  const [prevPage, setPrevPage] = useState(page);
  if (page !== prevPage) {
    setPrevPage(page);
    if (page) {
      const master = MASTER_PAGES_LIST.find(x => x.id === page);
      const label = master ? master.label : page;
      const updated = pushRecentPage(page, label);
      setRecentPages(updated);
    }
  }

  const removeRecentPage = (id) => {
    const updated = recentPages.filter(p => p.id !== id);
    setRecentPages(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const togglePin = (id) => {
    const isPinned = pinnedIds.includes(id);
    let newPinned;
    if (isPinned) {
      newPinned = pinnedIds.filter(x => x !== id);
    } else {
      newPinned = [...pinnedIds, id];
    }
    setPinnedIds(newPinned);
    localStorage.setItem('bsp_sidebar_pinned', JSON.stringify(newPinned));
    sound.play('pin');
  };

  const handleDragStart = (e, id, sIdx, iIdx, isPinned = false) => {
    setDraggedItem({ id, sectionIndex: sIdx, itemIndex: iIdx, isPinned });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverPos(null);
  };

  const handleDragEnter = (e, sIdx, iIdx, isPinned = false) => {
    e.preventDefault();
    setDragOverPos({ sectionIndex: sIdx, itemIndex: iIdx, isPinned });
  };

  const handleDrop = (e, sIdx, iIdx, isPinnedTarget = false) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.isPinned && isPinnedTarget) {
      const newPinned = [...pinnedIds];
      newPinned.splice(draggedItem.itemIndex, 1);
      newPinned.splice(iIdx, 0, draggedItem.id);
      setPinnedIds(newPinned);
      localStorage.setItem('bsp_sidebar_pinned', JSON.stringify(newPinned));
    }
    else if (!draggedItem.isPinned && isPinnedTarget) {
      if (!pinnedIds.includes(draggedItem.id)) {
        const newPinned = [...pinnedIds];
        newPinned.splice(iIdx, 0, draggedItem.id);
        setPinnedIds(newPinned);
        localStorage.setItem('bsp_sidebar_pinned', JSON.stringify(newPinned));
      }
    }
    else if (draggedItem.isPinned && !isPinnedTarget) {
      const newPinned = pinnedIds.filter(id => id !== draggedItem.id);
      setPinnedIds(newPinned);
      localStorage.setItem('bsp_sidebar_pinned', JSON.stringify(newPinned));

      const targetItem = MASTER_PAGES_LIST.find(x => x.id === draggedItem.id);
      if (targetItem) {
        const newSections = sections.map((s, sectIdx) => {
          let items = s.items.filter(x => x.id !== draggedItem.id);
          if (sectIdx === sIdx) {
            items.splice(iIdx, 0, { id: targetItem.id, label: targetItem.label.split(' ')[0] });
          }
          return { ...s, items };
        });
        setSections(newSections);
        localStorage.setItem('bsp_sidebar_sections', JSON.stringify(newSections));
      }
    }
    else if (!draggedItem.isPinned && !isPinnedTarget) {
      const newSections = [...sections];
      const [item] = newSections[draggedItem.sectionIndex].items.splice(draggedItem.itemIndex, 1);
      newSections[sIdx].items.splice(iIdx, 0, item);
      setSections(newSections);
      localStorage.setItem('bsp_sidebar_sections', JSON.stringify(newSections));
    }

    setDraggedItem(null);
    setDragOverPos(null);
  };

  const handleDropOnSectionHeader = (e, sIdx) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.isPinned) {
      const newPinned = pinnedIds.filter(id => id !== draggedItem.id);
      setPinnedIds(newPinned);
      localStorage.setItem('bsp_sidebar_pinned', JSON.stringify(newPinned));

      const targetItem = MASTER_PAGES_LIST.find(x => x.id === draggedItem.id);
      if (targetItem) {
        const newSections = sections.map((s, idx) => {
          let items = s.items.filter(x => x.id !== draggedItem.id);
          if (idx === sIdx) {
            items.push({ id: targetItem.id, label: targetItem.label.split(' ')[0] });
          }
          return { ...s, items };
        });
        setSections(newSections);
        localStorage.setItem('bsp_sidebar_sections', JSON.stringify(newSections));
      }
    } else {
      const newSections = [...sections];
      const [item] = newSections[draggedItem.sectionIndex].items.splice(draggedItem.itemIndex, 1);
      newSections[sIdx].items.push(item);
      setSections(newSections);
      localStorage.setItem('bsp_sidebar_sections', JSON.stringify(newSections));
    }
    setDraggedItem(null);
    setDragOverPos(null);
  };

  const handleDropOnPinnedHeader = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (!draggedItem.isPinned) {
      if (!pinnedIds.includes(draggedItem.id)) {
        const newPinned = [...pinnedIds, draggedItem.id];
        setPinnedIds(newPinned);
        localStorage.setItem('bsp_sidebar_pinned', JSON.stringify(newPinned));
      }
    }
    setDraggedItem(null);
    setDragOverPos(null);
  };

  const resetToDefault = () => {
    setSections(INITIAL_NAV_ITEMS);
    setPinnedIds(['dashboard', 'missioncontrol', 'broadcast']);
    setCollapsedSections({});
    localStorage.removeItem('bsp_sidebar_sections');
    localStorage.removeItem('bsp_sidebar_pinned');
    localStorage.removeItem('bsp_sidebar_collapsed_sections');
  };

  const getPageInfo = (id) => {
    const master = MASTER_PAGES_LIST.find(x => x.id === id);
    const icon = ICONS[id] || <span>📄</span>;
    return {
      id,
      label: master ? master.label : id,
      icon,
      emoji: master ? master.emoji : '📄'
    };
  };

  // Filter sections and items based on quick filter query
  const displaySections = useMemo(() => {
    if (!navSearch.trim()) return sections;
    return sections.map(s => {
      const filteredItems = s.items.filter(item => {
        const info = getPageInfo(item.id);
        return info.label.toLowerCase().includes(navSearch.toLowerCase()) || item.id.toLowerCase().includes(navSearch.toLowerCase());
      });
      return { ...s, items: filteredItems };
    }).filter(s => s.items.length > 0);
  }, [sections, navSearch]);

  const displayPinnedIds = useMemo(() => {
    if (!navSearch.trim()) return pinnedIds;
    return pinnedIds.filter(id => {
      const info = getPageInfo(id);
      return info.label.toLowerCase().includes(navSearch.toLowerCase()) || id.toLowerCase().includes(navSearch.toLowerCase());
    });
  }, [pinnedIds, navSearch]);

  // Navigation handler that also fires sound
  const handleNav = (id) => {
    sound.play('click');
    onNav(id);
  };

  return (
    <div
      className={`sidebar${className ? ' ' + className : ''}`}
      style={{
        width: collapsed ? 60 : 'var(--sidebar-w)',
        transition: 'width 0.25s ease',
        overflowY: 'auto',
        overflowX: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className="sb-logo" style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '14px 0' : undefined }}>
        <div
          className="logo-bolt"
          onClick={() => {
            sound.play('click');
            setCollapsed(c => !c);
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        >
          ⚡
        </div>
        {!collapsed && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 }}>
            <div>
              <div className="logo-txt">Bolt Studio</div>
              <div className="logo-sub">Pro · Multi-Platform</div>
            </div>
            <button
              onClick={() => {
                sound.play('click');
                setCustomizing(!customizing);
              }}
              style={{
                background: customizing ? 'rgba(245,183,49,0.15)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                padding: '4px 6px',
                cursor: 'pointer',
                color: customizing ? 'var(--gold)' : 'var(--muted)',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginRight: 4,
                transition: 'all 0.2s',
              }}
              title="Customize workspace layout"
            >
              🛠️ Layout
            </button>
          </div>
        )}
      </div>

      {/* Feature 1: Permanent sidebar quick search navigation filter */}
      {!collapsed && (
        <div style={{ padding: '0 14px 8px', flexShrink: 0 }}>
          <input
            value={navSearch}
            onChange={e => setNavSearch(e.target.value)}
            placeholder="🔍 Filter sidebar links..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              color: '#e4e4ed',
              fontSize: 11,
              padding: '6px 10px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* ── Customizing Workspace Layout Panel ─────────────────────── */}
      {!collapsed && customizing && (
        <div style={{
          padding: '12px 14px',
          background: 'rgba(245,183,49,0.03)',
          borderBottom: '1px solid rgba(245,183,49,0.1)',
          maxHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.04em' }}>PIN SHORTCUTS</span>
            <button
              onClick={resetToDefault}
              style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 9.5, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Reset Default
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 2 }}>
            {MASTER_PAGES_LIST.map(p => {
              const isPinned = pinnedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 6px',
                    borderRadius: 4,
                    background: isPinned ? 'rgba(245,183,49,0.05)' : 'rgba(255,255,255,0.02)',
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: isPinned ? '#fff' : 'var(--muted2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.emoji} {p.label}
                  </span>
                  <button
                    onClick={() => togglePin(p.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      padding: 2,
                      opacity: isPinned ? 1 : 0.4,
                      transition: 'opacity 0.2s',
                    }}
                    title={isPinned ? "Unpin page" : "Pin page"}
                  >
                    📌
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Account health bar ───────────────────────────────── */}
      {!collapsed && accounts.length > 0 && (
        <div style={{ padding: '4px 14px 0', marginBottom: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            <span>Health</span>
            <span style={{ color: activeCount === accounts.length ? 'var(--teal)' : 'var(--gold)' }}>
              {activeCount}/{accounts.length} active
            </span>
          </div>
          <div style={{ height: 3, background: 'var(--surface3)', borderRadius: 99 }}>
            <div style={{
              height: '100%',
              width: `${(activeCount / accounts.length) * 100}%`,
              background: activeCount === accounts.length ? 'var(--teal)' : expiredCount > 0 ? 'var(--red)' : 'var(--gold)',
              borderRadius: 99, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* ── NEW Feature 3: Recent Pages Quick-Access Chips ────── */}
      {!collapsed && recentPages.length > 0 && (
        <div style={{ padding: '8px 12px 4px', flexShrink: 0 }}>
          <div style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted)',
            marginBottom: 6,
          }}>
            Recent
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {recentPages.map(rp => {
              const isActive = page === rp.id;
              return (
                <div
                  key={rp.id}
                  className="recent-chip"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: isActive ? 'rgba(245,183,49,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'rgba(245,183,49,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => handleNav(rp.id)}
                >
                  <span style={{ width: 13, height: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? 'var(--gold)' : 'var(--muted)', flexShrink: 0 }}>
                    {ICONS[rp.id] || <span style={{ fontSize: 10 }}>📄</span>}
                  </span>
                  <span style={{
                    flex: 1,
                    fontSize: 10.5,
                    color: isActive ? 'var(--gold)' : 'var(--muted2)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-mono, "DM Mono", monospace)',
                  }}>
                    {rp.label}
                  </span>
                  <span
                    className="recent-chip-remove"
                    onClick={e => { e.stopPropagation(); removeRecentPage(rp.id); }}
                    title="Remove from recent"
                    style={{
                      fontSize: 9,
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      padding: '1px 3px',
                      borderRadius: 3,
                      lineHeight: 1,
                      opacity: 0,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    ✕
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 0 0' }} />
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────────── */}
      <div className="sb-nav" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Pinned Items Section */}
        {displayPinnedIds.length > 0 && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnPinnedHeader}
            style={{ marginBottom: 12 }}
          >
            {!collapsed && (
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--gold)',
                  padding: '12px 10px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 4,
                  userSelect: 'none',
                }}
              >
                <span>📌 Pinned Workspace</span>
                {/* NEW Feature 4: Section item count badge */}
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--muted)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 99,
                  padding: '1px 6px',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-mono, "DM Mono", monospace)',
                }}>
                  {displayPinnedIds.length}
                </span>
              </div>
            )}
            <div>
              {displayPinnedIds.map((pinnedId, idx) => {
                const info = getPageInfo(pinnedId);
                const isActive = page === pinnedId;
                const isDragging = draggedItem?.id === pinnedId && draggedItem?.isPinned;
                const isOver = dragOverPos?.isPinned && dragOverPos?.itemIndex === idx;
                const shortcut = SHORTCUT_MAP[pinnedId];
                const isHovered = hoveredId === `pinned-${pinnedId}`;

                return (
                  <div
                    key={`pinned-${pinnedId}`}
                    draggable={!collapsed}
                    onDragStart={(e) => handleDragStart(e, pinnedId, null, idx, true)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => handleDragEnter(e, null, idx, true)}
                    onDrop={(e) => handleDrop(e, null, idx, true)}
                    style={{
                      position: 'relative',
                      opacity: isDragging ? 0.3 : 1,
                      borderTop: isOver ? '2px dotted var(--gold)' : 'none',
                      transition: 'border-top 0.15s ease',
                    }}
                  >
                    {/* NEW Feature 2: Active gold left-border indicator */}
                    {isActive && (
                      <span className="active-border-indicator" />
                    )}
                    <button
                      className={`nav-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleNav(pinnedId)}
                      onMouseEnter={() => { sound.play('hover'); setHoveredId(`pinned-${pinnedId}`); }}
                      onMouseLeave={() => setHoveredId(null)}
                      title={collapsed ? info.label : undefined}
                      style={{
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? '10px 0' : undefined,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {info.icon}
                      </span>
                      {!collapsed && <span style={{ flex: 1, paddingLeft: 4, textAlign: 'left' }}>{info.label.split(' ')[0]}</span>}

                      {/* NEW Feature 5: Keyboard shortcut hint */}
                      {!collapsed && shortcut && isHovered && (
                        <span className="kb-shortcut-hint">{shortcut}</span>
                      )}

                      {!collapsed && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(pinnedId);
                          }}
                          style={{
                            fontSize: 10,
                            padding: '2px 4px',
                            cursor: 'pointer',
                            color: 'var(--muted)',
                            opacity: 0.6,
                          }}
                          title="Unpin page"
                        >
                          ✕
                        </span>
                      )}

                      {collapsed && isActive && (
                        <div style={{
                          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                          width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)',
                          boxShadow: '0 0 6px var(--gold)',
                        }} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Category Sections (Feature 2 Collapsible) */}
        {displaySections.map((section, sIdx) => {
          const isSectCollapsed = !!collapsedSections[section.section];

          return (
            <div
              key={section.section}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnSectionHeader(e, sIdx)}
              style={{ marginBottom: 8 }}
            >
              {!collapsed && (
                <div
                  className="sb-sect"
                  onClick={() => toggleSectionCollapse(section.section)}
                  style={{
                    padding: '8px 10px 4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {section.section}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {/* NEW Feature 4: Section item count badge */}
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: 'var(--muted)',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 99,
                      padding: '1px 5px',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-mono, "DM Mono", monospace)',
                    }}>
                      {section.items.length}
                    </span>
                    <span style={{ fontSize: 8, opacity: 0.5, transform: isSectCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}>
                      ▼
                    </span>
                  </span>
                </div>
              )}

              {/* Show items only if section not collapsed */}
              {(!isSectCollapsed || collapsed) && (
                <div>
                  {section.items.map((item, itemIdx) => {
                    const info = getPageInfo(item.id);
                    const badge = getBadge(item.id, accounts, broadcasts, workflows);
                    const isActive = page === item.id;
                    const isDragging = draggedItem?.id === item.id && !draggedItem?.isPinned;
                    const isOver = !dragOverPos?.isPinned && dragOverPos?.sectionIndex === sIdx && dragOverPos?.itemIndex === itemIdx;
                    const shortcut = SHORTCUT_MAP[item.id];
                    const isHovered = hoveredId === `sect-${sIdx}-${item.id}`;

                    return (
                      <div
                        key={item.id}
                        draggable={!collapsed}
                        onDragStart={(e) => handleDragStart(e, item.id, sIdx, itemIdx, false)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => handleDragEnter(e, sIdx, itemIdx, false)}
                        onDrop={(e) => handleDrop(e, sIdx, itemIdx, false)}
                        style={{
                          position: 'relative',
                          opacity: isDragging ? 0.3 : 1,
                          borderTop: isOver ? '2px dotted var(--gold)' : 'none',
                          transition: 'border-top 0.15s ease',
                        }}
                      >
                        {/* NEW Feature 2: Active gold left-border indicator */}
                        {isActive && (
                          <span className="active-border-indicator" />
                        )}
                        <button
                          className={`nav-btn ${isActive ? 'active' : ''}`}
                          onClick={() => handleNav(item.id)}
                          onMouseEnter={() => { sound.play('hover'); setHoveredId(`sect-${sIdx}-${item.id}`); }}
                          onMouseLeave={() => setHoveredId(null)}
                          title={collapsed ? item.label : undefined}
                          style={{
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: collapsed ? '10px 0' : undefined,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {info.icon}
                          </span>
                          {!collapsed && <span style={{ flex: 1, paddingLeft: 4, textAlign: 'left' }}>{item.label}</span>}

                          {/* NEW Feature 5: Keyboard shortcut hint */}
                          {!collapsed && shortcut && isHovered && (
                            <span className="kb-shortcut-hint">{shortcut}</span>
                          )}

                          {!collapsed && (
                            <span
                              className="pin-hover-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(item.id);
                              }}
                              style={{
                                fontSize: 10,
                                padding: '2px 4px',
                                cursor: 'pointer',
                                color: 'var(--muted)',
                                opacity: pinnedIds.includes(item.id) ? 1 : 0,
                                transition: 'opacity 0.2s',
                              }}
                              title="Pin page"
                            >
                              📌
                            </span>
                          )}

                          {!collapsed && badge && (
                            <span style={{
                              fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 999,
                              background: isActive ? 'rgba(0,0,0,0.3)' : 'var(--gold-glow)',
                              color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--gold)',
                              border: `1px solid ${isActive ? 'transparent' : 'rgba(245,183,49,0.3)'}`,
                              lineHeight: 1.6,
                            }}>
                              {badge}
                            </span>
                          )}
                          {collapsed && isActive && (
                            <div style={{
                              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                              width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)',
                              boxShadow: '0 0 6px var(--gold)',
                            }} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* ── Connected accounts mini list ─────────────────── */}
        {!collapsed && accounts.length > 0 && (
          <>
            <div className="sb-sect" style={{ marginTop: 8 }}>
              Connected
              {expiredCount > 0 && (
                <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--red)', fontWeight: 700 }}>
                  {expiredCount} expired
                </span>
              )}
            </div>
            <div className="sb-account-list">
              {accounts.slice(0, 6).map(a => {
                const pl = PLATFORMS.find(p => p.id === a.platform) || PLATFORMS[0];
                const dotColor = a.status === 'active' ? 'var(--teal)' : a.status === 'expired_session' ? 'var(--red)' : 'var(--muted)';
                return (
                  <div
                    key={a.id}
                    className="sb-acc-item"
                    onClick={() => onNav('accounts')}
                    title={`${a.name} · ${pl.name} · ${a.status}`}
                  >
                    <div className="sb-acc-dot" style={{ background: dotColor, boxShadow: a.status === 'active' ? `0 0 5px ${dotColor}` : 'none' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="sb-acc-name">{a.name}</div>
                      <div className="sb-acc-plat">{pl.name}</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: pl.color, flexShrink: 0, opacity: 0.7 }} />
                  </div>
                );
              })}
              {accounts.length > 6 && (
                <div
                  onClick={() => onNav('accounts')}
                  style={{ fontSize: 10.5, color: 'var(--muted)', padding: '6px 10px', cursor: 'pointer', textAlign: 'center' }}
                >
                  +{accounts.length - 6} more →
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Original Footer: Connect Account CTA ─────────────── */}
      <div className="sb-footer">
        {collapsed ? (
          <button
            className="btn btn-gold"
            onClick={() => {
              sound.play('click');
              onConnect();
            }}
            title="Connect Account"
            style={{ width: 40, height: 40, borderRadius: '50%', padding: 0, justifyContent: 'center', fontSize: 16, margin: '0 auto', display: 'flex' }}
          >
            ⚡
          </button>
        ) : (
          <button
            className="btn btn-gold btn-sm btn-pulse"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => {
              sound.play('click');
              onConnect();
            }}
          >
            ⚡ Connect Account
          </button>
        )}
      </div>

      {/* ── NEW Feature 1: Sidebar Footer Dock ───────────────────────── */}
      <div
        className="sb-dock"
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          background: 'var(--surface, #13131a)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: collapsed ? '10px 0' : '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 8,
          flexDirection: collapsed ? 'column' : 'row',
        }}
      >
        {/* User Avatar */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(245,183,49,0.15), rgba(245,183,49,0.05))',
            border: '1.5px solid var(--gold, #f5b731)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 800,
            color: 'var(--gold, #f5b731)',
            flexShrink: 0,
            letterSpacing: '0.02em',
            boxShadow: '0 0 8px rgba(245,183,49,0.2)',
            cursor: 'default',
            fontFamily: 'var(--font-mono, "DM Mono", monospace)',
          }}
          title="AB — Current user"
        >
          AB
        </div>

        {!collapsed && (
          <>
            {/* Status dot + version */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="dock-status-dot" title="All systems operational" />
                <span
                  onClick={() => onNav('systemstatus')}
                  style={{
                    fontSize: 9.5,
                    color: 'var(--muted)',
                    fontFamily: 'var(--font-mono, "DM Mono", monospace)',
                    textDecoration: 'none',
                    borderBottom: '1px dashed var(--muted)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >
                  All systems go
                </span>
              </div>
              <div style={{
                fontSize: 9,
                color: 'var(--muted)',
                fontFamily: 'var(--font-mono, "DM Mono", monospace)',
                letterSpacing: '0.05em',
                opacity: 0.6,
              }}>
                v2.1.0
              </div>
            </div>

            {/* Settings gear button */}
            <button
              onClick={() => { sound.play('click'); onNav('settings'); }}
              title="Open Settings"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 7,
                padding: '5px 6px',
                cursor: 'pointer',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.18s ease',
                flexShrink: 0,
              }}
              className="dock-icon-btn"
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'rgba(245,183,49,0.3)'; e.currentTarget.style.background = 'rgba(245,183,49,0.06)'; sound.play('hover'); }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <GearIcon />
            </button>

            {/* Collapse/Expand toggle */}
            <button
              onClick={() => { sound.play('click'); setCollapsed(c => !c); }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 7,
                padding: '5px 6px',
                cursor: 'pointer',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.18s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e4e4ed'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; sound.play('hover'); }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ChevronLeftIcon />
            </button>
          </>
        )}

        {/* Collapsed: show only gear + expand in column */}
        {collapsed && (
          <>
            <button
              onClick={() => { sound.play('click'); onNav('settings'); }}
              title="Open Settings"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 7,
                padding: '5px',
                cursor: 'pointer',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 4,
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'rgba(245,183,49,0.3)'; sound.play('hover'); }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <GearIcon />
            </button>
            <button
              onClick={() => { sound.play('click'); setCollapsed(c => !c); }}
              title="Expand sidebar"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 7,
                padding: '5px',
                cursor: 'pointer',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 4,
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e4e4ed'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; sound.play('hover'); }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {/* ── Styles ───────────────────────────────────────────── */}
      <style>{`
        /* Existing: pin icon on hover */
        .nav-btn:hover .pin-hover-icon {
          opacity: 0.8 !important;
        }

        /* Recent pages chip: show X on hover */
        .recent-chip:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.09) !important;
        }
        .recent-chip:hover .recent-chip-remove {
          opacity: 0.7 !important;
        }
        .recent-chip-remove:hover {
          opacity: 1 !important;
          color: var(--red) !important;
          background: rgba(255,77,77,0.12);
        }

        /* Feature 2: Active left-border indicator – animated gold bar */
        .active-border-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: var(--gold, #f5b731);
          box-shadow: 0 0 8px rgba(245,183,49,0.55);
          animation: activeBarSlide 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes activeBarSlide {
          from { transform: scaleY(0); transform-origin: top; opacity: 0; }
          to   { transform: scaleY(1); transform-origin: top; opacity: 1; }
        }

        /* Feature 5: Keyboard shortcut hint */
        .kb-shortcut-hint {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono, "DM Mono", monospace);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--muted);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 1px 5px;
          white-space: nowrap;
          flex-shrink: 0;
          animation: kbFadeIn 0.12s ease both;
        }
        @keyframes kbFadeIn {
          from { opacity: 0; transform: translateX(4px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Feature 1: Dock status pulsing green dot */
        .dock-status-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--teal, #0dd);
          box-shadow: 0 0 5px rgba(0,221,221,0.5);
          animation: statusPulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 5px rgba(0,221,221,0.5); }
          50%       { opacity: 0.65; box-shadow: 0 0 10px rgba(0,221,221,0.8); }
        }
      `}</style>
    </div>
  );
}
