import {
  ColorPicker,
  ColorSwatch,
  Group,
  isLightColor,
  Stack,
  Text,
} from "@mantine/core";
import { generateColorsMap } from "./generator";
import { useState } from "react";
import classes from "./colorgenerator.module.css";

export default function ColorGenerator() {
  const [selectedColor, setSelectedColor] = useState("#FF007F");

  const { baseColorIndex, colors } = generateColorsMap(selectedColor);
  return (
    <Stack>
      <ColorPicker
        w="100%"
        value={selectedColor}
        style={{ border: "1px solid #ccc" }}
        onChange={(e) => setSelectedColor(e)}
      />
      <Text
        w="fit-content"
        p="5px"
        c={selectedColor}
        bg={isLightColor(selectedColor) ? "dark" : "white"}
      >
        {" "}
        Selected color: {selectedColor}
      </Text>
      <Group grow gap={0}>
        {colors?.map((color, index) => (
          <div key={index} className={classes.item}>
            <ColorSwatch
              color={color.hex()}
              radius={0}
              className={classes.swatch}
              withShadow={false}
              data-base={index === baseColorIndex || undefined}
              c={isLightColor(color.hex()) ? "black" : "white"}
            >
              {
                <div className={classes.label}>
                  <span className={classes.index}>{index}</span>
                  <span className={classes.hex}>{color.hex()}</span>
                </div>
              }
            </ColorSwatch>
          </div>
        ))}
      </Group>
      <Text c="dimmed">
        Inspired from: https://mantine.dev/colors-generator
      </Text>
    </Stack>
  );
}
