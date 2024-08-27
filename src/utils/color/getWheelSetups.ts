import type { Hsl } from "@/types/colors";

type EProps = {
  sourceColor: Hsl;
  config?: {
    angle: number;
  };
};

type Adjustments = {
  s: number;
  l: number;
};

const monochromaticAdjustments: Adjustments[] = [
  { s: 30, l: 0 },
  { s: 0, l: 10 },
  { s: 0, l: -10 },
  { s: -30, l: 0 },
];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const applyAdjustments = (baseColor: Hsl, adjustments: Adjustments): Hsl => {
  const [h, s, l] = baseColor;
  return [
    h,
    clamp(s + adjustments.s, 0, 100),
    clamp(l + adjustments.l, 0, 100),
  ];
};

const adjustHue = (hue: number): number => (hue + 360) % 360;

export const getWheelSetups = [
  {
    key: "analogous",
    func: (props: EProps) => {
      const { sourceColor, config } = props;
      const [h, s, l] = sourceColor;
      const angle = config?.angle ?? 30;
      return [
        [adjustHue(h - angle), s, l],
        sourceColor,
        [adjustHue(h + angle), s, l],
      ];
    },
  },
  {
    key: "monochromatic",
    func: (props: EProps) =>
      monochromaticAdjustments.map((adjustment) =>
        applyAdjustments(props.sourceColor, adjustment)
      ),
  },
  {
    key: "complementary",
    func: (props: EProps) => {
      const { sourceColor } = props;
      const [h, s, l] = sourceColor;
      return [sourceColor, [adjustHue(h + 180), s, l]];
    },
  },
  {
    key: "splitComplementary",
    func: (props: EProps) => {
      const angle = props.config?.angle ?? 150;
      const { sourceColor } = props;
      const [h, s, l] = sourceColor;
      return [
        [adjustHue(h + angle), s, l],
        sourceColor,
        [adjustHue(h + 360 - angle), s, l],
      ];
    },
  },
  {
    key: "triadic",
    func: (props: EProps) => {
      const { sourceColor } = props;
      const [h, s, l] = sourceColor;
      return [
        [adjustHue(h + 120), s, l],
        sourceColor,
        [adjustHue(h + 240), s, l],
      ];
    },
  },
  {
    key: "tetradic",
    func: (props: EProps) => {
      const angle = props.config?.angle ?? 30;
      const { sourceColor } = props;
      const [h, s, l] = sourceColor;
      return [
        [adjustHue(h + 180 + angle), s, l],
        [adjustHue(h - angle), s, l],
        sourceColor,
        [adjustHue(h + angle), s, l],
        [adjustHue(h + 180 - angle), s, l],
      ];
    },
  },
  {
    key: "square",
    func: (props: EProps) => {
      const { sourceColor } = props;
      const [h, s, l] = sourceColor;
      return [
        sourceColor,
        [adjustHue(h + 90), s, l],
        [adjustHue(h + 180), s, l],
        [adjustHue(h + 270), s, l],
      ];
    },
  },
  {
    key: "similar",
    func: (props: EProps) => {
      const { sourceColor } = props;
      const [h, s, l] = sourceColor;
      const angle = props.config?.angle ?? 5;
      return [
        [adjustHue(h + 2 * angle), s, l],
        [adjustHue(h + angle), s, l],
        sourceColor,
        [adjustHue(h - angle), s, l],
        [adjustHue(h - 2 * angle), s, l],
      ];
    },
  },
];
