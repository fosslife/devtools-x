import { Box, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { BsSortNumericUpAlt } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { MdAnchor } from "react-icons/md";
import { SiJsonwebtokens } from "react-icons/si";

import { Card } from "../Components/Card";

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
      minW="52"
    >
      <Input pos={"sticky"} placeholder="Search..." size={"sm"} />
      <Box borderBottom={"1px solid tomato"} p="1.5">
        {" "}
      </Box>
      <Box mt="1.5">
        <Card linkto="/json-formatter">
          <Icon as={MdAnchor}></Icon>
          <Text>Json Tools</Text>
        </Card>
      </Box>

      <Box mt="1.5">
        <Card linkto="/hash">
          <Icon as={FiHash}></Icon>
          <Text>Hashing tools</Text>
        </Card>
      </Box>

      <Box mt="1.5">
        <Card linkto="/random">
          <Icon as={FaRandom}></Icon>
          <Text>Random Text</Text>
        </Card>
      </Box>

      <Box mt="1.5">
        <Card linkto="/jwt">
          <Icon as={SiJsonwebtokens}></Icon>
          <Text>JWT tools</Text>
        </Card>
      </Box>

      <Box mt="1.5">
        <Card linkto="/nums">
          <Icon as={BsSortNumericUpAlt}></Icon>
          <Text>Num Converters</Text>
        </Card>
      </Box>

      <Box mt="1.5">
        <Card linkto="/sql">
          <Icon as={BsSortNumericUpAlt}></Icon>
          <Text>SQL formatter</Text>
        </Card>
      </Box>
    </Flex>
  );
};
