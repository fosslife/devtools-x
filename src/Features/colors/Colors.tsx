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
import cc from "color-convert";
import { useState } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { BsMoon, BsSun } from "react-icons/bs";

import { OutputBox } from "../../Components/OutputBox";
import { clipboard } from "@tauri-apps/api";

const Colors = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // maintain 20 history Colors
  const [history, setHistory] = useState<RgbaColor[]>(
    Array(20).fill({
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    }) as RgbaColor[]
  );

  const [color, setColor] = useState<RgbaColor>({
    r: 34,
    g: 135,
    b: 199,
    a: 0.5,
  });

  const onCopy = () => {
    // fill one color in history
    setHistory((prev) => {
      let newHistory = [...prev];
      newHistory.pop();
      newHistory.unshift(color);
      return newHistory;
    });
  };

  return (
    <Stack align="center" style={{ height: "100%", width: "100%" }}>
      <RgbaColorPicker
        style={{
          width: "95%",
          height: "40vh",
          marginTop: "5px",
          border: "2px solid #3a39399d",
          borderRadius: "10px",
        }}
        color={color}
        onChange={(e) => {
          setColor(e);
        }}
      />
      <Group gap={10} grow>
        <OutputBox
          label="RGB:"
          value={`${color.r}, ${color.g}, ${color.b}, ${color.a}`}
          onCopy={onCopy}
        />
        <OutputBox
          label="HEX:"
          value={"#" + cc.rgb.hex([color.r, color.g, color.b])}
          onCopy={onCopy}
        />
        <OutputBox
          label="CMYK:"
          value={cc.rgb.cmyk([color.r, color.g, color.b]).join(", ")}
          onCopy={onCopy}
        />
        <OutputBox
          label="HSL:"
          value={`${cc.rgb.hsl([color.r, color.g, color.b])[0]}, ${
            cc.rgb.hsl([color.r, color.g, color.b])[1]
          }%, ${cc.rgb.hsl([color.r, color.g, color.b])[2]}%`}
          onCopy={onCopy}
        />
      </Group>
      <Box
        style={{
          background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          borderRadius: 5,
          width: "400px",
          height: "30%",
        }}
      ></Box>

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
        {history.map((color) => (
          <>
            <Tooltip
              label={`Copy rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}
            >
              <Box
                className={classes.gridItem}
                onClick={() => {
                  clipboard.writeText(
                    `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
                  );
                }}
                style={{
                  backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                }}
              ></Box>
            </Tooltip>
          </>
        ))}
      </Box>
    </Stack>
  );
};

export default Colors;
