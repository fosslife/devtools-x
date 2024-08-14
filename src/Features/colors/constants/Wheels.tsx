import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Convert } from "@/Features/colors/utilities";

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

const normalizeValue = (value: number, max: number) => {
  return Math.max(0, Math.min(value, max));
};

const calculateGradient = (e: any) => {
  let V = (e: any) => {
    let { r: o = 50, x0: r = 50, y0: n = 50, deg: l } = e;
    return {
      x: normalizeValue(r + o * Math.cos((Math.PI / 180) * (l - 90)), 100),
      y: normalizeValue(n + o * Math.sin((Math.PI / 180) * (l - 90)), 100),
    };
  };

  const ei = Array(16)
    .fill(undefined)
    .map((_, o) => {
      let n = (360 / 16) * o,
        l = V({ deg: n });
      return {
        top: l.y,
        left: l.x,
        hue: n + 10,
      };
    });

  let { lightness: o, projectControls: d } = e,
    h =
      ei
        .map((e) => {
          let { hue: r, left: n, top: l } = e;
          return `radial-gradient(circle at ${n}% ${l}%, 
          hsla(${r}, 100%, ${o}%, 0.7) 0%, 
          hsla(${r}, 0%, ${o}%, 0) 43%)`;
        })
        .join(", ") + ", white";

  return h;
};

type ColorDot = {
  x: number;
  y: number;
  bg: string;
  rgb: string;
  hex: string;
  hsl: { h: number; s: number; l: number };
};

export const ColorWheel = ({
  colors = [],
  lightness = 50,
  setLightness = () => {},
  size = 250,
}: {
  colors: {
    color: ColorDot;
    updateColor: (color: { h: number; s: number; l: number }) => void;
  }[];
  lightness?: number;
  setLightness?: (lightness: number) => void;
  size?: number;
}) => {
  const backgroundStyle = useMemo(() => {
    return calculateGradient({ lightness });
  }, [lightness]);

  const handleLightnessChange = (event: any) => {
    setLightness(event.target.value);
  };

  const test_dots = [
    { h: 0, s: 100, l: 50 }, // Pure red
    { h: 30, s: 100, l: 50 }, // Orange
    { h: 60, s: 100, l: 50 }, // Yellow

    { h: 90, s: 100, l: 50 }, // Yellow-green
    { h: 120, s: 100, l: 50 }, // Green
    { h: 150, s: 100, l: 50 }, // Green-cyan

    { h: 180, s: 100, l: 50 }, // Cyan
    { h: 210, s: 100, l: 50 }, // Cyan-blue
    { h: 240, s: 100, l: 50 }, // Blue

    { h: 270, s: 100, l: 50 }, // Blue-magenta
    { h: 300, s: 100, l: 50 }, // Magenta
    { h: 330, s: 100, l: 50 }, // Magenta-red

    { h: 0, s: 50, l: 50 }, // Desaturated red
    { h: 120, s: 50, l: 50 }, // Desaturated green
    { h: 240, s: 50, l: 50 }, // Desaturated blue

    { h: 0, s: 100, l: 25 }, // Dark red
    { h: 120, s: 100, l: 25 }, // Dark green
    { h: 240, s: 100, l: 25 }, // Dark blue

    { h: 0, s: 100, l: 75 }, // Light red
    { h: 120, s: 100, l: 75 }, // Light green
    { h: 240, s: 100, l: 75 }, // Light blue

    // { h: 0, s: 0, l: 50 }, // Grey (no saturation)
    // { h: 0, s: 0, l: 25 }, // Dark grey
    { h: 0, s: 0, l: 75 }, // Light grey

    { h: 60, s: 50, l: 50 }, // Desaturated yellow
    { h: 180, s: 50, l: 50 }, // Desaturated cyan
    { h: 300, s: 50, l: 50 }, // Desaturated magenta
  ];

  return (
    <div>
      <div
        style={{
          width: size,
          height: size,
          background: backgroundStyle,
          borderRadius: "50%",
          position: "relative",
        }}
      >
        {colors.map(({ color }, index) => (
          <Dot key={index} {...color} />
        ))}
      </div>
      {/*<input*/}
      {/*  type="range"*/}
      {/*  min="0"*/}
      {/*  max="100"*/}
      {/*  value={lightness}*/}
      {/*  onChange={handleLightnessChange}*/}
      {/*/>*/}
    </div>
  );
};

const convert = new Convert();

export const getDot = (h: number, s: number, l: number): Dot => ({
  ...calculateColorWheelPosition({ h, s, l }, 50),
  bg: `hsl(${(h % 360).toFixed()}, ${s.toFixed()}%, ${l.toFixed()}%)`,
  rgb: `rgb(${convert.hslToRgb(h, s, l).join(", ")})`,
  hex: convert.hsl2hex({ h, s, l }),
  hsl: { h, s, l },
});

const Dot = ({ x, y, bg }: ColorDot) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `calc(${y}% - 5px)`, // Adjust for dot size (10px)
        left: `calc(${x}% - 5px)`,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        border: "1px solid white",
        transition: "all 0.3s ease-in-out",
        background: bg,
      }}
    />
  );
};
const calculateColorWheelPosition = (
  hsl: { h: number; s: number; l: number },
  wheelRadius: number
) => {
  // Normalize saturation to a 0-1 range
  const normalizedSaturation = hsl.s / 100;

  // Convert hue to radians and adjust for the starting point (top of the wheel)
  // const angleInRadians = ((hsl.h - 90) * Math.PI) / 180;
  const angleInRadians = ((hsl.h - 90) * Math.PI) / 180;

  // Calculate x and y based on the angle and normalized saturation
  const x =
    wheelRadius + wheelRadius * normalizedSaturation * Math.cos(angleInRadians);
  // const y =
  //   wheelRadius - wheelRadius * normalizedSaturation * Math.sin(angleInRadians);

  const y =
    wheelRadius + wheelRadius * normalizedSaturation * Math.sin(angleInRadians);

  return { x, y };
};
//
// export const WheelDisplay = ({
//   selectedColor,
//   wheelMode,
// }: {
//   selectedColor?: WheelContext["selectedColor"];
//   wheelMode?: WheelContext["wheelMode"];
// }) => {
//   const renderWheel = () => {
//     // Logic to render the wheel based on selectedColor and wheelMode
//     return "";
//   };
//
//   const lightness = 50;
//   // const gradient = useColorWheelGradient(lightness);
//   return (
//     <div>
//       <ColorWheel/>
//     </div>
//   );
// };
