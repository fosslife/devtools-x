import { Box, Flex, Heading, Input } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export const Navbar = () => {
  return (
    // TODO: should remove fixex width?
    <Flex h="full" w="56" bg="gray.700" shadow={"inner"} p="3">
      <Input placeholder="Search..." size={"sm"} />
    </Flex>
  );
};
