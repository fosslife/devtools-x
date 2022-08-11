import { Box, Group, Stack } from "@mantine/core";
import cc from "color-convert";
import { useState } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";

import { OutputBox } from "../../Components/OutputBox";

const Colors = () => {
  const [color, setColor] = useState<RgbaColor>({
    r: 34,
    g: 135,
    b: 199,
    a: 0.5,
  });

  return (
    <Stack
      style={{ height: "100%", width: "100%" }}
      align="center"
      sx={{
        "& .react-colorful ": {
          width: "95%",
          height: "40vh",
          marginTop: 2,
          border: "2px solid #3a39399d",
          borderRadius: 10,
        },
      }}
    >
      <RgbaColorPicker
        color={color}
        onChange={(e) => {
          setColor(e);
        }}
      />
      <Group spacing={10}>
        <OutputBox
          label="RGB:"
          value={`${color.r}, ${color.g}, ${color.b}, ${color.a}`}
        />
        <OutputBox
          label="HEX:"
          value={"#" + cc.rgb.hex([color.r, color.g, color.b])}
        />
        <OutputBox
          label="CMYK:"
          value={cc.rgb.cmyk([color.r, color.g, color.b]).join(", ")}
        />
        <OutputBox
          label="HSL:"
          value={`${cc.rgb.hsl([color.r, color.g, color.b])[0]}, ${
            cc.rgb.hsl([color.r, color.g, color.b])[1]
          }%, ${cc.rgb.hsl([color.r, color.g, color.b])[2]}%`}
        />
      </Group>
      <Box
        sx={() => ({
          background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          borderRadius: 5,
          width: "400px",
          height: "30%",
        })}
      ></Box>

      {/* FIXME: Enable when themes are working */}
      {/* <Flex gap={3} display="none">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="theme" mb="0">
            Toggle theme
          </FormLabel>
          <Switch id="theme" onChange={toggleColorMode} />
        </FormControl>
      </Flex> */}
    </Stack>
  );
};

export default Colors;

// TODO: save prev color and compare. p1
// TODO: Color keywords? p2
