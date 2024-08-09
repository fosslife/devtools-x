import { Convert } from "./utilities";

const hexToRgb = (hex: string) => new Convert().hex2rgb(hex);
const rgbToHex = (r: number, g: number, b: number) =>
  new Convert().rgb2hex(r, g, b);

export const simulateColorBlindness = (
  color: string,
  blindnessType: string
) => {
  const [r, g, b] = hexToRgb(color) ?? [0, 0, 0];

  let perceivedColor = [r, g, b];

  if (blindnessType === "Protanopia") {
    perceivedColor = [
      0.567 * r + 0.433 * g + 0.0 * b,
      0.558 * r + 0.442 * g + 0.0 * b,
      0.242 * r - 0.1055 * g + 1.053 * b,
    ];
  }

  if (blindnessType === "Deuteranopia") {
    perceivedColor = [
      0.625 * r + 0.375 * g + 0.0 * b,
      0.7 * r + 0.3 * g + 0.0 * b,
      0.15 * r + 0.1 * g + 0.75 * b,
    ];
  }

  if (blindnessType === "Tritanopia") {
    perceivedColor = [
      0.95 * r + 0.05 * g + 0.0 * b,
      0.433 * r + 0.567 * g + 0.0 * b,
      0.475 * r + 0.475 * g + 0.05 * b,
    ];
  }

  if (blindnessType === "Protanomaly") {
    perceivedColor = [
      0.817 * r + 0.183 * g + 0.0 * b,
      0.333 * r + 0.667 * g + 0.0 * b,
      0.0 * r + 0.125 * g + 0.875 * b,
    ];
  }

  if (blindnessType === "Deuteranomaly") {
    perceivedColor = [
      0.8 * r + 0.2 * g + 0.0 * b,
      0.258 * r + 0.742 * g + 0.0 * b,
      0.0 * r + 0.142 * g + 0.858 * b,
    ];
  }

  if (blindnessType === "Tritanomaly") {
    perceivedColor = [
      0.967 * r + 0.033 * g + 0.0 * b,
      0.0 * r + 0.733 * g + 0.267 * b,
      0.0 * r + 0.183 * g + 0.817 * b,
    ];
  }

  if (blindnessType === "Achromatopsia") {
    perceivedColor = [
      0.299 * r + 0.587 * g + 0.114 * b,
      0.299 * r + 0.587 * g + 0.114 * b,
      0.299 * r + 0.587 * g + 0.114 * b,
    ];
  }

  if (blindnessType === "Achromatomaly") {
    perceivedColor = [
      0.618 * r + 0.32 * g + 0.062 * b,
      0.163 * r + 0.775 * g + 0.062 * b,
      0.163 * r + 0.32 * g + 0.516 * b,
    ];
  }

  if (blindnessType === "Achromatopsia") {
    perceivedColor = [
      0.299 * r + 0.587 * g + 0.114 * b,
      0.299 * r + 0.587 * g + 0.114 * b,
      0.299 * r + 0.587 * g + 0.114 * b,
    ];
  }

  const simulation = rgbToHex(
    Math.round(perceivedColor[0]),
    Math.round(perceivedColor[1]),
    Math.round(perceivedColor[2])
  );

  return {
    simulation,
    percentage: colorSimilarityPercentage(color, simulation),
  };
};

const colorSimilarityPercentage = (color1: string, color2: string): number => {
  const [r1, g1, b1] = hexToRgb(color1) ?? [0, 0, 0];
  const [r2, g2, b2] = hexToRgb(color2) ?? [0, 0, 0];

  // Compute Euclidean distance
  const distance = Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  );

  // Max possible distance in RGB space is sqrt(3 * 255^2)
  const maxDistance = Math.sqrt(3 * Math.pow(255, 2));

  // Calculate similarity as a percentage
  const similarity = 1 - distance / maxDistance;

  return similarity * 100; // Returns similarity percentage
};

export const blindnessStats = [
  {
    name: "Deuteranomaly",
    description: "5.0% of men, 0.35% of women",
    info: "Green-weak type of color blindness. Greens are more muted, and reds may be confused with greens.",
  },
  {
    name: "Protanopia",
    description: "1.3% of men, 0.02% of women",
    info: "Red-green color blindness, with a leaning towards difficulties distinguishing red hues.",
  },
  {
    name: "Protanomaly",
    description: "1.3% of men, 0.02% of women",
    info: "Reduced sensitivity to red light causing reds to be less bright.",
  },
  {
    name: "Deuteranopia",
    description: "1.2% of men, 0.01% of women",
    info: "Red-green color blindness, with a leaning towards difficulties distinguishing green hues.",
  },
  {
    name: "Tritanopia",
    description: "0.001% of men, 0.03% of women",
    info: "Blue-yellow color blindness. Blues appear greener and it can be hard to tell yellow and red from pink.",
  },
  {
    name: "Tritanomaly",
    description: "0.0001% of men, 0.0001% of women",
    info: "Reduced sensitivity to blue light causing blues to be less bright, and difficulties distinguishing between yellow and red from pink.",
  },
  {
    name: "Achromatomaly",
    description: "0.003% of the population",
    info: "Reduced sensitivity to light causing colors to appear less bright and less saturated.",
  },
  {
    name: "Achromatopsia",
    description: "0.0001% of the population",
    info: "Total color blindness. Colors are seen as completely neutral.",
  },
];
