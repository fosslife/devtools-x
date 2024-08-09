import classes from "./styles.module.css";

import {
  Box,
  Group,
  Stack,
  Switch,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import CustomPicker from "./CustomPicker";
import { BsMoon, BsSun } from "react-icons/bs";

import { OutputBox } from "@/Components/OutputBox";
import { clipboard } from "@tauri-apps/api";
import {
  Convert,
  getInterpolateShades,
  hex2cmyk,
  interpolateColor,
  renderCmyk,
  renderHsl,
} from "./utilities";

import { RenderShades } from "./RenderShades";
import { useColorRandomizer } from "./hooks";

const Colors = () => {
  const [color, setColor] = useColorRandomizer();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [config] = useState({
    steps: 15,
    harmoniesOpen: false,
  });
  const [history, setHistory] = useState<string[]>(Array(20).fill("#000000"));

  const onCopy = () => {
    // fill one color in history
    setHistory((prev) => {
      let newHistory = [...prev];
      newHistory.pop();
      newHistory.unshift(color);
      return newHistory;
    });
  };

  const copy = async (color: string) => {
    await clipboard.writeText(color.startsWith("#") ? color : `#${color}`);
    setHistory((prev) => {
      let newHistory = [...prev];
      newHistory.pop();
      newHistory.unshift(color);
      return newHistory;
    });
  };

  const [l, c, h] = new Convert().hex2lch(color);

  // Generate shades, tints, tones, hues, and temperatures
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

      <Stack align="center" style={{ width: "95%" }}>
        <RenderShades colors={shades} setColor={copy} label="Shades" />
        <RenderShades colors={tones} setColor={copy} label="Tones" />
        <RenderShades colors={tints} setColor={copy} label="Tints" />
        <RenderShades colors={hues} setColor={copy} label="Hues" />
        <RenderShades colors={temperatures} setColor={copy} label="Temps" />
      </Stack>

      <Stack align="center">
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
                onClick={async () => {
                  await clipboard.writeText(
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
    </Stack>
  );
};

export default Colors;
