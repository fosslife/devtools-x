import {
  ActionIcon,
  Box,
  createStyles,
  Divider,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
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
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AppContext } from "../Contexts/AppContextProvider";
import { db } from "../utils";

const useStyles = createStyles((theme) => ({
  navbar: {
    height: "95%",
    padding: "10px",
    paddingTop: 0,
    overflow: "scroll",
    borderRight: "thin solid white",
    fontSize: "15px",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
  },
  topSection: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
  },
  row: {
    cursor: "pointer",
    padding: 4,
    paddingLeft: 5,
    borderRadius: 4,
    display: "flex",
    gap: 20,
    justifyContent: "space-between",
    ":hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.gray[8]
          : theme.colors.gray[6],
    },
  },
  listTitle: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    flexDirection: "row",
    textAlign: "center",
  },
  bottomSection: {
    width: "max-content",
  },
  item: {
    "&:hover": {
      backgroundColor: "red",
    },
  },
  active: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[8]
        : theme.colors.gray[6],
  },
}));

export const data = [
  { id: 1, to: "/json-formatter", icon: <MdAnchor />, text: "JSON Tools" },
  { id: 2, to: "/hash", icon: <FiHash />, text: "Hashing Tools" },
  { id: 3, to: "/random", icon: <FaRandom />, text: "Random Text" },
  { id: 4, to: "/jwt", icon: <SiJsonwebtokens />, text: "JWT Tools" },
  { id: 5, to: "/nums", icon: <BsSortNumericUpAlt />, text: "Number Tools" },
  { id: 6, to: "/sql", icon: <SiPostgresql />, text: "SQL Formatter" },
  { id: 7, to: "/colors", icon: <MdColorize />, text: "Color Utils" },
  {
    id: 8,
    to: "/regex",
    icon: <VscRegex />,
    text: "Regex Tester",
    extra: "Unstable feature",
  },
  { id: 9, to: "/text", icon: <VscDiff />, text: "Diff Tools" },
  { id: 10, to: "/markdown", icon: <FaMarkdown />, text: "Markdown" },
  { id: 11, to: "/yamljson", icon: <FaYinYang />, text: "Yaml JSON" },
  { id: 12, to: "/pastebin", icon: <FaPaste />, text: "Pastebin" },
  { id: 13, to: "/repl", icon: <FaCode />, text: "ScratchPad" },
  // { id: 14, to: "/image", icon: <FaFileImage />, text: "Image Tools" },
  { id: 15, to: "/units", icon: <FaExchangeAlt />, text: "Unit Converter" },
  { id: 16, to: "/playground", icon: <FaReact />, text: "React Pad" },
  { id: 17, to: "/rest", icon: <MdHttp />, text: "REST API" },
];

export const Navbar = () => {
  const { classes, cx } = useStyles();
  const location = useLocation();
  const nav = useNavigate();
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
      <Stack className={classes.topSection}>
        <TextInput
          id="search"
          placeholder="Search..."
          size={"xs"}
          onChange={filterItems}
          sx={() => ({
            width: "100%",
            alignSelf: "center",
            marginTop: "15px",
          })}
        />
        <Group
          mt="2"
          pl="10px"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[1]
                : theme.colors.dark[8],
          })}
        >
          <MdOutlineHome size={"20px"} />
          <Text
            variant={location.pathname === "/" ? "gradient" : "text"}
            component={Link}
            to="/"
            weight={location.pathname === "/" ? "bold" : "normal"}
          >
            {"Home"}
          </Text>
        </Group>
        <Divider />
      </Stack>
      {/* ====== One Title */}
      <Stack className={classes.bottomSection}>
        {navItems.map((e) => {
          const pinExists = db.data.pinned.includes(e.id);

          {
            /* ROW */
          }
          return (
            <Box
              key={e.id}
              className={cx(classes.row, {
                [classes.active]: location.pathname === e.to,
              })}
              onMouseMove={() => {
                setShowIcon(e.id);
              }}
              onMouseLeave={() => setShowIcon(-99)}
            >
              <Box className={classes.listTitle} onClick={() => nav(e.to)}>
                <Text
                  sx={(theme) => ({
                    color:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[1]
                        : theme.colors.dark[4],
                  })}
                >
                  {e.icon}
                </Text>

                {e.extra ? (
                  <Tooltip label={e.extra}>
                    <Text
                      size="xs"
                      weight={location.pathname === e.to ? "bold" : "normal"}
                      color="red"
                      component={Link}
                      to={e.to}
                    >
                      {e.text.toUpperCase()}
                    </Text>
                  </Tooltip>
                ) : (
                  <Text
                    size="xs"
                    weight={location.pathname === e.to ? "bold" : "normal"}
                  >
                    {e.text.toUpperCase()}
                  </Text>
                )}
              </Box>
              <Box>
                <ActionIcon
                  sx={(theme) => ({
                    visibility:
                      e.id === showIcon || pinExists ? "visible" : "hidden",
                    color:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[1]
                        : theme.colors.dark[9],
                  })}
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
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};
