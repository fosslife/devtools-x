import { Group, Stack, Switch, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import CustomPicker from "./CustomPicker";
import { clipboard } from "@tauri-apps/api";

import {
  analogous,
  complementary,
  compound,
  doubleSplitComplementary,
  monochromatic,
  splitComplementary,
  square,
  triadic,
} from "./harmonies";
import { RenderShades } from "./RenderShades";
import { notifications } from "@mantine/notifications";
import { useColorRandomizer } from "./hooks";
import { wheels } from "./constants/color-data";
import { Convert } from "./utilities";
import { ColorWheel, getDot } from "./constants/Wheels";

const ColorHarmonies = () => {
  const [color, setColor] = useColorRandomizer();

  const copy = async (color: string) => {
    await clipboard.writeText(color.startsWith("#") ? color : `#${color}`);
    notifications.show({
      message: `Copied ${color} to clipboard`,
      color: "blue",
      autoClose: 1000,
    });
  };

  const [harmonies, setHarmonies] = useState({});

  const [variations, setVariations] = useState(false);

  useEffect(() => {
    setHarmonies({
      analogous: analogous(color),
      monochromatic: monochromatic(color),
      triadic: triadic(color),
      complementary: complementary(color),
      splitComplementary: splitComplementary(color),
      doubleSplitComplementary: doubleSplitComplementary(color),
      square: square(color),
      compound: compound(color),
    });
  }, [color]);

  const [h, s, l] = new Convert().hex2hsl(color);
  // const h = 186,
  //   s = 100,
  //   l = 50;

  const _wheels = Object.keys(wheels).map((key) => {
    return {
      shades: (wheels as any)[key]({
        sourceColor: { h, s, l },
        config: { angle: 30 },
      }),
      label: key,
    };
  });

  const [lightness, setLightness] = useState(50);

  const wheeels = _wheels.map((w) => ({
    dots: w.shades.map((c: any) => getDot(c.h, c.s, c.l)),
    name: w.label,
  }));

  return (
    <Stack
      align="center"
      style={{ height: "100%", width: "100%", overflowY: "scroll" }}
    >
      <CustomPicker
        hexCode={color.startsWith("#") ? color.slice(1) : color}
        onChange={(newColor) => setColor(newColor.hex)}
      />
      <Group gap={10} style={{ marginBottom: 14 }}>
        {wheeels.map((w, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <ColorWheel
              lightness={l}
              updateColor={({ hsl }) => setColor(new Convert().hsl2hex(hsl))}
              setLightness={setLightness}
              colors={w.dots}
              size={150}
            />
            <Text
              style={{ cursor: "pointer" }}
              fw="lighter"
              c="dimmed"
              size="sm"
            >
              {w.name}
            </Text>
          </div>
        ))}
      </Group>
      {/*<pre>{JSON.stringify(colors, null, 2)}</pre>*/}
      <Switch
        label="Variations"
        checked={variations}
        onChange={() => setVariations((prev) => !prev)}
      />
      <Group gap={10} style={{ marginBottom: 14 }}>
        <Text style={{ cursor: "pointer" }} fw="lighter" c="dimmed" size="sm">
          Harmonies
        </Text>
      </Group>
      {variations
        ? Object.keys(harmonies).map((key) => (
            <RenderShades
              key={key}
              colors={harmonies[key as keyof typeof harmonies]}
              setColor={copy}
              label={key.slice(0, 10)}
            />
          ))
        : _wheels.map((key, i) => (
            <RenderShades
              key={key.label}
              colors={key.shades.map((color: any) => {
                color.h = (color.h % 360).toFixed();
                color.s = color.s.toFixed();
                color.l = color.l.toFixed();

                return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
              })}
              setColor={copy}
              label={key.label.slice(0, 10)}
            />
          ))}
      {/*<pre>{JSON.stringify(_wheels, null, 2)}</pre>*/}
    </Stack>
  );
};

export default ColorHarmonies;
