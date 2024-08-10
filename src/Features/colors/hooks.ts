import React, { useCallback, useEffect, useState } from "react";
import { getRandomColor } from "./utilities";

export const useColorRandomizer = (): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const [color, setColor] = useState<string>("#000000");

  const randomize = useCallback(() => {
    const randomColor = getRandomColor();
    setColor(randomColor);
  }, []);

  useEffect(() => {
    // Randomize the color on load
    randomize();

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") randomize();
    });

    return () => {
      window.removeEventListener("keydown", () => {});
    };
  }, []);

  return [color, setColor];
};
