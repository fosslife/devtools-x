import { Flex, Group, Slider, Stack, Switch, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import CustomPicker from "./CustomPicker";
import { clipboard } from "@tauri-apps/api";
import { RenderShades } from "./RenderShades";
import { notifications } from "@mantine/notifications";
import { useColorState, useContainerSize } from "@/hooks";
import { Convert } from "@/utils/colors";
import { ColorWheel } from "./Wheels";
import { EditableColorOutput } from "@/Features/colors/ColorEditableOutput";
import {
  getPaletteHarmonies,
  getWheelDotLocation,
  getWheelGradient,
  getWheelSetups,
} from "@/utils/color";
import type { ColorHarmony, Hsl } from "@/types/colors";

const conv = new Convert();

const ColorHarmonies = () => {
  const [color, setColor, conversions] = useColorState();
  const hsl = new Convert().hex2hsl(color);

  // Lightness for wheels
  const lightness = hsl[2];
  const backgroundStyle = useMemo(
    () => getWheelGradient(lightness),
    [lightness]
  );

  // Mode switch
  const [mode, setMode] = useState<"wheels" | "palettes">("wheels");
  const toggleMode = () => {
    // Todo: for now a simple toggle.
    // Will be expanding this with, eg, export modes, color info and tests
    setMode((prev) => (prev === "wheels" ? "palettes" : "wheels"));
  };

  // Palette harmonies
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);

  useEffect(() => {
    if (mode !== "palettes") return;
    setHarmonies(getPaletteHarmonies(color));
  }, [color, mode]);

  // Wheel modes
  const wheels = useMemo(
    () =>
      mode === "wheels"
        ? getWheelSetups.map(({ func, key }) => {
            const shades = func({
              sourceColor: hsl,
              config: { angle: 30 },
            }) as Hsl[];

            return {
              shades,
              dots: shades.map(getWheelDotLocation),
              label: key,
            };
          })
        : [],
    [color, mode]
  );

  const copy = async (color: string) => {
    await clipboard.writeText(color.startsWith("#") ? color : `#${color}`);
    notifications.show({
      message: `Copied ${color} to clipboard`,
      color: "blue",
      autoClose: 1000,
    });
  };

  // Todo - when making the window smaller, the updates should be instant
  const { ref, width } = useContainerSize();

  const rendered = useRef(0);
  return (
    <Stack
      align="center"
      style={{
        height: "100%",
        width: "100%",
        overflowY: "scroll",
      }}
    >
      <Group align="center">
        <br />
        <Switch
          label="Harmonies"
          checked={mode === "palettes"}
          onChange={toggleMode}
        />
        {mode === "wheels" && (
          <Slider
            style={{ width: 200 }}
            value={lightness}
            thumbSize={2}
            showLabelOnHover={false}
            onChangeEnd={(value) =>
              setColor(conv.hsl2hex([hsl[0], hsl[1], value]))
            }
            min={10}
            max={95}
          />
        )}
      </Group>
      <Stack style={{ width: "100%" }}>
        {mode === "palettes" ? (
          <CustomPicker
            hexCode={color.startsWith("#") ? color.slice(1) : color}
            onChange={(newColor) => setColor(newColor.hex)}
          />
        ) : (
          <Flex
            style={{
              // marginBottom: 14,
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
            }}
            ref={ref}
          >
            {wheels.map((w, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <ColorWheel
                  lightness={lightness}
                  updateColor={setColor}
                  colors={w.dots}
                  size={width / wheels?.length - 20}
                  style={{
                    background: backgroundStyle,
                    margin: 10,
                  }}
                />
                <Text
                  style={{
                    cursor: "pointer",
                    overflow: "hidden",
                    maxWidth: width / (wheels?.length + 1),
                    textOverflow: "ellipsis",
                  }}
                  fw="lighter"
                  c="dimmed"
                  size="sm"
                >
                  {w.label}
                </Text>
              </div>
            ))}
          </Flex>
        )}
        <EditableColorOutput conversions={conversions} />
      </Stack>

      {mode === "palettes"
        ? harmonies.map(({ key, colors }) => (
            <RenderShades
              key={key}
              colors={colors}
              setColor={copy}
              label={key}
            />
          ))
        : wheels.map((key, i) => (
            <RenderShades
              key={key.label}
              colors={key.shades.map(
                (color: any) => conv.values("hsl", color).renderValue
              )}
              setColor={copy}
              label={key.label}
            />
          ))}
    </Stack>
  );
};

export default ColorHarmonies;
