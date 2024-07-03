import {
  Accordion,
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

import { MdMenu, MdMenuOpen, MdHome } from "react-icons/md";

import { useLocation, useNavigate } from "react-router-dom";
import cx from "clsx";
import { navitems as data, groupIcons } from "./items";
import { AppContext } from "../../Contexts/AppContextProvider";
import { db } from "../../utils";
import classes from "./styles.module.css";

import { useWindowEvent } from "@mantine/hooks";
import { trackButtonClick, trackOtherEvent } from "../../utils/analytics";
import { VscPin, VscPinned } from "react-icons/vsc";

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

export type NavItem = {
  id: string;
  to: string;
  icon: React.ReactNode;
  text: string;
  group: (typeof Groups)[number];
  extra?: string;
};

export { data };

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
        .map((n) => ({ label: n.text, value: n.to, icon: n.icon, id: n.id })),
    }));

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
          <ActionIcon
            onClick={() => nav("/")}
            display={iconMode ? "none" : "flex"}
          >
            <MdHome />
          </ActionIcon>
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
            width={""}
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
        <Accordion
          variant="filled"
          defaultValue={"Web"}
          style={{
            overflow: "auto",
          }}
        >
          {dropDownItems
            .filter((x) => x.group !== ("All" as any))
            .map((group) => {
              return (
                <Accordion.Item key={group.group} value={group.group}>
                  <Accordion.Control icon={groupIcons[group.group]}>
                    <Text fz="1rem">{group.group}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap={5}>
                      {group.items.map((i) => {
                        const pinExists = pinned?.includes(i.id);

                        return (
                          <Group
                            gap={7}
                            align="center"
                            key={i.value}
                            wrap="nowrap"
                            className={cx(classes.row, {
                              [classes.active]: location.pathname === i.value,
                            })}
                            justify="space-between"
                            onClick={() => nav(i.value)}
                          >
                            <Group wrap="nowrap">
                              <Text fz="md" mt={7}>
                                {i.icon}
                              </Text>
                              <Text truncate={"end"} fz={"0.9rem"}>
                                {i.label}
                              </Text>
                            </Group>
                            <ActionIcon
                              variant={pinExists ? "light" : "default"}
                              style={{
                                visibility: pinExists ? "visible" : undefined,
                                color:
                                  "light-dark(var(--mantine-color-dark-4), var(--mantine-color-dark-1))",
                              }}
                              className={classes.pinIcon}
                              size={"sm"}
                              onClick={(e2) => {
                                e2.stopPropagation();
                                onPinClicked(i);
                              }}
                            >
                              {pinExists ? (
                                <VscPinned size="15px" />
                              ) : (
                                <VscPin size="15px" />
                              )}
                            </ActionIcon>
                          </Group>
                        );
                      })}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
        </Accordion>
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
