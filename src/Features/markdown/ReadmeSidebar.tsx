import { Box, Button, Popover, Stack, Text } from "@mantine/core";
import { templates } from "@/Features/markdown/templates";
import { titleCase } from "@/utils/strings";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import cx from "clsx";
import classes from "@/Layout/Navbar/components/ungrouped.module.css";
import MdPreview from "@/Features/markdown/MarkdownPreview";
import { Part } from "./types";

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
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        userSelect: "none",
                      }}
                      onClick={() => activeIndex.set(index)}
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
      <Popover opened={popover.opened} onChange={popover.toggle}>
        <Popover.Target>
          <Button onClick={popover.toggle}>Add section</Button>
        </Popover.Target>

        <Popover.Dropdown>
          <Stack
            style={{
              maxHeight: "60vh",
              maxWidth: "300px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {Object.keys(templates).map((key) => {
              const template = templates[key as keyof typeof templates];
              const isStringTemplate = typeof template === "string";
              const renderTitle = !isStringTemplate && template?.renderTitle;
              const renderTemplate = isStringTemplate
                ? template
                : template?.render;

              return (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    addPart(key, renderTemplate);
                    activeIndex.set(parts.length);
                    popover.toggle();
                  }}
                >
                  <RenderTemplatePart
                    renderTemplate={renderTemplate}
                    renderTitle={renderTitle ? key : undefined}
                  />
                </div>
              );
            })}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Stack>
  );
};

const RenderTemplatePart = ({
  renderTemplate,
  renderTitle,
}: {
  renderTemplate: string;
  renderTitle?: string;
}) => (
  <div
    style={{
      pointerEvents: "none",
    }}
  >
    {renderTitle ? (
      <Text
        size="xs"
        fw="bold"
        style={{
          textAlign: "center",
          background: "#eee",
          color: "#333",
        }}
      >
        {titleCase(renderTitle)}
      </Text>
    ) : (
      <MdPreview
        source={renderTemplate}
        style={{
          fontSize: "0.8em",
          maxHeight: "200px",
          overflow: "hidden",
          padding: 5,
        }}
      />
    )}
  </div>
);

export default ReadmeSidebar;
