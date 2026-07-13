import { SUMMER_COLORS } from '../types';

/** המרת #RRGGBB ל-HSL */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const cleaned = hex.replace('#', '');
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;
  const n = Number.parseInt(full, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, s)) / 100;
  const ll = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = ll - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hh < 60) {
    r = c;
    g = x;
  } else if (hh < 120) {
    r = x;
    g = c;
  } else if (hh < 180) {
    g = c;
    b = x;
  } else if (hh < 240) {
    g = x;
    b = c;
  } else if (hh < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

/** גוונים מאותה משפחת צבעים (אותו Hue, בהירות/רוויה משתנות) */
export function familyShades(baseHex: string, count: number): string[] {
  const { h, s } = hexToHsl(baseHex);
  if (count <= 0) return [];
  if (count === 1) return [hslToHex(h, Math.min(85, s + 5), 52)];

  const lights = [38, 48, 58, 68, 78, 42, 62, 72];
  const sats = [Math.min(90, s + 8), Math.max(35, s - 5), Math.min(85, s + 15), s];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(hslToHex(h, sats[i % sats.length], lights[i % lights.length]));
  }
  return out;
}

export function nextBranchColor(existingCount: number): string {
  return SUMMER_COLORS[existingCount % SUMMER_COLORS.length];
}

export function nextPersonColorInBranch(
  branchColor: string | undefined,
  siblingIndex: number,
): string {
  if (branchColor) {
    const shades = familyShades(branchColor, Math.max(siblingIndex + 1, 6));
    return shades[siblingIndex % shades.length];
  }
  return SUMMER_COLORS[siblingIndex % SUMMER_COLORS.length];
}
