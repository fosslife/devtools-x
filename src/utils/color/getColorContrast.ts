const canBeWhite = (hex: string) => {
  const ratio = checkContrast(hex, "#ffffff");
  return ratio >= 4.5;
};

function luminance(r: number, g: number, b: number) {
  let [lumR, lumG, lumB] = [r, g, b].map((component) => {
    let proportion = component / 255;

    return proportion <= 0.03928
      ? proportion / 12.92
      : Math.pow((proportion + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

function contrastRatio(luminance1: number, luminance2: number) {
  let lighterLum = Math.max(luminance1, luminance2);
  let darkerLum = Math.min(luminance1, luminance2);

  return (lighterLum + 0.05) / (darkerLum + 0.05);
}

/**
 * Because color inputs format their values as hex strings (ex.
 * #000000), we have to do a little parsing to extract the red,
 * green, and blue components as numbers before calculating the
 * luminance values and contrast ratio.
 */
function checkContrast(color1: any, color2: any) {
  let [luminance1, luminance2] = [color1, color2].map((color) => {
    /* Remove the leading hash sign if it exists */
    color = color.startsWith("#") ? color.slice(1) : color;

    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);

    return luminance(r, g, b);
  });

  return contrastRatio(luminance1, luminance2);
}

/**
 * A utility to format ratios as nice, human-readable strings with
 * up to two digits after the decimal point (ex. "4.3:1" or "17:1")
 */
function formatRatio(ratio: number) {
  let ratioAsFloat = ratio.toFixed(2);
  let isInteger = Number.isInteger(parseFloat(ratioAsFloat));
  return `${isInteger ? Math.floor(ratio) : ratioAsFloat}:1`;
}

/**
 * Determine whether the given contrast ratio meets WCAG
 * requirements at any level (AA Large, AA, or AAA). In the return
 * value, `isPass` is true if the ratio meets or exceeds the minimum
 * of at least one level, and `maxLevel` is the strictest level that
 * the ratio passes.
 */
const WCAG_MINIMUM_RATIOS = [
  ["AA Large", 3],
  ["AA", 4.5],
  ["AAA", 7],
];

const NameMapping = {
  "AA Large": "Large text",
  AA: "Small text",
  AAA: "Graphics",
};

function meetsMinimumRequirements(ratio: number) {
  const checks = WCAG_MINIMUM_RATIOS.map(([level, minRatio]) => {
    return {
      level,
      pass: ratio >= (minRatio as number),
      label: NameMapping[level as keyof typeof NameMapping],
    };
  });
  return checks;
}

export const getColorContrast = {
  check: checkContrast,
  format: formatRatio,
  meets: meetsMinimumRequirements,
  canBeWhite: canBeWhite,
};
