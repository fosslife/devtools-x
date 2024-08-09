import { Group, Stack, Text } from "@mantine/core";
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
        <Text style={{ cursor: "pointer" }} fw="lighter" c="dimmed" size="sm">
          Harmonies
        </Text>
      </Group>

      {Object.keys(harmonies).map((key) => (
        <RenderShades
          key={key}
          colors={harmonies[key as keyof typeof harmonies]}
          setColor={copy}
          label={key}
        />
      ))}
    </Stack>
  );
};

export default ColorHarmonies;
