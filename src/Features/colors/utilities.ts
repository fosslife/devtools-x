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
const fixFloat = (num: number) => parseFloat((num * 100).toFixed(1));

export class Convert {
  hex2rgb = (hex: string) => {
    // #<hex-color>{3,4,6,8}
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
      return [red, green, blue, alpha].map((c) => (c * 100) / 255);
    }
    return [0, 0, 0, 1];
    // hex = hex.startsWith("#") ? hex.slice(1) : hex;
    // if (hex.length === 3) {
    //   hex = Array.from(hex).reduce((str, x) => str + x + x, ""); // 123 -> 112233
    // }
    // return hex
    //   .split(/([a-z0-9]{2,2})/)
    //   .filter(Boolean)
    //   .map((x) => parseInt(x, 16));
    // return `rgb${values.length == 4 ? "a" : ""}(${values.join(", ")})`;
  };

  hex2hsv = (hex: string) => {
    const [h, s, l] = this.hex2hsl(hex) as [number, number, number];
    return this.hsl2hsv(h, s, l);
  };

  hex2hsl = (hex: string, asObj = false) => {
    const [r, g, b] = this.hex2rgb(hex);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h: number,
      s: number,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h =
        max === r
          ? (g - b) / d + (g < b ? 6 : 0)
          : max === g
            ? (b - r) / d + 2
            : (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }

    return [Math.round(h), fixFloat(s), fixFloat(l)];
  };

  hsl2Object = (hsl: number[]) => {
    const [h, s, l] = hsl;
    return { h, s, l };
  };

  hex2lch = (hex: string) => {
    const rgb = this.hex2rgb(hex);
    if (!rgb) return [0, 0, 0];
    return this.rgb2lch(...(rgb as [number, number, number]));
  };

  rgb2hex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (Math.round((r * 255) / 100) << 16) + (Math.round((g * 255) / 100) << 8) + Math.round((b * 255) / 100)).toString(16).slice(1)}`;
  };

  rgb2lch = (r: number, g: number, b: number) => {
    const [x, y, z] = this.rgb2xyz(r, g, b);
    const [_l, _a, _b] = this.xyz2lab(x, y, z);
    return this.lab2lch(_l, _a, _b);
  };

  rgb2xyz = (r: number, g: number, b: number) => {
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
    );
  };

  hsv2hsl = (h: number, s: number, v: number) => {
    const l = ((200 - s) * v) / 200;
    s = l === 0 || l === 100 ? 0 : (s * v) / 100 / (l < 50 ? l : 100 - l);
    return [h, s * 100, l / 2];
  };

  hsl2hsv = (h: number, s: number, l: number) => {
    const v = l + (s * Math.min(l, 100 - l)) / 100;
    s = v === 0 ? 0 : 2 * (1 - l / v);
    return { h, s: s * 100, v };
  };

  hslToRgb = (h: number, s: number, l: number) => {
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

  hsv2rgb = (h: number, s: number, v: number, a: number) => {
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

  lch2hex = (l: number, c: number, h: number) => {
    const [r, g, b] = this.lch2rgb(l, c, h);
    return this.rgb2hex(r, g, b);
  };

  lch2rgb = (lchL: number, lchC: number, lchH: number) => {
    const [labL, labA, labB] = this.lch2lab(lchL, lchC, lchH);
    const [xyzX, xyzY, xyzZ] = this.lab2xyz(labL, labA, labB);
    const [rgbR, rgbG, rgbB] = this.xyz2rgb(xyzX, xyzY, xyzZ);
    return [rgbR, rgbG, rgbB];
  };

  lch2lab = (lchL: number, lchC: number, lchH: number) => {
    // convert to Lab a and b from the polar form
    const [labA, labB] = [lchC * cosd(lchH), lchC * sind(lchH)];
    return [lchL, labA, labB];
  };

  xyz2rgb = (xyzX: number, xyzY: number, xyzZ: number) => {
    const [lrgbR, lrgbB, lrgbG] = matrix(
      [xyzX, xyzY, xyzZ],
      [
        [3.2404542, -1.5371385, -0.4985314],
        [-0.969266, 1.8760108, 0.041556],
        [0.0556434, -0.2040259, 1.0572252],
      ]
    );
    const [rgbR, rgbG, rgbB] = [lrgbR, lrgbB, lrgbG].map((v) =>
      v > 0.31308 ? 1.055 * pow(v / 100, 1 / 2.4) * 100 - 5.5 : 12.92 * v
    );
    return [rgbR, rgbG, rgbB];
  };

  xyz2lab = (x: number, y: number, z: number) => {
    // calculate D50 XYZ from D65 XYZ
    const [d50X, d50Y, d50Z] = matrix(
      [x, y, z],
      [
        [1.0478112, 0.0228866, -0.050127],
        [0.0295424, 0.9904844, -0.0170491],
        [-0.0092345, 0.0150436, 0.7521316],
      ]
    );
    // calculate f
    const [f1, f2, f3] = [d50X / wd50X, d50Y / wd50Y, d50Z / wd50Z].map(
      (value) => (value > epsilon ? cbrt(value) : (kappa * value + 16) / 116)
    );
    return [116 * f2 - 16, 500 * (f1 - f2), 200 * (f2 - f3)];
  };

  lab2xyz = (labL: number, labA: number, labB: number) => {
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

  lab2lch = (labL: number, labA: number, labB: number) => {
    return [
      labL,
      sqrt(pow(labA, 2) + pow(labB, 2)), // convert to chroma
      rad2deg(atan2(labB, labA)), // convert to hue, in degrees
    ];
  };

  canBeWhite = (hex: string) => {
    const [h, s, l] = this.hex2hsl(hex);
    return l < 55;
  };
}

const c = new Convert();

export const renderHsl = (hsl: number[]) =>
  `${hsl[0].toFixed()}, ${(hsl[1] * -1).toFixed()}%, ${(hsl[2] / 100).toFixed()}%`;

export const hex2cmyk = (hex: string) => {
  return ChromaJS(hex).cmyk();
};
export const renderCmyk = (cmyk: number[]) =>
  cmyk.map((v) => (v * 100).toFixed()).join(", ");

import ChromaJS from "chroma-js";

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

const render_lch2hex = (l: number, c: number, h: number) =>
  ChromaJS.lch(l, c, h).hex();

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

interface ShadingConfig {
  color: string;
  shades: number;
  start: number;
  end: number;
  easeMethod: EaseMethod;
  includeBase: boolean;
  space: "full-gamut" | "other"; // You can define other spaces if needed
}

type EaseMethod =
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "linear"
  | "custom"
  | "circ-in"
  | "circ-out";

const getEasing = (
  start: number,
  end: number,
  shades: number,
  easeMethod: EaseMethod,
  currentEasing?: number[]
): number[] => {
  let _easing: number[] = [];
  if (easeMethod === "custom") {
    if (!currentEasing || !currentEasing.length) {
      _easing = new Array(shades).fill(start);
    } else {
      _easing = currentEasing;
    }
  } else {
    for (let i = 0; i < shades; i++) {
      switch (easeMethod) {
        case "ease-in":
          _easing.push(start + (end - start) * Math.pow(i / (shades - 1), 2));
          break;
        case "ease-out":
          _easing.push(
            start + (end - start) * (1 - Math.pow(1 - i / (shades - 1), 2))
          );
          break;
        case "ease-in-out":
          _easing.push(
            start +
              (end - start) *
                (-Math.cos((i / (shades - 1)) * Math.PI) / 2 + 0.5)
          );
          break;
        case "circ-in":
          _easing.push(
            start +
              (end - start) *
                (1 - Math.sqrt(1 - (i / (shades - 1)) * (i / (shades - 1))))
          );
          break;
        case "circ-out":
          _easing.push(
            start +
              (end - start) *
                Math.sqrt(1 - (i / (shades - 1) - 1) * (i / (shades - 1) - 1))
          );
          break;
        case "linear":
        default:
          _easing.push(start + (end - start) * (i / (shades - 1)));
      }
    }
  }
  return _easing;
};

export const createShading = (config: ShadingConfig) => {
  const { color, shades, start, end, easeMethod, includeBase, space } = config;

  const easingValues = getEasing(start, end, shades, easeMethod);

  const baseColorLCH = c.hex2lch(color);
  if (!baseColorLCH) {
    throw new Error("Invalid base color provided");
  }

  const baseLightness = baseColorLCH[0];

  const shadeColors = easingValues.map((easedValue) => {
    let newLightness;
    if (baseLightness > 50) {
      // Color is light, interpolate from baseLightness to 100
      newLightness = baseLightness - (baseLightness - 0) * (easedValue / 100);
    } else {
      // Color is dark, interpolate from baseLightness to 0
      newLightness = baseLightness + (100 - baseLightness) * (easedValue / 100);
    }

    const newColorLCH: [number, number, number] = [
      newLightness,
      baseColorLCH[1],
      baseColorLCH[2],
    ];
    return c.lch2hex(newColorLCH[0], newColorLCH[1], newColorLCH[2]);
  });

  if (includeBase) {
    shadeColors.push(color);
  }

  return {
    shades: shadeColors,
  };
};
