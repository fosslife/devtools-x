import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { BsFilePdf, BsSortNumericUpAlt } from "react-icons/bs";
import {
  FaCode,
  FaExchangeAlt,
  FaExpand,
  FaFileImage,
  FaMarkdown,
  FaPaste,
  FaRandom,
  FaReact,
  FaTimes,
  FaYinYang,
} from "react-icons/fa";
import { FiClock, FiFile, FiHash, FiSettings } from "react-icons/fi";
import { RiPingPongLine } from "react-icons/ri";
import {
  MdAnchor,
  MdColorize,
  MdHtml,
  MdHttp,
  MdOutlineHome,
  MdPassword,
  MdQrCode,
  MdQuestionMark,
  MdWork,
} from "react-icons/md";
import { SiJsonwebtokens, SiPostgresql, SiPrettier } from "react-icons/si";
import {
  VscDiff,
  VscPin,
  VscPinned,
  VscRegex,
  VscSymbolString,
  VscTypeHierarchySub,
} from "react-icons/vsc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cx from "clsx";

import { AppContext } from "../../Contexts/AppContextProvider";
import { db } from "../../utils";
import classes from "./styles.module.css";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import {
  useDebouncedState,
  useDebouncedValue,
  useWindowEvent,
} from "@mantine/hooks";
import { trackButtonClick, trackOtherEvent } from "../../utils/analytics";

type NavItem = {
  id: string;
  to: string;
  icon: React.ReactNode;
  text: string;
  extra?: string;
};

export const data: NavItem[] = [
  {
    id: "json-formatter",
    to: "/json-formatter",
    icon: <MdAnchor />,
    text: "JSON Tools",
  },
  {
    id: "hash-text",
    to: "/hash-text",
    icon: <FiHash />,
    text: "Hashing Text",
  },
  {
    id: "hash-file",
    to: "/hash-file",
    icon: <FiFile />,
    text: "Hashing Files",
  },
  {
    id: "password",
    to: "/password",
    icon: <FaRandom />,
    text: "Password Generator",
  },
  { id: "jwt", to: "/jwt", icon: <SiJsonwebtokens />, text: "JWT Tools" },
  {
    id: "nums",
    to: "/nums",
    icon: <BsSortNumericUpAlt />,
    text: "Number Tools",
  },
  { id: "sql", to: "/sql", icon: <SiPostgresql />, text: "SQL Formatter" },
  { id: "colors", to: "/colors", icon: <MdColorize />, text: "Color Utils" },
  {
    id: "regex",
    to: "/regex",
    icon: <VscRegex />,
    text: "Regex Tester",
  },
  { id: "text", to: "/text", icon: <VscDiff />, text: "Diff Tools" },
  { id: "markdown", to: "/markdown", icon: <FaMarkdown />, text: "Markdown" },
  { id: "yamljson", to: "/yamljson", icon: <FaYinYang />, text: "Yaml JSON" },
  { id: "pastebin", to: "/pastebin", icon: <FaPaste />, text: "Pastebin" },
  { id: "repl", to: "/repl", icon: <FaCode />, text: "ScratchPad" },
  {
    id: "image",
    to: "/image",
    icon: <FaFileImage />,
    text: "Image Compressor",
  },
  {
    id: "bulk-image",
    to: "/bulk-image",
    icon: <FaFileImage />,
    text: "Bulk Image Compressor",
  },
  {
    id: "units",
    to: "/units",
    icon: <FaExchangeAlt />,
    text: "Unit Converter",
  },
  {
    id: "playground",
    to: "/playground",
    icon: <FaReact />,
    text: "React Pad",
  },
  { id: "rest", to: "/rest", icon: <MdHttp />, text: "REST API" },
  { id: "epoch", to: "/epoch", icon: <FiClock />, text: "Epoch Converter" },
  {
    id: "stateless",
    to: "/stateless",
    icon: <MdPassword />,
    text: "Stateless Password",
  },
  {
    id: "base64-text",
    to: "/base64-text",
    icon: <VscSymbolString />,
    text: "Base64 Text",
  },
  {
    id: "base64-image",
    to: "/base64-image",
    icon: <VscSymbolString />,
    text: "Base64 Image",
  },
  {
    id: "quicktype",
    to: "/quicktype",
    icon: <VscTypeHierarchySub />,
    text: "Quicktype",
  },
  {
    id: "minify",
    to: "/minify",
    icon: <SiPrettier />,
    text: "Minify/Beautify",
  },
  {
    id: "url-parser",
    to: "/url-parser",
    icon: <MdQuestionMark />,
    text: "URL Parser",
  },
  {
    id: "html-preview",
    to: "/html-preview",
    icon: <MdHtml />,
    text: "HTML Preview",
  },
  { id: "lorem", to: "/lorem", icon: <MdWork />, text: "Lorem Ipsum" },
  {
    id: "qrcode",
    to: "/qrcode",
    icon: <MdQrCode />,
    text: "QR Code Generator",
  },
  {
    id: "pdf-reader",
    to: "/pdf-reader",
    icon: <BsFilePdf />,
    text: "PDF Reader",
  },
  { id: "ping", to: "/ping", icon: <RiPingPongLine />, text: "Ping" },
];

export const Navbar = ({ openSettings }: any) => {
  const location = useLocation();
  const nav = useNavigate();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const { pinned, handleState } = useContext(AppContext);
  const [iconMode, setIconMode] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);

  useEffect(() => {
    async function pinnedItems() {
      const pinnedStore = (await db.get<string[]>("pinned")) || [];

      handleState([...pinnedStore]);
    }
    pinnedItems();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      trackOtherEvent("navbar-search", { search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    async function sidebar() {
      const savedSidebaritems = (await db.get<string[]>("sidebar")) || [];
      if (savedSidebaritems.length > 0) {
        if (savedSidebaritems.length !== data.length) {
          setNavItems([...data]);
          db.set("sidebar", []);
          return;
        }
        const newNavItems = savedSidebaritems.map((i) => {
          return data.find((d) => d.id === i)!;
        });

        setNavItems(newNavItems);
      } else {
        setNavItems([...data]);
      }
    }

    sidebar();
  }, []);

  useEffect(() => {
    // scroll to active item
    const active = document.querySelector(`.${classes.active}`);
    if (active) {
      active.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [classes.active, location.pathname, navItems]);

  const onPinClicked = async (item: any) => {
    // get existing pins from db
    const pinned = await db.get<string[]>("pinned");
    // if pin you cliked already exists in db, remove it.
    if (pinned?.includes(item.id)) {
      await db.set(
        "pinned",
        pinned.filter((i: string) => i !== item.id)
      );
    } else {
      // add existing to db
      let existing = (await db.get<string[]>("pinned")) || [];
      await db.set("pinned", [...existing, item.id]);
    }
    await db.save();
    const newPinned = await db.get<string[]>("pinned");
    handleState(newPinned as string[]);
  };

  const onDragEnd: OnDragEndResponder = (res) => {
    if (res.destination?.index === res.source.index) return;
    const items = [...navItems];
    const [reorderedItem] = items.splice(res.source.index, 1);
    items.splice(res.destination!.index, 0, reorderedItem);
    trackOtherEvent("navbar-reorder", {
      fromItem: res.source.index,
      toItem: res.destination!.index,
    });
    setNavItems(items);
    db.set(
      "sidebar",
      items.map((i) => i.id)
    );
    db.save();
  };

  const listener = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "b") {
      trackOtherEvent("shortcut", {
        key: "mod + b",
        action: "toggle-sidebar-collapse",
      });
      setIconMode(!iconMode);
    }
  };

  useWindowEvent("keydown", listener);

  return (
    <Stack className={classes.navbar} align={iconMode ? "center" : undefined}>
      <Stack
        className={iconMode ? classes.iconsTopSection : classes.topSection}
      >
        <Group wrap="nowrap" align="end" py={10}>
          {!iconMode && (
            <TextInput
              id="search"
              placeholder="Search..."
              size={"xs"}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className={classes.textInput}
              miw={180}
            />
          )}
          <ActionIcon
            color="blue.9"
            variant={"filled"}
            onClick={() => {
              trackButtonClick({
                name: "toggle-icon-mode",
                value: !iconMode,
              });
              setIconMode(!iconMode);
            }}
          >
            {iconMode ? <FaTimes /> : <FaExpand />}
          </ActionIcon>
        </Group>
        {!iconMode && (
          <Group mt="2" className={classes.homeWrapper}>
            <Flex gap={15} onClick={() => nav("/")} className={classes.home}>
              <MdOutlineHome size={"20px"} />
              <Text fw={location.pathname === "/" ? "bold" : "normal"}>
                {"Home"}
              </Text>
            </Flex>

            <ActionIcon
              color="blue.9"
              variant={"filled"}
              onClick={() => {
                trackButtonClick({
                  name: "open-settings",
                  value: true,
                });
                openSettings(true);
              }}
            >
              <FiSettings />
            </ActionIcon>
          </Group>
        )}
      </Stack>
      <Divider />
      {/* ====== One Title */}
      {!iconMode ? (
        <Stack className={classes.bottomSection}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {navItems
                    .filter((n) =>
                      n.text
                        .toLowerCase()
                        .includes(debouncedSearch.toLowerCase())
                    )
                    .map((e, index) => {
                      const pinExists = pinned?.includes(e.id);

                      return (
                        <Draggable
                          key={e.id}
                          draggableId={e.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                userSelect: "none",
                              }}
                            >
                              <Box
                                key={e.id}
                                className={cx(classes.row, {
                                  [classes.active]: location.pathname === e.to,
                                })}
                                onClick={() => {
                                  nav(e.to);
                                }}
                              >
                                <Box className={classes.listTitle}>
                                  <Text className={classes.rowIcon}>
                                    {e.icon}
                                  </Text>
                                  {e.extra ? (
                                    <Tooltip label={e.extra}>
                                      <Text
                                        size="xs"
                                        fw={
                                          location.pathname === e.to
                                            ? "500"
                                            : "400"
                                        }
                                        c="red"
                                        component={Link}
                                        to={e.to}
                                      >
                                        {e.text.toUpperCase()}
                                      </Text>
                                    </Tooltip>
                                  ) : (
                                    <Text
                                      size="xs"
                                      fw={
                                        location.pathname === e.to
                                          ? "500"
                                          : "400"
                                      }
                                    >
                                      {e.text.toUpperCase()}
                                    </Text>
                                  )}
                                </Box>
                                <Box>
                                  <ActionIcon
                                    variant={pinExists ? "subtle" : "outline"}
                                    style={{
                                      visibility: pinExists
                                        ? "visible"
                                        : undefined,
                                      color:
                                        "light-dark(var(--mantine-color-dark-1), var(--mantine-color-dark-4))",
                                    }}
                                    className={classes.pinIcon}
                                    size={"sm"}
                                    onClick={(e2) => {
                                      e2.stopPropagation();
                                      onPinClicked(e);
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
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
      ) : (
        <Stack className={classes.iconsbarWrapper}>
          {navItems.map((e) => {
            return (
              <Box
                key={e.id}
                className={cx(classes.iconsBarRow, {
                  [classes.active]: location.pathname === e.to,
                })}
                onClick={() => nav(e.to)}
              >
                {e.icon}
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};
