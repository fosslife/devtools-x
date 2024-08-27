import type { Hsl } from "@/types/colors";
import { Convert } from "@/utils/colors";

export const getWheelDotLocation = (hsl: Hsl) => {
  return getWheelDotLocationWithCustomRad(hsl, 50);
};

const getWheelDotLocationWithCustomRad = (hsl: Hsl, rad: number) => {
  const [h, s, l] = hsl;
  const normalizedSaturation = s / 100;

  const angleInRadians = ((h - 90) * Math.PI) / 180;

  const x = rad + rad * normalizedSaturation * Math.cos(angleInRadians);
  const y = rad + rad * normalizedSaturation * Math.sin(angleInRadians);
  return { x, y, hsl, bg: new Convert().values("hsl", hsl).renderValue };
};
