import { useCallback, useEffect } from "react";
import { getRandomColor } from "./utilities";

export const useColorRandomizer = (setColor: (color: string) => void) => {
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
};
