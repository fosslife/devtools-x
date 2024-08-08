import { Box, Group, Text } from "@mantine/core";

import { canBeWhite } from "./contrast";

import classes from "./styles.module.css";

export const RenderShades = ({
  colors,
  setColor,
  label,
}: {
  colors: string[];
  setColor: (color: string) => void;
  label: string;
}) => (
  <Group justify="space-between" align="center" w="95%" h="50px">
    <Text
      fw="lighter"
      size="sm"
      style={{
        width: "10%",
      }}
    >
      {label}
    </Text>
    {colors.map((color, i) => (
      <Box
        key={i}
        onClick={() => {
          setColor(color);
        }}
        className={classes.colorBox}
        style={{
          backgroundColor: color,
          color: canBeWhite(color) ? "white" : "black",
        }}
      >
        {color.toUpperCase()}
      </Box>
    ))}
  </Group>
);
