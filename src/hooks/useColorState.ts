import React, { useCallback, useEffect, useState } from "react";
import { Convert, getRandomColor } from "@/utils/colors";
import type { ColorType, ColorValue, Hex } from "@/types/colors";

export type Output = {
  type: ColorType;
  value: ColorValue;
  renderValue: string;
  editableValue: string;
  onChange: (value: string) => void;
};
type UseColorStateReturnType = [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  Output[],
];

export const useColorState = (): UseColorStateReturnType => {
  const [color, setColor] = useState<Hex>("#000000");

  const [conversions, setConversions] = useState<Output[]>([]);

  const randomize = useCallback(() => {
    const nex = getRandomColor();
    setColor(nex);
  }, []);

  useEffect(() => {
    // Randomize the color on load
    randomize();

    const keypress = (e: KeyboardEvent) => {
      if (e.code === "Space") randomize();
    };

    window.addEventListener("keydown", keypress);

    return () => {
      window.removeEventListener("keydown", keypress);
    };
  }, []);

  useEffect(() => {
    try {
      const convert = new Convert();
      const hexConverted = [
        { type: "hex", value: color as Hex, onChange: setColor },
        { type: "rgb", value: convert.trueHex2rgb(color) },
        { type: "hsl", value: convert.hex2hsl(color) },
        // { type: "hsv", value: convert.hex2hsv(color) }, // css doesn't support hsv
        { type: "lch", value: convert.hex2lch(color) },
        { type: "lab", value: convert.hex2lab(color) },
        // { type: "xyz", value: convert.hex2xyz(color) }, // cs s doesn't support xyz
        // { type: "cmyk", value: convert.hex2cmyk(color) }, // css doesn't support cmyk
      ] as Partial<Output>[];

      setConversions(
        hexConverted.map(({ type, value, onChange }) => ({
          type,
          onChange,
          ...convert.values(type!, value!),
        })) as Output[]
      );
    } catch (e) {
      console.error(e);
    }
  }, [color]);

  return [color, setColor, conversions];
};
