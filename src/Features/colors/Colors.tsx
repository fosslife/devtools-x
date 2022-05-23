import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import { clipboard } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { convertBase } from "simple-base-converter";

const Colors = () => {
  const { toggleColorMode, setColorMode } = useColorMode();
  const [color, setColor] = useState<RgbaColor>({
    r: 34,
    g: 135,
    b: 199,
    a: 0.5,
  });

  useEffect(() => {
    return () => {
      // reset mode to dark before switching panels
      setColorMode("dark");
    };
  }, []);

  const convertRgbTohex = (color: RgbaColor) => {
    const rH = convertBase(color.r, 10, 16).padStart(2, "0");
    const gH = convertBase(color.g, 10, 16).padStart(2, "0");
    const bH = convertBase(color.b, 10, 16).padStart(2, "0");
    const aH = convertBase(Math.round(color.a * 255), 10, 16).padStart(2, "0");
    return `#${rH}${gH}${bH}${aH}`;
  };
  return (
    <Flex
      flexDir={"column"}
      gap={5}
      sx={{
        "& .react-colorful ": {
          width: "60vw",
          height: "40vh",
          marginTop: 2,
        },
      }}
    >
      <Heading>Color Picker</Heading>
      <RgbaColorPicker
        color={color}
        onChange={(e) => {
          setColor(e);
        }}
      />
      <Flex gap={3}>
        <FormControl>
          <FormLabel htmlFor="input">RGB:</FormLabel>
          <InputGroup>
            <Input
              value={`${color.r}, ${color.g}, ${color.b}, ${color.a}`}
              onChange={() => {
                // TODO: parse all rgb formats and set color.
                // setColor()
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                size="sm"
                onClick={() => {
                  clipboard.writeText(
                    `${color.r}, ${color.g}, ${color.b}, ${color.a}`
                  );
                }}
              >
                Copy
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="input">HEX:</FormLabel>
          <InputGroup>
            <Input
              value={convertRgbTohex(color)}
              onChange={() => {
                // TODO: parse all hex, convert to Rgb and set color.
                // setColor()
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                size="sm"
                onClick={() => {
                  clipboard.writeText(convertRgbTohex(color));
                }}
              >
                Copy
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Flex>
      <Box
        w="full"
        h="120px"
        background={`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}
        borderRadius={5}
        shadow="xl"
      ></Box>

      {/* FIXME: Enable when themes are working */}
      <Flex gap={3} display="none">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="theme" mb="0">
            Toggle theme
          </FormLabel>
          <Switch id="theme" onChange={toggleColorMode} />
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default Colors;

// TODO: more features
// TODO: save prev color and compare
