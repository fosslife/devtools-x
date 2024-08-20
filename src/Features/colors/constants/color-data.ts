type EProps = {
  sourceColor: HSL;
  config?: {
    angle: number;
  };
};

let adjustments: Adjustments[] = [
  { s: 30, l: 0 },
  { s: 0, l: 10 },
  { s: 0, l: -10 },
  { s: -30, l: 0 },
];

type HSL = {
  h: number;
  s: number;
  l: number;
};

type Adjustments = {
  s: number;
  l: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const applyAdjustments = (baseColor: HSL, adjustments: Adjustments): HSL => {
  let { h, s, l } = baseColor;
  return {
    h,
    s: clamp(s + adjustments.s, 0, 100),
    l: clamp(l + adjustments.l, 0, 100),
  };
};

const adjustHue = (hue: number): number => (hue + 360) % 360;

export const wheels = {
  analogous: (props: EProps) => {
    const { sourceColor, config } = props;
    const angle = config?.angle ?? 30;
    return [
      {
        h: adjustHue(sourceColor.h - angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
      { ...sourceColor },
      {
        h: adjustHue(sourceColor.h + angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
    ];
  },
  monochromatic: (props: EProps) => {
    return adjustments.map((adjustment) =>
      applyAdjustments(props.sourceColor, adjustment)
    );
  },
  complementary: (props: EProps) => {
    const { sourceColor } = props;
    return [
      { ...sourceColor },
      { h: adjustHue(sourceColor.h + 180), s: sourceColor.s, l: sourceColor.l },
    ];
  },
  splitComplementary: (props: EProps) => {
    const angle = props.config?.angle ?? 150;
    const { sourceColor } = props;
    return [
      { ...sourceColor, h: adjustHue(sourceColor.h + angle) },
      { ...props.sourceColor },
      { ...sourceColor, h: adjustHue(sourceColor.h + 360 - angle) },
    ];
  },
  triadic: (props: EProps) => {
    const { sourceColor } = props;
    return [
      { h: adjustHue(sourceColor.h + 120), s: sourceColor.s, l: sourceColor.l },
      { ...sourceColor },
      { h: adjustHue(sourceColor.h + 240), s: sourceColor.s, l: sourceColor.l },
    ];
  },
  tetradic: (props: EProps) => {
    const angle = props.config?.angle ?? 30;
    const { sourceColor } = props;
    return [
      {
        h: adjustHue(sourceColor.h + 180 + angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
      {
        h: adjustHue(sourceColor.h - angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
      { ...sourceColor },
      {
        h: adjustHue(sourceColor.h + angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
      {
        h: adjustHue(sourceColor.h + 180 - angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
    ];
  },
  square: (props: EProps) => {
    const { sourceColor } = props;
    return [
      { ...sourceColor },
      { h: adjustHue(sourceColor.h + 90), s: sourceColor.s, l: sourceColor.l },
      { h: adjustHue(sourceColor.h + 180), s: sourceColor.s, l: sourceColor.l },
      { h: adjustHue(sourceColor.h + 270), s: sourceColor.s, l: sourceColor.l },
    ];
  },
  similar: (props: EProps) => {
    const { sourceColor } = props;
    const angle = props.config?.angle ?? 5;
    return [
      {
        h: adjustHue(sourceColor.h + 2 * angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
      {
        h: adjustHue(sourceColor.h + angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
      { ...sourceColor },
      {
        h: adjustHue(sourceColor.h - angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
      {
        h: adjustHue(sourceColor.h - 2 * angle),
        s: sourceColor.s,
        l: sourceColor.l,
      },
    ];
  },

  // Add other color wheel functions similarly...
};

const mainColorIndex = (wheel: string) => {
  switch (wheel) {
    case "analogous":
      return 1; // middle
    default:
      return 0;
  }
};
