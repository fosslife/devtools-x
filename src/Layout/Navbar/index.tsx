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
import {
  ChangeEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { BsSortNumericUpAlt } from "react-icons/bs";
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
// import { RiPingPongLine } from "react-icons/ri";
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
import { useWindowEvent } from "@mantine/hooks";

export const data = [
  { id: 1, to: "/json-formatter", icon: <MdAnchor />, text: "JSON Tools" },
  { id: 2, to: "/hash-text", icon: <FiHash />, text: "Hashing Text" },
  { id: 18, to: "/hash-file", icon: <FiFile />, text: "Hashing Files" },
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
  { id: 14, to: "/image", icon: <FaFileImage />, text: "Image Compressor" },
  {
    id: 27,
    to: "/bulk-image",
    icon: <FaFileImage />,
    text: "Bulk Image Compressor",
  },
  { id: 15, to: "/units", icon: <FaExchangeAlt />, text: "Unit Converter" },
  { id: 16, to: "/playground", icon: <FaReact />, text: "React Pad" },
  { id: 17, to: "/rest", icon: <MdHttp />, text: "REST API" },
  { id: 19, to: "/epoch", icon: <FiClock />, text: "Epoch Converter" },
  {
    id: 20,
    to: "/stateless",
    icon: <MdPassword />,
    text: "Stateless Password",
  },
  {
    id: 21,
    to: "/base64-text",
    icon: <VscSymbolString />,
    text: "Base64 Text",
  },
  {
    id: 22,
    to: "/base64-image",
    icon: <VscSymbolString />,
    text: "Base64 Image",
  },
  {
    id: 23,
    to: "/quicktype",
    icon: <VscTypeHierarchySub />,
    text: "Quicktype",
  },
  {
    id: 24,
    to: "/minify",
    icon: <SiPrettier />,
    text: "Minify/Beautify",
  },
  {
    id: 25,
    to: "/url-parser",
    icon: <MdQuestionMark />,
    text: "URL Parser",
  },
  {
    id: 26,
    to: "/html-preview",
    icon: <MdHtml />,
    text: "HTML Preview",
  },
  {
    id: 28,
    to: "/lorem",
    icon: <MdWork />,
    text: "Lorem Ipsum",
  },
  {
    id: 29,
    to: "/qrcode",
    icon: <MdQrCode />,
    text: "QR Code Generator",
  },
];

export const Navbar = ({ openSettings }: any) => {
  const location = useLocation();
  const nav = useNavigate();
  const [navItems, setNavItems] = useState<any[]>([]);
  const { pinned, handleState } = useContext(AppContext);
  const [iconMode, setIconMode] = useState(false);

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

  useEffect(() => {
    async function pinnedItems() {
      const pinnedStore = (await db.get<number[]>("pinned")) || [];

      handleState([...pinnedStore]);
    }
    pinnedItems();
  }, []);

  useEffect(() => {
    async function sidebar() {
      const savedSidebaritems = (await db.get<number[]>("sidebar")) || [];
      if (savedSidebaritems.length > 0) {
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

  const onPinClicked = async (item: any) => {
    // get existing pins from db
    const pinned = await db.get<number[]>("pinned");
    // if pin you cliked already exists in db, remove it.
    if (pinned?.includes(item.id)) {
      await db.set(
        "pinned",
        pinned.filter((i: number) => i !== item.id)
      );
    } else {
      // add existing to db
      let existing = (await db.get<number[]>("pinned")) || [];
      await db.set("pinned", [...existing, item.id]);
    }
    await db.save();
    const newPinned = await db.get<number[]>("pinned");
    handleState(newPinned as number[]);
  };

  const onDragEnd: OnDragEndResponder = (res) => {
    if (res.destination?.index === res.source.index) return;
    const items = [...navItems];
    const [reorderedItem] = items.splice(res.source.index, 1);
    items.splice(res.destination!.index, 0, reorderedItem);
    setNavItems(items);
    db.set(
      "sidebar",
      items.map((i) => i.id)
    );
    db.save();
  };

  const listener = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "b") {
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
              onChange={filterItems}
              className={classes.textInput}
            />
          )}
          <ActionIcon
            color="blue.9"
            variant={"filled"}
            onClick={() => setIconMode(!iconMode)}
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
              onClick={() => openSettings(true)}
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
                                      {e.text.toUpperCase()}
                                    </Text>
                                  </Tooltip>
                                ) : (
                                  <Text
                                    size="xs"
                                    fw={
                                      location.pathname === e.to ? "500" : "400"
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
