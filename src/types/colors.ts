type ColorValueArr = [number, number, number];
type ColorValueArrAlpha = [number, number, number, number];

export type Hex = string;

export type Rgb = ColorValueArr | ColorValueArrAlpha;
export type Hsl = ColorValueArr;
export type Hsv = ColorValueArr | ColorValueArrAlpha;
export type Lch = ColorValueArr;
export type Lab = ColorValueArr;
export type Xyz = ColorValueArr;
export type Cmyk = ColorValueArrAlpha;

export type ColorValue = Hex | Rgb | Hsl | Hsv | Lch | Lab | Xyz | Cmyk;
export type ColorType =
  | "hex"
  | "rgb"
  | "hsl"
  | "hsv"
  | "lch"
  | "lab"
  | "xyz"
  | "cmyk";

export type ColorHarmony = {
  key: string;
  colors: Hex[];
};
