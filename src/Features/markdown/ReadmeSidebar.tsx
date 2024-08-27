import classes from "@/Layout/Navbar/components/ungrouped.module.css";
import { Box, Stack, Text } from "@mantine/core";
import { titleCase } from "@/utils/strings";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import cx from "clsx";

import { templates } from "@/Features/markdown/templates";
import MarkdownInsertion from "@/Features/markdown/MarkdownInsertion";
import type { Part } from "./types";

const ReadmeSidebar = ({
  parts,
  setParts,
  activeIndex,
  popover,
}: {
  parts: Part[];
  setParts: (parts: Part[]) => void;

  activeIndex: {
    index: number;
    set: (index: number) => void;
  };
  popover: {
    toggle: () => void;
    opened: boolean;
  };
}) => {
  const onDragEnd: OnDragEndResponder = (res) => {
    if (res.destination?.index === res.source.index) return;
    const items = [...parts];
    const [reorderedItem] = items.splice(res.source.index, 1);
    items.splice(res.destination!.index, 0, reorderedItem);
    setParts(items);
  };

  const addPart = (title: string, template: string) =>
    setParts([
      ...parts,
      {
        title,
        template,
      },
    ]);

  return (
    <Stack
      style={{
        width: "250px",
        marginRight: "15px",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {parts.map((part, index) => (
                <Draggable
                  key={part.title + index}
                  draggableId={part.title}
                  index={index}
                >
                  {(provided) => (
                    <div
                      role="button"
                      tabIndex={0}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        userSelect: "none",
                      }}
                      onClick={() => activeIndex.set(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") activeIndex.set(index);
                      }}
                    >
                      <Box
                        className={cx(classes.row, {
                          [classes.active]: activeIndex.index === index,
                        })}
                      >
                        <Text
                          size="xs"
                          fw={activeIndex.index === index ? "500" : "400"}
                        >
                          {titleCase(part.title)}
                        </Text>
                      </Box>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <MarkdownInsertion
        opened={popover.opened}
        toggle={popover.toggle}
        templates={templates}
        addPart={addPart}
        callback={() => activeIndex.set(parts.length)}
      />
    </Stack>
  );
};

export default ReadmeSidebar;
