import { createContext, ReactNode, useContext, useState } from "react";

type WheelContext = {
  selectedColor: string;
  changeColor: (color: string) => void;
  wheelMode: string;
  changeMode: (mode: string) => void;
};
const ColorWheelContext = createContext<WheelContext>({
  selectedColor: "",
  changeColor: () => {},
  wheelMode: "",
  changeMode: () => {},
});

export const useColorWheel = () => useContext(ColorWheelContext);

export const ColorWheelProvider = ({ children }: { children: ReactNode }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [wheelMode, setWheelMode] = useState("analogous");

  const changeColor = (color: string) => {
    setSelectedColor(color);
  };

  const changeMode = (mode: string) => {
    setWheelMode(mode);
  };

  return (
    <ColorWheelContext.Provider
      value={{ selectedColor, changeColor, wheelMode, changeMode }}
    >
      {children}
    </ColorWheelContext.Provider>
  );
};
