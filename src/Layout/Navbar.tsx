import { Box, Flex, Icon, Text, Input } from "@chakra-ui/react";
import { Card } from "../Components/Card";
import { MdAnchor } from "react-icons/md";

export const Navbar = () => {
  return (
    <Flex
      h="full"
      bg="gray.700"
      shadow={"inner"}
      p="3"
      flexDirection={"column"}
      overflow={"scroll"}
      pos={"relative"}
    >
      <Input pos={"sticky"} placeholder="Search..." size={"sm"} />
      <Box borderBottom={"1px solid tomato"} p="1.5">
        {" "}
      </Box>
      <Box mt="1.5">
        <Card linkto="/json-formatter">
          <Icon as={MdAnchor}></Icon>
          <Text>Json formatter</Text>
        </Card>
      </Box>
    </Flex>
  );
};
