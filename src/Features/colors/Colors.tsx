import classes from "./styles.module.css";

import {
  Box,
  Collapse,
  Group,
  Stack,
  Switch,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { Fragment, useState } from "react";
import CustomPicker from "./CustomPicker";
import { BsMoon, BsSun } from "react-icons/bs";

import { OutputBox } from "../../Components/OutputBox";
import { clipboard } from "@tauri-apps/api";
import {
  getInterpolateShades,
  renderCmyk,
  renderHsl,
  Convert,
  interpolateColor,
  hex2cmyk,
} from "./utilities";
import {
  canBeWhite,
  checkContrast,
  formatRatio,
  meetsMinimumRequirements,
} from "./contrast";
import {
  analogous,
  complementary,
  compound,
  directComplementary,
  doubleSplitComplementary,
  monochromatic,
  splitComplementary,
  square,
  triadic,
} from "./harmonies";
import { RenderShades } from "./RenderShades";

const Colors = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [config, setConfig] = useState({
    steps: 15,
    harmoniesOpen: false,
  });
  const [history, setHistory] = useState<string[]>(Array(20).fill("#000000"));
  const [color, setColor] = useState<string>("#000000");

  const toggleHarmonies = () => {
    setConfig((prev) => ({ ...prev, harmoniesOpen: !prev.harmoniesOpen }));
  };
  useColorRandomizer(setColor);
  const onCopy = () => {
    // fill one color in history
    setHistory((prev) => {
      let newHistory = [...prev];
      newHistory.pop();
      newHistory.unshift(color);
      return newHistory;
    });
  };

  const copy = (color: string) => {
    clipboard.writeText(color.startsWith("#") ? color : `#${color}`);
    setHistory((prev) => {
      let newHistory = [...prev];
      newHistory.pop();
      newHistory.unshift(color);
      return newHistory;
    });
  };

  const [l, c, h] = new Convert().hex2lch(color);

  const shades = interpolateColor([l, c, h], "l", config.steps, 1); // towards black

  const tints = getInterpolateShades(color, "#ffffff", config.steps); // towards white
  const tones = getInterpolateShades(color, "#808080", config.steps); // towards grey

  const after = interpolateColor([l, c, h], "h", config.steps / 2, h + 90); // rotating the hue
  const before = interpolateColor(
    [l, c, h],
    "h",
    config.steps / 2,
    h - 90
  ).reverse(); // rotating the hue
  const hues = before.concat(after.slice(1));

  const temperaturesCool = interpolateColor([l, c, h], "h", config.steps, 240);
  const temperaturesWarm = interpolateColor([l, c, h], "h", config.steps, 60);
  const temperatures = h > 180 ? temperaturesCool : temperaturesWarm;

  const conv = new Convert();
  const hsv = Object.values(conv.hex2hsv(color))
    .map((v) => v.toFixed())
    .join(", ");

  const harmonies = {
    analogous: analogous(color),
    monochromatic: monochromatic(color),
    triadic: triadic(color),
    complementary: complementary(color),
    splitComplementary: splitComplementary(color),
    doubleSplitComplementary: doubleSplitComplementary(color),
    square: square(color),
    compound: compound(color),
  };
  return (
    <Stack
      align="center"
      style={{ height: "100%", width: "100%", overflowY: "scroll" }}
    >
      <CustomPicker
        hexCode={color.startsWith("#") ? color.slice(1) : color}
        onChange={(color) => setColor(color.hex)}
      />

      <Group gap={10} grow style={{ marginBottom: 14 }}>
        <OutputBox
          label="RGB:"
          value={conv
            .hex2rgb(color)
            .map((v) => v.toFixed())
            .join(", ")}
          onCopy={onCopy}
        />
        <OutputBox label="HEX:" value={color.toUpperCase()} onCopy={onCopy} />
        <OutputBox
          label="CMYK:"
          value={renderCmyk(hex2cmyk(color))}
          onCopy={onCopy}
        />
        <OutputBox
          label="HSL:"
          value={renderHsl(conv.hex2hsl(color))}
          onCopy={onCopy}
        />
        <OutputBox label="HSV:" value={hsv} onCopy={onCopy} />
      </Group>

      <RenderShades colors={shades} setColor={copy} label="Shades" />
      <RenderShades colors={tones} setColor={copy} label="Tones" />
      <RenderShades colors={tints} setColor={copy} label="Tints" />
      <RenderShades colors={hues} setColor={copy} label="Hues" />
      <RenderShades colors={temperatures} setColor={copy} label="Temps" />

      <Group gap={10} style={{ marginBottom: 14 }}>
        <Text
          onClick={toggleHarmonies}
          style={{ cursor: "pointer" }}
          fw="lighter"
          c="dimmed"
          size="sm"
        >
          Harmonies
        </Text>
      </Group>
      <Collapse in={config.harmoniesOpen} style={{ width: "95%" }}>
        <Stack>
          {Object.keys(harmonies).map((key) => (
            <RenderShades
              colors={harmonies[key as keyof typeof harmonies]}
              setColor={copy}
              label={key}
            />
          ))}
        </Stack>
      </Collapse>

      <Group gap={10} grow style={{ marginBottom: 14, width: "100%" }}>
        <Stack align="center">
          <Box
            style={{
              background: color,
              borderRadius: 5,
              width: "400px",
              height: "30%",
              minHeight: "100px",
            }}
          >
            {color}
          </Box>

          <Switch
            checked={colorScheme === "dark"}
            id="theme"
            onLabel={<BsSun size={15} />}
            offLabel={<BsMoon size={15} />}
            size={"lg"}
            onChange={() => toggleColorScheme()}
          />
          <Text fw="lighter" c="dimmed" size="sm">
            History
          </Text>

          <Box className={classes.gridContainer}>
            {history.map((color, i) => (
              <Tooltip label={`Copy ${color}`} key={i}>
                <Box
                  className={classes.gridItem}
                  onClick={() => {
                    clipboard.writeText(
                      color.startsWith("#") ? color : `#${color}`
                    );
                  }}
                  style={{
                    backgroundColor: color,
                  }}
                ></Box>
              </Tooltip>
            ))}
          </Box>
        </Stack>

        <Group style={{ width: "100%" }}>
          <ContrastContent color={color} background={"#ffffff"} />
          <ContrastContent color={color} background={"#000000"} />
        </Group>
      </Group>
    </Stack>
  );
};

export const ContrastContent = ({
  color,
  background = "#000000",
  toggle,
}: {
  toggle?: () => void;
  background: string;
  color: string;
}) => {
  const contrast = checkContrast(color, background);
  const result = meetsMinimumRequirements(contrast);

  return (
    <div className={classes.wcagBox}>
      <Text size={"xl"}>WCAG contrast</Text>
      <div style={{ display: "flex", width: "100%" }}>
        <span
          onClick={() => (toggle ? toggle() : null)}
          className={`${classes.box} ${background === "#ffffff" ? "dark" : "light"}`}
          style={{ color: color, background }}
        >
          Aa
        </span>
        <Text size={"xl"}>{formatRatio(contrast)}</Text>
      </div>
      <div className={classes.grid}>
        {result.map(({ level, label, pass }) => (
          <Fragment key={level}>
            <div className="flex flex-col items-start justify-center">
              {label}
            </div>
            <div className={pass ? classes.ok : classes.fail}>{level}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Colors;
