export const getWheelGradient = (lightness: number = 50) => {
  const calculatePosition = (params: {
    radius?: number;
    x0?: number;
    y0?: number;
    deg: number;
  }) => {
    const { radius = 50, x0 = 50, y0 = 50, deg } = params;
    return {
      x: normalizeValue(
        x0 + radius * Math.cos((Math.PI / 180) * (deg - 90)),
        100
      ),
      y: normalizeValue(
        y0 + radius * Math.sin((Math.PI / 180) * (deg - 90)),
        100
      ),
    };
  };

  const gradientStops = Array(16)
    .fill(undefined)
    .map((_, index) => {
      const hue = (360 / 16) * index;
      const position = calculatePosition({ deg: hue });
      return {
        top: position.y,
        left: position.x,
        hue: hue + 10,
      };
    });

  // Todo this could be a bit more drastic towards white
  const adjustedLightness = 100 * Math.pow(lightness / 100, 2 - lightness / 50);
  const center = `hsl(0, 0%, ${adjustedLightness}%)`;

  const gradient =
    gradientStops
      .map(({ hue, left, top }) => {
        return `radial-gradient(circle at ${left}% ${top}%, 
      hsla(${hue}, 100%, ${lightness}%, 0.7) 0%, 
      hsla(${hue}, 0%, ${lightness}%, 0) 43%)`;
      })
      .join(", ") + `, ${center}`;

  return gradient;
};

const normalizeValue = (value: number, max: number) => {
  return Math.max(0, Math.min(value, max));
};
