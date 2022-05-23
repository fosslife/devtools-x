import { Box, Flex, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { ChangeEvent, useContext, useState } from "react";
import { BsSortNumericUpAlt } from "react-icons/bs";
import {
  FaCode,
  FaExchangeAlt,
  FaFileImage,
  FaMarkdown,
  FaPaste,
  FaRandom,
  FaYinYang,
} from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { MdAnchor, MdColorize, MdOutlineHome } from "react-icons/md";
import { SiJsonwebtokens, SiPostgresql } from "react-icons/si";
import { VscDiff, VscPin, VscPinned, VscRegex } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { db } from "../utils";

export const data = [
  { id: 1, to: "/json-formatter", icon: MdAnchor, text: "Json Tools" },
  { id: 2, to: "/hash", icon: FiHash, text: "Hashing Tools" },
  { id: 3, to: "/random", icon: FaRandom, text: "Random Text" },
  { id: 4, to: "/jwt", icon: SiJsonwebtokens, text: "JWT Tools" },
  { id: 5, to: "/nums", icon: BsSortNumericUpAlt, text: "Num Converters" },
  { id: 6, to: "/sql", icon: SiPostgresql, text: "SQL Formatter" },
  { id: 7, to: "/colors", icon: MdColorize, text: "Color Utils" },
  { id: 8, to: "/regex", icon: VscRegex, text: "Regex Tester" },
  { id: 9, to: "/text", icon: VscDiff, text: "Diff Tools" },
  { id: 10, to: "/markdown", icon: FaMarkdown, text: "Markdown" },
  { id: 11, to: "/yamljson", icon: FaYinYang, text: "Yaml JSON" },
  { id: 12, to: "/pastebin", icon: FaPaste, text: "Pastebin" },
  { id: 13, to: "/repl", icon: FaCode, text: "ScratchPad" },
  { id: 14, to: "/image", icon: FaFileImage, text: "Image Tools" },
  { id: 15, to: "/units", icon: FaExchangeAlt, text: "Unit Converters" },
];

export const Navbar = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState(data);
  const [showIcon, setShowIcon] = useState(-99);
  const { handleState } = useContext(AppContext);

  const filterItems = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setNavItems(
        data.filter((i) =>
          i.text.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setNavItems([...data]);
    }
  };

  return (
    <Flex
      h="full"
      bg={"gray.800"}
      shadow={"inner"}
      p="3"
      flexDirection={"column"}
      overflow={"scroll"}
      pos={"relative"}
      minW="48"
      borderRight={"thin solid tomato"}
      fontSize={14}
    >
      <Input
        pos={"sticky"}
        placeholder="Search..."
        size={"sm"}
        onChange={filterItems}
      />
      <Box mt="2">
        <Link to={"/"}>
          <HStack p="1" pl="1.5">
            <Icon as={MdOutlineHome} w={4} h={4}></Icon>
            <Text>{"Home"}</Text>
          </HStack>
        </Link>
      </Box>
      <Box borderBottom={"1px solid tomato"}> </Box>
      {navItems.map((e) => {
        const pinExists = db.data.pinned.includes(e.id);

        return (
          <Box
            key={e.id}
            mt="2"
            w="full"
            position={"relative"}
            bg={location.pathname === e.to ? "red.500" : ""}
            borderRadius={4}
            shadow={location.pathname === e.to ? "md" : ""}
            onMouseMove={() => {
              setShowIcon(e.id);
            }}
            onMouseLeave={() => setShowIcon(-99)}
          >
            <Link to={e.to}>
              <HStack p="1" pl="1.5">
                <Icon as={e.icon} w={4} h={4}></Icon>
                <Text>{e.text}</Text>
              </HStack>
            </Link>
            {e.id === showIcon || pinExists ? (
              <Icon
                pos={"absolute"}
                right={"1"}
                top="1"
                as={pinExists ? VscPinned : VscPin}
                w={5}
                h={5}
                onClick={() => {
                  const { pinned } = db.data;
                  if (pinned.includes(e.id)) {
                    db.data.pinned = pinned.filter((i: number) => i !== e.id);
                  } else {
                    db.data.pinned = [...db.data.pinned, e.id];
                  }
                  db.write();
                  handleState(db.data.pinned);
                }}
              ></Icon>
            ) : null}
          </Box>
        );
      })}
    </Flex>
  );
};
