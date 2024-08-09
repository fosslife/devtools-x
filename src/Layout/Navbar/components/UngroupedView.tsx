import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import cx from "clsx";
import { ActionIcon, Box, Stack, Text, Tooltip } from "@mantine/core";
import { VscPin, VscPinned } from "react-icons/vsc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackOtherEvent } from "@/utils/analytics";
import { db } from "@/utils";

import classes from "./ungrouped.module.css";
import { NavItem } from "..";
import { MdDragIndicator } from "react-icons/md";

type UngroupedViewProps = {
  navItems: NavItem[];
  pinned: any;
  onPinClicked: any;
  handleNavItems: (items: NavItem[]) => void;
};

export const UngroupedView = ({
  navItems,
  onPinClicked,
  pinned,
  handleNavItems,
}: UngroupedViewProps) => {
  const location = useLocation();
  const nav = useNavigate();

  const onDragEnd: OnDragEndResponder = (res) => {
    if (res.destination?.index === res.source.index) return;
    const items = [...navItems];
    const [reorderedItem] = items.splice(res.source.index, 1);
    items.splice(res.destination!.index, 0, reorderedItem);
    trackOtherEvent("navbar-reorder", {
      fromItem: res.source.index,
      toItem: res.destination!.index,
    });
    handleNavItems(items);
    db.set(
      "sidebar",
      items.map((i) => i.id)
    );
    db.save();
  };

  return (
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
                            <ActionIcon
                              className={classes.dragHandle}
                              size={"xs"}
                              variant="subtle"
                            >
                              <MdDragIndicator />
                            </ActionIcon>
                            <Text className={classes.rowIcon}>{e.icon}</Text>
                            {e.extra ? (
                              <Tooltip label={e.extra}>
                                <Text
                                  size="xs"
                                  fw={
                                    location.pathname === e.to ? "500" : "400"
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
                                fw={location.pathname === e.to ? "500" : "400"}
                              >
                                {e.text}
                              </Text>
                            )}
                          </Box>
                          <Box>
                            <ActionIcon
                              variant={pinExists ? "subtle" : "default"}
                              style={{
                                visibility: pinExists ? "visible" : undefined,
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
  );
};
