import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const Card = {
  // The styles all Cards have in common
  baseStyle: {
    padding: "20px",
    minH: "70px",
    display: "flex",
    background: "gray.600",
    alignItems: "center",
    gap: 3,
  },
  // Two variants: rounded and smooth
  variants: {
    smooth: {
      padding: 4,
      borderRadius: "sm",
      boxShadow: "md",
    },
  },
  // The default variant value
  defaultProps: {
    variant: "smooth",
  },
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  components: {
    Card,
  },
});

export default theme;
