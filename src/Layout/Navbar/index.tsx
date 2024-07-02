import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsFilePdf, BsSortNumericUpAlt } from "react-icons/bs";
import {
  FaCode,
  FaCompress,
  FaExchangeAlt,
  FaFileImage,
  FaMarkdown,
  FaPaste,
  FaRandom,
  FaReact,
  FaYinYang,
} from "react-icons/fa";
import { FiClock, FiFile, FiHash, FiStar } from "react-icons/fi";
import { RiPingPongLine } from "react-icons/ri";
import {
  MdAnchor,
  MdColorize,
  MdHtml,
  MdHttp,
  MdPassword,
  MdPermIdentity,
  MdQrCode,
  MdQuestionMark,
  MdWork,
  MdDataExploration,
  MdMenu,
  MdMenuOpen,
  MdSettings,
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
import { useWindowEvent } from "@mantine/hooks";
import { trackButtonClick, trackOtherEvent } from "../../utils/analytics";

const Groups = [
  "Web",
  "Utilities",
  "Testing",
  "Password",
  "Image",
  "Generators",
  "Minifier/Formatters",
  "Previewers",
  "Converters",
  "Hashing",
] as const;

type NavItem = {
  id: string;
  to: string;
  icon: React.ReactNode;
  text: string;
  group: (typeof Groups)[number];
  extra?: string;
};

export const data: NavItem[] = [
  { id: "rest", to: "/rest", icon: <MdHttp />, text: "REST API", group: "Web" },
  {
    id: "epoch",
    to: "/epoch",
    icon: <FiClock />,
    text: "Epoch Converter",
    group: "Web",
  },
  {
    id: "ping",
    to: "/ping",
    icon: <RiPingPongLine />,
    text: "Ping",
    group: "Utilities",
  },
  {
    id: "password",
    to: "/password",
    icon: <FaRandom />,
    text: "Password Generator",
    group: "Password",
  },
  {
    id: "qrcode",
    to: "/qrcode",
    icon: <MdQrCode />,
    text: "QR Code Generator",
    group: "Generators",
  },
  {
    id: "minify",
    to: "/minify",
    icon: <SiPrettier />,
    text: "Minify/Beautify",
    group: "Minifier/Formatters",
  },
  {
    id: "playground",
    to: "/playground",
    icon: <FaReact />,
    text: "React Pad",
    group: "Testing",
  },
  {
    id: "lorem",
    to: "/lorem",
    icon: <MdWork />,
    text: "Lorem Ipsum",
    group: "Generators",
  },
  {
    id: "image",
    to: "/image",
    icon: <FaFileImage />,
    text: "Image Compressor",
    group: "Image",
  },
  {
    id: "pastebin",
    to: "/pastebin",
    icon: <FaPaste />,
    text: "Pastebin",
    group: "Utilities",
  },
  {
    id: "repl",
    to: "/repl",
    icon: <FaCode />,
    text: "Scratchpad",
    group: "Testing",
  },
  {
    id: "bulk-image",
    to: "/bulk-image",
    icon: <FaFileImage />,
    text: "Bulk Image Compressor",
    group: "Image",
  },
  {
    id: "base64-text",
    to: "/base64-text",
    icon: <VscSymbolString />,
    text: "Base64 Text",
    group: "Converters",
  },
  {
    id: "base64-image",
    to: "/base64-image",
    icon: <VscSymbolString />,
    text: "Base64 Image",
    group: "Converters",
  },
  {
    id: "hash-text",
    to: "/hash-text",
    icon: <FiHash />,
    text: "Hashing Text",
    group: "Hashing",
  },
  {
    id: "hash-file",
    to: "/hash-file",
    icon: <FiFile />,
    text: "Hashing Files",
    group: "Hashing",
  },

  {
    id: "json-formatter",
    to: "/json-formatter",
    icon: <MdAnchor />,
    text: "JSON Tools",
    group: "Minifier/Formatters",
  },
  {
    id: "jwt",
    to: "/jwt",
    icon: <SiJsonwebtokens />,
    text: "JWT Tools",
    group: "Web",
  },
  {
    id: "nums",
    to: "/nums",
    icon: <BsSortNumericUpAlt />,
    text: "Number Tools",
    group: "Converters",
  },
  {
    id: "sql",
    to: "/sql",
    icon: <SiPostgresql />,
    text: "SQL Formatter",
    group: "Minifier/Formatters",
  },
  {
    id: "colors",
    to: "/colors",
    icon: <MdColorize />,
    text: "Color Utils",
    group: "Converters",
  },

  {
    id: "text",
    to: "/text",
    icon: <VscDiff />,
    text: "Diff Tools",
    group: "Utilities",
  },
  {
    id: "markdown",
    to: "/markdown",
    icon: <FaMarkdown />,
    text: "Markdown",
    group: "Previewers",
  },
  {
    id: "yamljson",
    to: "/yamljson",
    icon: <FaYinYang />,
    text: "Yaml Json",
    group: "Converters",
  },
  {
    id: "units",
    to: "/units",
    icon: <FaExchangeAlt />,
    text: "Unit Converter",
    group: "Converters",
  },
  {
    id: "compress",
    to: "/compress",
    icon: <FaCompress />,
    text: "Compress Text",
    group: "Minifier/Formatters",
  },
  {
    id: "stateless",
    to: "/stateless",
    icon: <MdPassword />,
    text: "Stateless Password",
    group: "Password",
  },

  {
    id: "quicktype",
    to: "/quicktype",
    icon: <VscTypeHierarchySub />,
    text: "Quicktype",
    group: "Testing",
  },

  {
    id: "url-parser",
    to: "/url-parser",
    icon: <MdQuestionMark />,
    text: "URL Parser",
    group: "Web",
  },
  {
    id: "html-preview",
    to: "/html-preview",
    icon: <MdHtml />,
    text: "HTML Preview",
    group: "Previewers",
  },

  {
    id: "pdf-reader",
    to: "/pdf-reader",
    icon: <BsFilePdf />,
    text: "PDF Reader",
    group: "Previewers",
  },

  {
    id: "cron",
    to: "/cron",
    icon: <FiStar />,
    text: "Cron",
    group: "Utilities",
  },
  {
    id: "ids",
    to: "/ids",
    icon: <MdPermIdentity />,
    text: "ID Generator",
    group: "Generators",
  },
  {
    id: "regex",
    to: "/regex",
    icon: <VscRegex />,
    text: "Regex Tester",
    group: "Testing",
  },
  {
    id: "faker",
    to: "/faker",
    icon: <MdDataExploration />,
    text: "Faker",
    group: "Generators",
  },
];

export const Navbar = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const { pinned, handleState } = useContext(AppContext);
  const [iconMode, setIconMode] = useState(false);

  useEffect(() => {
    async function pinnedItems() {
      const pinnedStore = (await db.get<string[]>("pinned")) || [];

      handleState([...pinnedStore]);
    }
    pinnedItems();
  }, []);

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

  const dropDownItems = useMemo(() => {
    const arr = [...Groups].map((i) => ({
      group: i,
      items: navItems
        .filter((n) => n.group === i)
        .map((n) => ({ label: n.text, value: n.to })),
    }));

    arr.unshift({
      group: "All" as any,
      items: [
        {
          label: "Home",
          value: "/",
        },
      ],
    });

    return arr;
  }, [navItems]);

  useWindowEvent("keydown", listener);

  return (
    <Stack
      className={classes.navbar}
      id="navbar"
      align={iconMode ? "center" : undefined}
    >
      <Stack
        className={iconMode ? classes.iconsTopSection : classes.topSection}
      >
        <Group wrap="nowrap" align="end" gap={0} pr={10}>
          <Select
            data={dropDownItems}
            // value={group}
            onChange={(value) => {
              if (value) {
                console.log(value);
                nav(`${value}`);
              }
            }}
            allowDeselect={false}
            searchable
            clearable
            placeholder="Search..."
            px="sm"
            size="xs"
            display={iconMode ? "none" : "block"}
            mt={15}
          />

          <ActionIcon
            variant={"filled"}
            onClick={() => {
              trackButtonClick({
                name: "toggle-icon-mode",
                value: !iconMode,
              });
              setIconMode(!iconMode);
            }}
          >
            {iconMode ? <MdMenu /> : <MdMenuOpen />}
          </ActionIcon>
        </Group>
      </Stack>
      <Divider />
      {/* ====== One Title */}
      {!iconMode ? (
        <Stack className={classes.bottomSection}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {navItems.map((e, index) => {
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
                                      {e.text}
                                    </Text>
                                  </Tooltip>
                                ) : (
                                  <Text
                                    size="xs"
                                    fw={
                                      location.pathname === e.to ? "500" : "400"
                                    }
                                  >
                                    {e.text}
                                  </Text>
                                )}
                              </Box>
                              <Box>
                                <ActionIcon
                                  variant={pinExists ? "subtle" : "default"}
                                  style={{
                                    visibility: pinExists
                                      ? "visible"
                                      : undefined,
                                    color:
                                      "light-dark(var(--mantine-color-dark-4), var(--mantine-color-dark-1))",
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
              <Tooltip label={e.text} key={e.id}>
                <Box
                  className={cx(classes.iconsBarRow, {
                    [classes.active]: location.pathname === e.to,
                  })}
                  onClick={() => nav(e.to)}
                >
                  {e.icon}
                </Box>
              </Tooltip>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};
