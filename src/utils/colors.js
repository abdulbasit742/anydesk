// colors.js — color manipulation utilities

export const hexToRgb = hex => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : null;
};

export const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map(x => x.toString(16).padStart(2,'0')).join('');

export const alpha = (hex, opacity) => {
  const c = hexToRgb(hex);
  return c ? `rgba(${c.r},${c.g},${c.b},${opacity})` : hex;
};

export const lighten = (hex, amount) => {
  const c = hexToRgb(hex);
  if (!c) return hex;
  const clamp = v => Math.min(255, Math.max(0, Math.round(v)));
  return rgbToHex(clamp(c.r + amount), clamp(c.g + amount), clamp(c.b + amount));
};

export const darken = (hex, amount) => lighten(hex, -amount);

export const mix = (hex1, hex2, weight = 0.5) => {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  if (!c1 || !c2) return hex1;
  const clamp = v => Math.min(255, Math.max(0, Math.round(v)));
  return rgbToHex(
    clamp(c1.r * weight + c2.r * (1 - weight)),
    clamp(c1.g * weight + c2.g * (1 - weight)),
    clamp(c1.b * weight + c2.b * (1 - weight))
  );
};

export const isLight = hex => {
  const c = hexToRgb(hex);
  if (!c) return true;
  return (c.r * 299 + c.g * 587 + c.b * 114) / 1000 > 128;
};

export const contrastColor = hex => isLight(hex) ? '#000000' : '#ffffff';

export const generatePalette = (baseHex, steps = 5) =>
  Array.from({ length: steps }, (_, i) => lighten(baseHex, (i - Math.floor(steps/2)) * 20));

export const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6,'0');

export const PLATFORM_COLORS = {
  bolt: '#f5b731', lovable: '#a78bfa', manus: '#06b6d4',
  replit: '#f97316', claude: '#f97316', cursor: '#4f8ef7', v0: '#a1a1aa',
};
