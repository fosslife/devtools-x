import { Text } from "@mantine/core";

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
  <div
    className={classes.shades__container}
    style={{
      height: "50px",
    }}
  >
    <Text
      fw="lighter"
      size="sm"
      style={{
        width: "10%",
        maxWidth: "10%",
        minWidth: "10%",
        paddingRight: "5px",
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </Text>
    <div
      className={classes.shades__container}
      style={{
        height: "50px",
      }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          onClick={() => {
            setColor(color);
          }}
          className={classes.shades__box}
          style={{
            backgroundColor: color,
            color: canBeWhite(color) ? "white" : "black",
          }}
        >
          <span>{color.toUpperCase()}</span>
        </div>
      ))}
    </div>
  </div>
);
