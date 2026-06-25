// themes.js — theme definitions for Bolt Studio Pro

export const THEMES = {
  dark: {
    id: 'dark',
    label: 'Dark (Default)',
    preview: ['#0a0a14', '#111120', '#1a1a2e'],
    vars: {
      '--bg':       '#0a0a14',
      '--surface':  '#111120',
      '--surface2': '#181828',
      '--surface3': '#1e1e30',
      '--border':   'rgba(255,255,255,0.08)',
      '--text':     '#e4e4ed',
      '--muted':    'rgba(255,255,255,0.35)',
      '--muted2':   'rgba(255,255,255,0.55)',
      '--gold':     '#f5b731',
      '--teal':     '#00d4aa',
      '--blue':     '#4f8ef7',
      '--purple':   '#a78bfa',
      '--red':      '#ff5f5f',
    },
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight Blue',
    preview: ['#040d1a', '#071428', '#0d1f3c'],
    vars: {
      '--bg':       '#040d1a',
      '--surface':  '#071428',
      '--surface2': '#0d1f3c',
      '--surface3': '#122845',
      '--border':   'rgba(79,142,247,0.15)',
      '--text':     '#cdd9f0',
      '--muted':    'rgba(129,173,229,0.4)',
      '--muted2':   'rgba(129,173,229,0.6)',
      '--gold':     '#fbbf24',
      '--teal':     '#06b6d4',
      '--blue':     '#60a5fa',
      '--purple':   '#a78bfa',
      '--red':      '#f87171',
    },
  },
  forest: {
    id: 'forest',
    label: 'Forest Green',
    preview: ['#030f08', '#071a0e', '#0e2a18'],
    vars: {
      '--bg':       '#030f08',
      '--surface':  '#071a0e',
      '--surface2': '#0e2a18',
      '--surface3': '#133520',
      '--border':   'rgba(0,212,130,0.12)',
      '--text':     '#c8e8d0',
      '--muted':    'rgba(100,200,140,0.4)',
      '--muted2':   'rgba(100,200,140,0.6)',
      '--gold':     '#fcd34d',
      '--teal':     '#10b981',
      '--blue':     '#34d399',
      '--purple':   '#a78bfa',
      '--red':      '#f87171',
    },
  },
  dracula: {
    id: 'dracula',
    label: 'Dracula',
    preview: ['#1e1f29', '#282a36', '#343746'],
    vars: {
      '--bg':       '#1e1f29',
      '--surface':  '#282a36',
      '--surface2': '#343746',
      '--surface3': '#3e4052',
      '--border':   'rgba(255,255,255,0.1)',
      '--text':     '#f8f8f2',
      '--muted':    'rgba(248,248,242,0.4)',
      '--muted2':   'rgba(248,248,242,0.6)',
      '--gold':     '#f1fa8c',
      '--teal':     '#50fa7b',
      '--blue':     '#8be9fd',
      '--purple':   '#bd93f9',
      '--red':      '#ff5555',
    },
  },
};

export const applyTheme = (themeId) => {
  const theme = THEMES[themeId] || THEMES.dark;
  const root  = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

export const getTheme = (id) => THEMES[id] || THEMES.dark;

export const THEME_NAMES = Object.keys(THEMES);
