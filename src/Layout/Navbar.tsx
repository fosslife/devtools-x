import { Box, Flex, Heading } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export const Navbar = () => {
  return (
    <Flex
      w="full"
      shadow={"md"}
      height={"12"}
      justify={"space-between"}
      align={"center"}
      px="4"
    >
      <HamburgerIcon />
      <Box>
        <Heading fontSize={"lg"}>:wq</Heading>
      </Box>
    </Flex>
  );
};
