import classes from "./styles.module.css";

import { Box, Text } from "@mantine/core";

import { canBeWhite } from "./contrast";

export const RenderShades = ({
  colors,
  setColor,
  label,
}: {
  colors: string[];
  setColor: (color: string) => void;
  label: string;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignContent: "center",
      width: "95%",
      height: "50px",
    }}
  >
    <Text
      fw="lighter"
      c="dimmed"
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
        style={{
          backgroundColor: color,
          color: canBeWhite(color) ? "white" : "black",
          fontSize: "0.7em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "10%",
          height: "100%",
        }}
      >
        {color.toUpperCase()}
      </Box>
    ))}
  </div>
);
