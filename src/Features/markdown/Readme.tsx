import { Box, Button, Group, Popover, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFile } from "@/hooks";
import MarkdownEditor from "@/Features/markdown/Editor";
import { templates } from "@/Features/markdown/templates";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import cx from "clsx";
import classes from "@/Layout/Navbar/components/ungrouped.module.css";
import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

type Part = {
  title: string;
  template: string;
};

// TODO: Build more advanced templates like Awsome Readme & some cleanup / reusability

const Readme = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [opened, setOpened] = useState(false);

  const [parts, setParts] = useState<Part[]>([
    {
      title: "Header",
      template: templates.header as string,
    },
    {
      title: "Acknowledgements",
      template: templates.acknowledgements as string,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const updatePart = (template: string) => {
    setParts((p) =>
      p.map((part, index) =>
        index === activeIndex ? { ...part, template } : part
      )
    );
  };
  const activePart = parts[activeIndex];

  const combineParts = () => parts.map((part) => part.template).join("\n");

  const { file, setFile, openFile, saveFile } = useFile({
    initialFile: combineParts(),
  });

  useEffect(() => {
    setFile(combineParts());
  }, [parts]);

  const onDragEnd: OnDragEndResponder = (res) => {
    if (res.destination?.index === res.source.index) return;
    const items = [...parts];
    const [reorderedItem] = items.splice(res.source.index, 1);
    items.splice(res.destination!.index, 0, reorderedItem);
    setParts(items);
  };

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <Group>
        <Button
          onClick={() =>
            openFile((data) => {
              setParts([{ title: "Content", template: data }]);
            })
          }
        >
          Open md file
        </Button>
        <Button onClick={saveFile}>Save md file</Button>
        <Button
          onClick={() => setShowPreview((p) => !p)}
          disabled={!showEditor}
        >
          {showPreview ? "Hide" : "Show"} preview
        </Button>
        <Button
          onClick={() => setShowEditor((p) => !p)}
          disabled={!showPreview}
        >
          {showEditor ? "Hide" : "Show"} editor
        </Button>
        {typeof activeIndex != "undefined" && parts?.length > 1 ? (
          <Button
            onClick={() => {
              setParts((prev) =>
                prev.filter((_, index) => index !== activeIndex)
              );
              setActiveIndex(0);
            }}
          >
            Remove
          </Button>
        ) : null}
      </Group>
      <div style={{ width: "100%", height: "95%", display: "flex" }}>
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
                          onClick={() => setActiveIndex(index)}
                        >
                          <Box
                            className={cx(classes.row, {
                              [classes.active]: activeIndex === index,
                            })}
                          >
                            <Text
                              size="xs"
                              fw={activeIndex === index ? "500" : "400"}
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
          <Popover opened={opened} onChange={setOpened}>
            <Popover.Target>
              <Button onClick={() => setOpened((o) => !o)}>Add section</Button>
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
                  const renderTitle =
                    !isStringTemplate && template?.renderTitle;

                  return (
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setParts((prev) => [
                          ...prev,
                          {
                            title: key,
                            template: isStringTemplate
                              ? template
                              : template?.render,
                          } as Part,
                        ]);
                      }}
                    >
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
                            {titleCase(key)}
                          </Text>
                        ) : (
                          <MarkdownPreview
                            source={
                              isStringTemplate ? template : template?.render
                            }
                            style={{
                              fontSize: "0.8em",
                              maxHeight: "200px",
                              overflow: "hidden",
                              padding: 5,
                            }}
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Stack>
        <MarkdownEditor
          file={(activePart?.template ?? "") as string}
          // previewFile={combineParts() as string}
          previewFile={file}
          setFile={(value) => updatePart(value as string)}
          showPreview={showPreview}
          showEditor={showEditor}
        />
      </div>
    </Stack>
  );
};

const titleCase = (pascalCase: string) => {
  return pascalCase
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export default Readme;
