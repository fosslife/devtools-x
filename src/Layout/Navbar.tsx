import { Box, Flex, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { BsSortNumericUpAlt } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { MdAnchor, MdColorize, MdOutlineHome } from "react-icons/md";
import { SiJsonwebtokens, SiPostgresql } from "react-icons/si";
import { VscDiff, VscRegex } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  const data = [
    { id: 1, to: "/json-formatter", icon: MdAnchor, text: "Json Tools" },
    { id: 2, to: "/hash", icon: FiHash, text: "Hashing Tools" },
    { id: 3, to: "/random", icon: FaRandom, text: "Random Text" },
    { id: 4, to: "/jwt", icon: SiJsonwebtokens, text: "JWT Tools" },
    { id: 5, to: "/nums", icon: BsSortNumericUpAlt, text: "Num Converters" },
    { id: 6, to: "/sql", icon: SiPostgresql, text: "SQL Formatter" },
    { id: 7, to: "/colors", icon: MdColorize, text: "Color Utils" },
    { id: 8, to: "/regex", icon: VscRegex, text: "Regex Tester" },
    { id: 9, to: "/text", icon: VscDiff, text: "Diff Tools" },
  ];
  return (
    <Flex
      h="full"
      bg={"gray.800"}
      shadow={"inner"}
      p="3"
      flexDirection={"column"}
      overflow={"scroll"}
      pos={"relative"}
      minW="52"
      borderRight={"thin solid tomato"}
      fontSize={14}
    >
      <Input pos={"sticky"} placeholder="Search..." size={"sm"} />
      <Box mt="2">
        <Link to={"/"}>
          <HStack p="1" pl="1.5">
            <Icon as={MdOutlineHome} w={4} h={4}></Icon>
            <Text>{"Home"}</Text>
          </HStack>
        </Link>
      </Box>
      <Box borderBottom={"1px solid tomato"}> </Box>
      {data.map((e) => (
        <Box
          key={e.id}
          mt="2"
          w="full"
          bg={location.pathname === e.to ? "red.500" : ""}
          borderRadius={4}
          shadow={location.pathname === e.to ? "md" : ""}
        >
          <Link to={e.to}>
            <HStack p="1" pl="1.5">
              <Icon as={e.icon} w={4} h={4}></Icon>
              <Text>{e.text}</Text>
            </HStack>
          </Link>
        </Box>
      ))}
    </Flex>
  );
};
