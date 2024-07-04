import { Accordion, Stack, Group, ActionIcon, Text } from "@mantine/core";
import { VscPinned, VscPin } from "react-icons/vsc";
import cx from "clsx";
import { groupIcons } from "../items";
import { DropDownItem } from "..";

import classes from "../styles.module.css";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
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
  );
};
