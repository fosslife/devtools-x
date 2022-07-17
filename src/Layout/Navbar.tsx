import {
  ActionIcon,
  Box,
  createStyles,
  Divider,
  Group,
  Stack,
  TextInput,
  Text,
} from "@mantine/core";
import { ChangeEvent, useContext, useState } from "react";
import { BsSortNumericUpAlt } from "react-icons/bs";
import {
  FaCode,
  FaExchangeAlt,
  FaFileImage,
  FaMarkdown,
  FaPaste,
  FaRandom,
  FaReact,
  FaYinYang,
} from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { MdAnchor, MdColorize, MdHttp, MdOutlineHome } from "react-icons/md";
import { SiJsonwebtokens, SiPostgresql } from "react-icons/si";
import { VscDiff, VscPin, VscPinned, VscRegex } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { db } from "../utils";

const useStyles = createStyles((theme) => ({
  navbar: {
    height: "100%",
    width: "100%",
    padding: "10px",
    // FIXME: HACKS!!!
    marginTop: -10,
    marginLeft: -4,
    overflow: "scroll",
    borderRight: "thin solid white",
    fontSize: "15px",
    lineHeight: "14px",
    background: theme.colors.dark[7],
  },
  navIcon: {},
}));

export const data = [
  { id: 1, to: "/json-formatter", icon: <MdAnchor />, text: "Json Tools" },
  { id: 2, to: "/hash", icon: <FiHash />, text: "Hashing Tools" },
  { id: 3, to: "/random", icon: <FaRandom />, text: "Random Text" },
  { id: 4, to: "/jwt", icon: <SiJsonwebtokens />, text: "JWT Tools" },
  { id: 5, to: "/nums", icon: <BsSortNumericUpAlt />, text: "Num Converters" },
  { id: 6, to: "/sql", icon: <SiPostgresql />, text: "SQL Formatter" },
  { id: 7, to: "/colors", icon: <MdColorize />, text: "Color Utils" },
  { id: 8, to: "/regex", icon: <VscRegex />, text: "Regex Tester" },
  { id: 9, to: "/text", icon: <VscDiff />, text: "Diff Tools" },
  { id: 10, to: "/markdown", icon: <FaMarkdown />, text: "Markdown" },
  { id: 11, to: "/yamljson", icon: <FaYinYang />, text: "Yaml JSON" },
  { id: 12, to: "/pastebin", icon: <FaPaste />, text: "Pastebin" },
  { id: 13, to: "/repl", icon: <FaCode />, text: "ScratchPad" },
  { id: 14, to: "/image", icon: <FaFileImage />, text: "Image Tools" },
  { id: 15, to: "/units", icon: <FaExchangeAlt />, text: "Unit Converters" },
  { id: 16, to: "/playground", icon: <FaReact />, text: "React Playground" },
  { id: 17, to: "/rest", icon: <MdHttp />, text: "REST API" },
];

export const Navbar = () => {
  const { classes } = useStyles();
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
    <Stack className={classes.navbar}>
      <TextInput
        id="search"
        placeholder="Search..."
        size={"xs"}
        onChange={filterItems}
        sx={() => ({
          width: "95%",
          alignSelf: "center",
          marginTop: "15px",
        })}
      />
      <Group
        mt="2"
        pl="10px"
        sx={() => ({
          color: "white",
        })}
      >
        <MdOutlineHome size={"20px"} />
        <Text component={Link} to="/">
          {"Home"}
        </Text>
      </Group>
      <Divider />
      {navItems.map((e) => {
        const pinExists = db.data.pinned.includes(e.id);

        return (
          <Group
            grow
            spacing={"xs"}
            key={e.id}
            sx={(t) => ({
              background: location.pathname === e.to ? t.colors.red[7] : "",
              color: "white",
              padding: 4,
              paddingLeft: 15,
              borderRadius: 4,
              boxShadow:
                location.pathname === e.to
                  ? "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                  : "none",
            })}
            onMouseMove={() => {
              setShowIcon(e.id);
            }}
            onMouseLeave={() => setShowIcon(-99)}
          >
            <Group mt="2">
              {e.icon}
              <Text component={Link} to={e.to}>
                {e.text}
              </Text>
              {e.id === showIcon || pinExists ? (
                <ActionIcon
                  size={"sm"}
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
                >
                  {pinExists ? (
                    <VscPinned size="15px" />
                  ) : (
                    <VscPin size="15px" />
                  )}
                </ActionIcon>
              ) : null}
            </Group>
          </Group>
        );
      })}
    </Stack>
  );
};
