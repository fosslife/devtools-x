import { Convert } from "@/utils/colors";
import type { ColorHarmony } from "@/types/colors";

const cc = new Convert();

function analogous(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const a1 = cc.lch2hex([l, c, (h + 30) % 360]);
  const a2 = cc.lch2hex([l, c, (h + 15) % 360]);
  const a3 = cc.lch2hex([l, c, (h - 15 + 360) % 360]);
  const a4 = cc.lch2hex([l, c, (h - 30 + 360) % 360]);

  return [main, a1, a2, a3, a4];
}

function monochromatic(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const m1 = cc.lch2hex([l * 0.4, c, h]); // Reducing lightness for shades
  const m2 = cc.lch2hex([l * 0.6, c * 0.75, h]); // Reduced chroma and lightness
  const m3 = cc.lch2hex([l * 0.8, c * 0.5, h]); // Further reduction in chroma and lightness
  const m4 = cc.lch2hex([l * 0.9, c * 0.25, h]); // Minimal chroma and near full lightness

  return [main, m1, m2, m3, m4];
}

function triadic(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const t1 = cc.lch2hex([l, c, (h + 120) % 360]);
  const t2 = cc.lch2hex([l, c * 0.75, (h + 240) % 360]);
  const t3 = cc.lch2hex([l * 0.6, c * 0.5, (h + 240) % 360]);
  const t4 = cc.lch2hex([l * 0.4, c * 0.25, (h + 240) % 360]);

  return [main, t1, t2, t3, t4];
}

// Complementary Colors
function complementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const c1 = cc.lch2hex([l, c, (h + 180) % 360]);
  const c2 = cc.lch2hex([l, c * 0.75, (h + 60) % 360]);
  const c3 = cc.lch2hex([l * 0.6, c * 0.5, (h + 60) % 360]);
  const c4 = cc.lch2hex([l * 0.4, c * 0.25, (h + 60) % 360]);

  return [main, c1, c2, c3, c4];
}

function directComplementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);
  return cc.lch2hex([l, c, (h + 180) % 360]);
}
// Split Complementary Colors
function splitComplementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const sc1 = cc.lch2hex([l, c, (h + 150) % 360]);
  const sc2 = cc.lch2hex([l, c, (h + 210) % 360]);
  const sc3 = cc.lch2hex([l * 0.6, c * 0.75, (h + 60) % 360]);
  const sc4 = cc.lch2hex([l * 0.4, c * 0.5, (h + 60) % 360]);

  return [main, sc1, sc2, sc3, sc4];
}

function doubleSplitComplementary(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const dsc1 = cc.lch2hex([l, c * 0.75, (h + 150) % 360]);
  const dsc2 = cc.lch2hex([l, c * 0.75, (h + 210) % 360]);
  const dsc3 = cc.lch2hex([l, c * 0.75, (h + 270) % 360]);
  const dsc4 = cc.lch2hex([l, c * 0.75, (h + 30) % 360]);

  return [main, dsc1, dsc2, dsc3, dsc4];
}

// Square Colors
function square(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const s1 = cc.lch2hex([l, c, (h + 90) % 360]);
  const s2 = cc.lch2hex([l, c, (h + 180) % 360]);
  const s3 = cc.lch2hex([l, c, (h + 270) % 360]);
  // Normally, the fourth color would be (h + 360) % 360, but we can just add 45 to the hue
  const s4 = cc.lch2hex([l, c, (h + 45) % 360]);

  return [main, s1, s2, s3, s4];
}

// Compound Colors
function compound(hex: string) {
  const [l, c, h] = cc.hex2lch(hex);

  const main = hex; // cc.lch2hex(lch);
  const cp1 = cc.lch2hex([l, c * 0.75, (h + 30) % 360]);
  const cp2 = cc.lch2hex([l, c, (h + 150) % 360]);
  const cp3 = cc.lch2hex([l, c, (h + 210) % 360]);
  const cp4 = cc.lch2hex([l, c * 0.75, (h + 330) % 360]);

  return [main, cp1, cp2, cp3, cp4];
}

// Harmonies are inspired by the wheels but are slightly tuned to ensure a 5 color palette output.
export const getPaletteHarmonies = (hex: string): ColorHarmony[] => {
  return [
    { key: "analogous", colors: analogous(hex) },
    { key: "monochromatic", colors: monochromatic(hex) },
    { key: "triadic", colors: triadic(hex) },
    { key: "complementary", colors: complementary(hex) },
    { key: "splitComplementary", colors: splitComplementary(hex) },
    { key: "doubleSplitComplementary", colors: doubleSplitComplementary(hex) },

    { key: "square", colors: square(hex) },
    { key: "compound", colors: compound(hex) },
  ];
};
