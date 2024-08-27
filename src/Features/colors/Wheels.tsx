import { CSSProperties, type MouseEvent, useCallback, useState } from "react";
import { Convert } from "@/utils/colors";
import type { Hsl } from "@/types/colors";

type ColorDot = {
  x: number;
  y: number;
  bg: string;
  hsl: Hsl;
};

const convert = new Convert();

export const ColorWheel = ({
  colors = [],
  lightness = 50,
  updateColor,
  size = 250,
  style = {},
}: {
  colors: ColorDot[];
  updateColor: (color: string) => void;
  lightness?: number;
  size?: number;
  style?: CSSProperties;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  const handleMouseMoveOnWheel = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const radius = size / 2;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - radius;
      const y = e.clientY - rect.top - radius;

      const angle = (Math.atan2(y, x) * 360) / (Math.PI * 2) + 45;

      const h = Math.round(angle + 45) % 360;

      const distance = Math.sqrt(x * x + y * y);
      const s = Math.round((distance / radius) * 100) % 100;

      updateColor(convert.hsl2hex([h, s / 100, lightness / 100]));
    },
    [isDragging, lightness, updateColor]
  );

  return (
    <div
      role="slider"
      aria-valuemax={100}
      aria-valuemin={0}
      tabIndex={0}
      aria-valuenow={lightness}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        cursor: "pointer",
        ...style,
      }}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseMove={handleMouseMoveOnWheel}
    >
      {colors.map((color, index) => (
        <Dot key={index} {...color} moving={isDragging} />
      ))}
    </div>
  );
};

const Dot = ({
  x,
  y,
  bg,
}: ColorDot & {
  moving?: boolean;
}) => {
  return (
    <div
      style={{
        pointerEvents: "none",
        position: "absolute",
        top: `calc(${y}% - 5px)`, // Adjust for dot size (10px)
        left: `calc(${x}% - 5px)`,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        border: "1px solid white",
        background: bg,
      }}
    />
  );
};
