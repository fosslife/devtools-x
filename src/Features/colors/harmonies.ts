// Harmonies

import { Convert } from "./utilities";

const cc = new Convert();

export function analogous(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const a1 = cc.lch2hex(l, c, (h + 30) % 360);
  const a2 = cc.lch2hex(l, c, (h + 15) % 360);
  const a3 = cc.lch2hex(l, c, (h - 15 + 360) % 360);
  const a4 = cc.lch2hex(l, c, (h - 30 + 360) % 360);

  return [main, a1, a2, a3, a4];
}

export function monochromatic(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const m1 = cc.lch2hex(l * 0.4, c, h); // Reducing lightness for shades
  const m2 = cc.lch2hex(l * 0.6, c * 0.75, h); // Reduced chroma and lightness
  const m3 = cc.lch2hex(l * 0.8, c * 0.5, h); // Further reduction in chroma and lightness
  const m4 = cc.lch2hex(l * 0.9, c * 0.25, h); // Minimal chroma and near full lightness

  return [main, m1, m2, m3, m4];
}

export function triadic(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const t1 = cc.lch2hex(l, c, (h + 120) % 360);
  const t2 = cc.lch2hex(l, c * 0.75, (h + 240) % 360);
  const t3 = cc.lch2hex(l * 0.6, c * 0.5, (h + 240) % 360);
  const t4 = cc.lch2hex(l * 0.4, c * 0.25, (h + 240) % 360);

  return [main, t1, t2, t3, t4];
}

// Complementary Colors
export function complementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const c1 = cc.lch2hex(l, c, (h + 180) % 360);
  const c2 = cc.lch2hex(l, c * 0.75, (h + 60) % 360);
  const c3 = cc.lch2hex(l * 0.6, c * 0.5, (h + 60) % 360);
  const c4 = cc.lch2hex(l * 0.4, c * 0.25, (h + 60) % 360);

  return [main, c1, c2, c3, c4];
}

export function directComplementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);
  return cc.lch2hex(l, c, (h + 180) % 360);
}
// Split Complementary Colors
export function splitComplementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const sc1 = cc.lch2hex(l, c, (h + 150) % 360);
  const sc2 = cc.lch2hex(l, c, (h + 210) % 360);
  const sc3 = cc.lch2hex(l * 0.6, c * 0.75, (h + 60) % 360);
  const sc4 = cc.lch2hex(l * 0.4, c * 0.5, (h + 60) % 360);

  return [main, sc1, sc2, sc3, sc4];
}

export function doubleSplitComplementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const dsc1 = cc.lch2hex(l, c * 0.75, (h + 150) % 360);
  const dsc2 = cc.lch2hex(l, c * 0.75, (h + 210) % 360);
  const dsc3 = cc.lch2hex(l, c * 0.75, (h + 270) % 360);
  const dsc4 = cc.lch2hex(l, c * 0.75, (h + 30) % 360);

  return [main, dsc1, dsc2, dsc3, dsc4];
}

// Square Colors
export function square(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const s1 = cc.lch2hex(l, c, (h + 90) % 360);
  const s2 = cc.lch2hex(l, c, (h + 180) % 360);
  const s3 = cc.lch2hex(l, c, (h + 270) % 360);
  const s4 = cc.lch2hex(l, c, (h + 45) % 360); // Typically for a square, the hues should be 90 degrees apart, this seems like a special case.

  return [main, s1, s2, s3, s4];
}

// Compound Colors
export function compound(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = cc.lch2hex(l, c, h);
  const cp1 = cc.lch2hex(l, c * 0.75, (h + 30) % 360);
  const cp2 = cc.lch2hex(l, c, (h + 150) % 360);
  const cp3 = cc.lch2hex(l, c, (h + 210) % 360);
  const cp4 = cc.lch2hex(l, c * 0.75, (h + 330) % 360);

  return [main, cp1, cp2, cp3, cp4];
}
