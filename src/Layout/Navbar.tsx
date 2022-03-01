import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSortNumericUpAlt } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { MdAnchor, MdColorize, MdOutlineHome } from "react-icons/md";
import { SiJsonwebtokens, SiPostgresql } from "react-icons/si";
import { VscRegex } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";

import { Card } from "../Components/Card";

export const Navbar = () => {
  const location = useLocation();
  console.log(location.pathname);
  const bg = useColorModeValue("gray.100", "gray.700");
  const data = [
    { id: 1, to: "/json-formatter", icon: MdAnchor, text: "Json Formatter" },
    { id: 2, to: "/hash", icon: FiHash, text: "Hashing tools" },
    { id: 3, to: "/random", icon: FaRandom, text: "Random Text" },
    { id: 4, to: "/jwt", icon: SiJsonwebtokens, text: "JWT decoder" },
    { id: 5, to: "/nums", icon: BsSortNumericUpAlt, text: "Num Converters" },
    { id: 6, to: "/sql", icon: SiPostgresql, text: "SQL formatter" },
    { id: 7, to: "/colors", icon: MdColorize, text: "Color Utils" },
    // { id: 8, to: "/regex", icon: VscRegex, text: "Regex Tester" },
  ];
  return (
    <Flex
      h="full"
      bg={bg}
      shadow={"inner"}
      p="3"
      flexDirection={"column"}
      overflow={"scroll"}
      pos={"relative"}
      minW="52"
    >
      <Input pos={"sticky"} placeholder="Search..." size={"sm"} />
      <Box mt="2">
        <Link to={"/"}>
          <HStack p="1" pl="1.5">
            <Icon as={MdOutlineHome}></Icon>
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
              <Icon as={e.icon}></Icon>
              <Text>{e.text}</Text>
            </HStack>
          </Link>
        </Box>
      ))}
    </Flex>
  );
};
