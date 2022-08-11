import { Box, Checkbox, useMantineColorScheme } from "@mantine/core";

export const Settings = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Box>
      <Checkbox
        label="Dark Theme"
        checked={colorScheme === "dark"}
        onChange={() => toggleColorScheme()}
      />
    </Box>
  );
};
