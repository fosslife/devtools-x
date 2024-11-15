import { Accordion, Stack, Group, ActionIcon, Text } from "@mantine/core";
import { IconPin, IconPinned } from "@tabler/icons-react";
import cx from "clsx";
import { groupIcons } from "../items";
import { DropDownItem } from "..";

import classes from "./grouped.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { cloneElement, ReactElement, useEffect, useState } from "react";

type GroupedViewProps = {
  dropDownItems: DropDownItem[];
  pinned: any;
  onPinClicked: any;
};

export const GroupedView = ({
  dropDownItems,
  onPinClicked,
  pinned,
}: GroupedViewProps) => {
  const location = useLocation();
  const nav = useNavigate();

  const [openGroup, setOpenGroup] = useState<string | null>("Web");

  useEffect(() => {
    if (location.pathname !== "/") {
      const group = dropDownItems.find((x) =>
        x.items.some((i) => i.value === location.pathname)
      );
      if (!group) return;
      setOpenGroup(group.group);
    }
  }, [location.pathname, dropDownItems]);

  return (
    <Accordion
      variant="filled"
      value={openGroup}
      onChange={setOpenGroup}
      style={{
        overflow: "auto",
      }}
    >
      {dropDownItems
        .filter((x) => x.group !== ("All" as any))
        .map((group) => {
          return (
            <Accordion.Item key={group.group} value={group.group}>
              <Accordion.Control icon={cloneElement(groupIcons[group.group])}>
                <Text size="sm">{group.group}</Text>
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
                          {cloneElement(i.icon as ReactElement, {
                            size: "16px",
                          })}
                          <Text truncate={"end"} size="xs">
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
                            <IconPinned size="15px" />
                          ) : (
                            <IconPin size="15px" />
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
  );
};
