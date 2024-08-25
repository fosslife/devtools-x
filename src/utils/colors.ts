import type {
  Cmyk,
  ColorType,
  ColorValue,
  Hex,
  Hsl,
  Hsv,
  Lab,
  Lch,
  Rgb,
  Xyz,
} from "@/types/colors";
import ChromaJS from "chroma-js";

export const {
  abs,
  atan2,
  cbrt,
  cos,
  exp,
  floor,
  max,
  min,
  PI,
  pow,
  sin,
  sqrt,
} = Math;

export const epsilon = pow(6, 3) / pow(29, 3);
export const kappa = pow(29, 3) / pow(3, 3);
export const precision = 100000000;
export const [wd50X, wd50Y, wd50Z] = [96.42, 100, 82.49];

// Degree and Radian conversion utilities
export const deg2rad = (degrees: number) => (degrees * PI) / 180;
export const rad2deg = (radians: number) => (radians * 180) / PI;
export const atan2d = (y: number, x: number) => rad2deg(atan2(y, x));
export const cosd = (degrees: number) => cos(deg2rad(degrees));
export const sind = (degrees: number) => sin(deg2rad(degrees));

const matrix = (params: number[], mats: any[]) => {
  return mats.map((mat: any[]) =>
    mat.reduce(
      (acc: number, value: number, index: string | number) =>
        acc +
        (params[index as number] * precision * (value * precision)) /
          precision /
          precision,
      0
    )
  );
};

const hexColorMatch =
  /^#?(?:([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])?|([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})?)$/i;

type MixedValue = number | string;

export class Convert {
  /**
   * Hex
   */

  // This way we ensure we don't lose any data, but it isn't a true 1:1 conversion
  hex2rgb = (hex: Hex): Rgb => {
    const [, r, g, b, a, rr, gg, bb, aa] = hex.match(hexColorMatch) || [];
    if (rr !== undefined || r !== undefined) {
      const red = rr !== undefined ? parseInt(rr, 16) : parseInt(r + r, 16);
      const green = gg !== undefined ? parseInt(gg, 16) : parseInt(g + g, 16);
      const blue = bb !== undefined ? parseInt(bb, 16) : parseInt(b + b, 16);
      const alpha =
        aa !== undefined
          ? parseInt(aa, 16)
          : a !== undefined
            ? parseInt(a + a, 16)
            : 255;
      return [red, green, blue, alpha].map((c) => (c * 100) / 255) as Rgb;
    }
    return [0, 0, 0, 1];
  };

  trueHex2rgb = (hex: Hex): Rgb => {
    try {
      return ChromaJS(hex).rgb();
    } catch (e) {
      console.warn(e);
      return [0, 0, 0, 1];
    }
  };

  hex2hsv = (hex: Hex): Hsv => {
    const hsl = this.hex2hsl(hex);
    return this.hsl2hsv(hsl);
  };

  hex2hsl = (hex: Hex): Hsl => {
    try {
      const [h, s, l] = ChromaJS(hex).hsl();
      return [h, s * 100, l * 100];
    } catch (e) {
      console.warn(e);
      return [0, 0, 0];
    }
  };

  hsl2hex = (hsl: Hsl): Hex => {
    try {
      let [h, s, l] = hsl;
      h = h % 360;
      return ChromaJS.hsl(h, s, l).hex();
    } catch (e) {
      console.warn(e);
      return "#000000";
    }
  };

  hex2cmyk = (hex: Hex): Cmyk => {
    try {
      return ChromaJS(hex)
        .cmyk()
        .map((v) => v * 100) as Cmyk;
    } catch (e) {
      console.warn(e);
      return [0, 0, 0, 0];
    }
  };

  hex2lch = (hex: Hex): Lch => {
    const rgb = this.hex2rgb(hex);
    if (!rgb) return [0, 0, 0];
    return this.rgb2lch(rgb);
  };

  hex2lab = (hex: Hex): Lab => {
    const rgb = this.hex2rgb(hex);
    if (!rgb) return [0, 0, 0];
    const xyz = this.rgb2xyz(rgb);
    const lab = this.xyz2lab(xyz);
    return lab;
  };

  hex2xyz = (hex: Hex): Xyz => {
    const rgb = this.hex2rgb(hex);
    if (!rgb) return [0, 0, 0];
    return this.rgb2xyz(rgb);
  };

  hexRender = (hex: Hex) => {
    return (hex.startsWith("#") ? hex : `#${hex}`).toUpperCase();
  };

  /**
   * RGB
   */

  rgb2hex = (rgb: Rgb): Hex => {
    const [r, g, b] = rgb; // todo handle alpha
    return `#${((1 << 24) + (Math.round((r * 255) / 100) << 16) + (Math.round((g * 255) / 100) << 8) + Math.round((b * 255) / 100)).toString(16).slice(1)}`;
  };

  rgb2lch = (rgb: Rgb) => {
    const xyz = this.rgb2xyz(rgb);
    const lab = this.xyz2lab(xyz);
    return this.lab2lch(lab);
  };

  rgb2xyz = (rgb: Rgb): Xyz => {
    const [r, g, b] = rgb;
    const [lR, lB, lG] = [r, g, b].map((v) =>
      v > 4.045 ? Math.pow((v + 5.5) / 105.5, 2.4) * 100 : v / 12.92
    );
    return matrix(
      [lR, lB, lG],
      [
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.072175],
        [0.0193339, 0.119192, 0.9503041],
      ]
    ) as Xyz;
  };

  /**
   * HSL
   */

  hsl2hsv = (hsl: Hsl): Hsv => {
    let [h, s, l] = hsl;
    const v = l + (s * Math.min(l, 100 - l)) / 100;
    s = v === 0 ? 0 : 2 * (1 - l / v);
    return [h, s * 100, v];
  };

  hslToRgb = (hsl: Hsl): Rgb => {
    let [h, s, l] = hsl;
    let r, g, b;
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [
      Math.min(255, Math.max(0, Math.round(r * 255))),
      Math.min(255, Math.max(0, Math.round(g * 255))),
      Math.min(255, Math.max(0, Math.round(b * 255))),
    ];
  };

  /**
   * HSV
   */

  hsv2rgb = (hsv: Hsv): Rgb => {
    const [h, s, v] = hsv;
    const a = hsv?.length === 4 ? hsv[3] : 100;
    const rgbI = floor(h / 60);
    // calculate rgb parts
    const rgbF = (h / 60 - rgbI) & 1 ? h / 60 - rgbI : 1 - h / 60 - rgbI;
    const rgbM = (v * (100 - s)) / 100;
    const rgbN = (v * (100 - s * rgbF)) / 100;
    const rgbA = a / 100;

    const [rgbR, rgbG, rgbB] =
      rgbI === 5
        ? [v, rgbM, rgbN]
        : rgbI === 4
          ? [rgbN, rgbM, v]
          : rgbI === 3
            ? [rgbM, rgbN, v]
            : rgbI === 2
              ? [rgbM, v, rgbN]
              : rgbI === 1
                ? [rgbN, v, rgbM]
                : [v, rgbN, rgbM];
    return [rgbR, rgbG, rgbB, rgbA];
  };

  hsv2hsl = (hsv: Hsv): Hsl => {
    let [h, s, v] = hsv;
    const l = ((200 - s) * v) / 200;
    s = l === 0 || l === 100 ? 0 : (s * v) / 100 / (l < 50 ? l : 100 - l);
    return [h, s * 100, l / 2];
  };

  /**
   * LCH
   */

  lch2hex = (lch: Lch): Hex => {
    const rgb = this.lch2rgb(lch);
    return this.rgb2hex(rgb);
  };

  lch2rgb = (lch: Lch): Rgb => {
    const lab = this.lch2lab(lch);
    const xyz = this.lab2xyz(lab);
    const rgb = this.xyz2rgb(xyz);
    return rgb;
  };

  lch2lab = (lch: Lch): Lab => {
    const [lchL, lchC, lchH] = lch;
    // convert to Lab a and b from the polar form
    return [lchL, lchC * cosd(lchH), lchC * sind(lchH)];
  };

  /**
   * XYZ
   */

  xyz2rgb = (xyz: Xyz): Rgb => {
    const [lrgbR, lrgbB, lrgbG] = matrix(xyz, [
      [3.2404542, -1.5371385, -0.4985314],
      [-0.969266, 1.8760108, 0.041556],
      [0.0556434, -0.2040259, 1.0572252],
    ]);
    const [rgbR, rgbG, rgbB] = [lrgbR, lrgbB, lrgbG].map((v) =>
      v > 0.31308 ? 1.055 * pow(v / 100, 1 / 2.4) * 100 - 5.5 : 12.92 * v
    );
    return [rgbR, rgbG, rgbB];
  };

  xyz2lab = (xyz: Xyz): Lab => {
    // calculate D50 XYZ from D65 XYZ
    const [d50X, d50Y, d50Z] = matrix(xyz, [
      [1.0478112, 0.0228866, -0.050127],
      [0.0295424, 0.9904844, -0.0170491],
      [-0.0092345, 0.0150436, 0.7521316],
    ]);
    // calculate f
    const [f1, f2, f3] = [d50X / wd50X, d50Y / wd50Y, d50Z / wd50Z].map(
      (value) => (value > epsilon ? cbrt(value) : (kappa * value + 16) / 116)
    );
    return [116 * f2 - 16, 500 * (f1 - f2), 200 * (f2 - f3)];
  };

  /**
   * LAB
   */

  lab2xyz = (lab: Lab): Xyz => {
    const [labL, labA, labB] = lab;
    // compute f, starting with the luminance-related term
    const f2 = (labL + 16) / 116;
    const f1 = labA / 500 + f2;
    const f3 = f2 - labB / 200;
    // compute pre-scaled XYZ
    const [initX, initY, initZ] = [
      pow(f1, 3) > epsilon ? pow(f1, 3) : (116 * f1 - 16) / kappa,
      labL > kappa * epsilon ? pow((labL + 16) / 116, 3) : labL / kappa,
      pow(f3, 3) > epsilon ? pow(f3, 3) : (116 * f3 - 16) / kappa,
    ];
    const [xyzX, xyzY, xyzZ] = matrix(
      // compute XYZ by scaling pre-scaled XYZ by reference white
      [initX * wd50X, initY * wd50Y, initZ * wd50Z],
      // calculate D65 XYZ from D50 XYZ
      [
        [0.9555766, -0.0230393, 0.0631636],
        [-0.0282895, 1.0099416, 0.0210077],
        [0.0122982, -0.020483, 1.3299098],
      ]
    );
    return [xyzX, xyzY, xyzZ];
  };

  lab2lch = (lab: Lab): Lch => {
    const [labL, labA, labB] = lab;
    return [
      labL,
      sqrt(pow(labA, 2) + pow(labB, 2)), // convert to chroma
      rad2deg(atan2(labB, labA)), // convert to hue, in degrees
    ];
  };

  /**
   * CMYK
   */

  cmyk2hex = (cmyk: Cmyk): Hex => {
    return ChromaJS(...cmyk).hex();
  };

  /**
   * Utils
   */
  canBeWhite = (hex: string) => {
    const [_h, _s, l] = this.hex2hsl(hex);
    return l < 55;
  };

  values = (type: ColorType, c: ColorValue) => {
    return {
      value: c,
      renderValue: this.render(type, c),
      editableValue: this.render(type, c, true),
    };
  };

  private render = (type: ColorType, c: ColorValue, editable = false) => {
    if (typeof c === "string") return type === "hex" ? c.toUpperCase() : "";
    if (!Array.isArray(c)) return "";

    const skipAlpha = type === "hex" || type === "cmyk";
    const alpha = !skipAlpha && c.length === 4 && c[3] !== 1;

    const roundedValues = (alpha ? c.slice(0, 3) : c).map((v) => Math.round(v));

    let values: MixedValue[] = roundedValues;
    let delimiter = ", ";

    switch (type) {
      case "rgb":
        // fix the alpha value
        if (alpha && typeof values[3] === "number") {
          values[3] = values[3] > 1 ? values[3] / 100 : values[3];
        }
        break;

      case "hsl":
      case "hsv":
        values = [values[0], `${values[1]}%`, `${values[2]}%`];
        if (alpha) values.push(c[3]);
        break;
      case "lch":
      case "lab":
        delimiter = " ";
        values[0] = `${values[0]}%`;
        break;
      case "cmyk":
        values = c.map((v) => `${Math.round(v)}%`);
        break;
    }

    return !editable
      ? `${type}${alpha ? "a" : ""}(${values.join(delimiter)})`
      : values.join(delimiter);
  };
}

const c = new Convert();

export const renderHsl = (hsl: number[]) =>
  `${hsl[0].toFixed()}, ${(hsl[1] * -1).toFixed()}%, ${(hsl[2] / 100).toFixed()}%`;

export const hex2cmyk = (hex: string) => {
  try {
    return ChromaJS(hex).cmyk();
  } catch (e) {
    console.warn(e);
    return [0, 0, 0, 0];
  }
};
export const renderCmyk = (cmyk: number[]) =>
  cmyk.map((v) => (v * 100).toFixed()).join(", ");

const intLch2hex = (l: number, c: number, h: number) =>
  ChromaJS.lch(l, c, h).hex();

const interpolate = (
  start: number,
  end: number,
  step: number,
  maxStep: number
) => {
  let diff = end - start;
  if (Math.abs(diff) > 180) {
    diff = -(Math.sign(diff) * (360 - Math.abs(diff)));
  }
  return (start + (diff * step) / maxStep) % 360;
};

export const interpolateColor = (
  color: [number, number, number],
  interpolateBy: "l" | "c" | "h",
  steps: number,
  endValue: number
): string[] => {
  const [l, c, h] = color;
  const interpolatedColors: string[] = [];

  for (let i = 0; i < steps; i++) {
    let currentL = l,
      currentC = c,
      currentH = h;

    switch (interpolateBy) {
      case "l":
        currentL = interpolate(l, endValue, i, steps - 1);
        break;
      case "c":
        currentC = interpolate(c, endValue, i, steps - 1); // Grey color
        break;
      case "h":
        currentH = interpolate(h, endValue, i, steps - 1);
        break;
    }

    interpolatedColors.push(render_lch2hex(currentL, currentC, currentH));
  }

  return interpolatedColors;
};

const render_lch2hex = (l: number, c: number, h: number) => {
  try {
    return ChromaJS.lch(l, c, h).hex();
  } catch (e) {
    console.warn(e);
    return "#000000";
  }
};

export const interpolateTwoColors = (
  c1: [number, number, number],
  c2: [number, number, number],
  steps: number
) => {
  let interpolatedColorArray = [];

  for (let i = 0; i < steps; i++) {
    interpolatedColorArray.push(
      render_lch2hex(
        interpolate(c1[0], c2[0], i, steps - 1), // interpolate lightness
        interpolate(c1[1], c2[1], i, steps - 1), // interpolate chroma
        interpolate(c1[2], c2[2], i, steps - 1) // interpolate hue
      )
    );
  }

  return interpolatedColorArray;
};

export const getInterpolateShades = (
  startColor: string,
  endColor: string,
  shades: number
) => {
  const [l1, c1, h1] = c.hex2lch(startColor) ?? [0, 0, 0];
  const [l2, c2, h2] = c.hex2lch(endColor) ?? [0, 0, 0];

  return interpolateTwoColors([l1, c1, h1], [l2, c2, h2], shades);
};

export const getRandomColor = () => {
  const rgb = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 256)
  ) as Rgb;

  const randomColor = new Convert().rgb2hex(rgb);
  return randomColor;
};
