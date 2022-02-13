import {
  Box,
  Flex,
  Icon,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSortNumericUpAlt } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { MdAnchor, MdColorize } from "react-icons/md";
import { SiJsonwebtokens, SiPostgresql } from "react-icons/si";
import { VscRegex } from "react-icons/vsc";

import { Card } from "../Components/Card";

export const Navbar = () => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const data = [
    { id: 1, to: "/json-formatter", icon: MdAnchor, text: "Json Tools" },
    { id: 2, to: "/hash", icon: FiHash, text: "Hashing tools" },
    { id: 3, to: "/random", icon: FaRandom, text: "Random Text" },
    { id: 4, to: "/jwt", icon: SiJsonwebtokens, text: "JWT decoder" },
    { id: 5, to: "/nums", icon: BsSortNumericUpAlt, text: "Num Converters" },
    { id: 6, to: "/sql", icon: SiPostgresql, text: "SQL formatter" },
    { id: 7, to: "/colors", icon: MdColorize, text: "Color Utils" },
    { id: 8, to: "/regex", icon: VscRegex, text: "Regex Tester" },
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
      <Box borderBottom={"1px solid tomato"} p="1.5">
        {" "}
      </Box>
      {data.map((e) => (
        <Box key={e.id} mt="1.5">
          <Card linkto={e.to}>
            <Icon as={e.icon}></Icon>
            <Text>{e.text}</Text>
          </Card>
        </Box>
      ))}
    </Flex>
  );
};
