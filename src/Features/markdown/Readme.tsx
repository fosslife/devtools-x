import { Button, Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFile, useMdEditorState } from "@/hooks";
import MarkdownEditor from "@/Features/markdown/Editor";
import { templates } from "@/Features/markdown/templates";
import ReadmeSidebar from "@/Features/markdown/ReadmeSidebar";
import { Part } from "./types";

// TODO: Build more advanced templates like Awsome Readme & some cleanup / reusability

const initialReadme = [
  {
    title: "Header",
    template: templates.header as string,
  },
  {
    title: "Acknowledgements",
    template: templates.acknowledgements as string,
  },
];

const Readme = () => {
  const { state, toggle } = useMdEditorState();

  // Parts of the readme

  const [parts, setParts] = useState<Part[]>(initialReadme);

  const [activeIndex, setActiveIndex] = useState(0);
  const updatePart = (template: string) =>
    setParts((p) =>
      p.map((part, index) =>
        index === activeIndex ? { ...part, template } : part
      )
    );

  const combineParts = () => parts.map((part) => part.template).join("\n");

  // Actual file

  const { file, setFile, openFile, saveFile } = useFile({
    initialFile: combineParts(),
  });

  useEffect(() => {
    setFile(combineParts());
  }, [parts]);

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
        <Button onClick={() => toggle("preview")} disabled={!state.editor}>
          {state.preview ? "Hide" : "Show"} preview
        </Button>
        <Button onClick={() => toggle("editor")} disabled={!state.preview}>
          {state.editor ? "Hide" : "Show"} editor
        </Button>
        {typeof activeIndex != "undefined" && parts.length > 1 ? (
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
        <ReadmeSidebar
          parts={parts}
          setParts={setParts}
          activeIndex={{
            index: activeIndex,
            set: setActiveIndex,
          }}
          popover={{
            toggle: () => toggle("templates"),
            opened: state.templates,
          }}
        />
        <MarkdownEditor
          file={(parts[activeIndex]?.template ?? "") as string}
          previewFile={file}
          setFile={(value) => updatePart(value as string)}
          showPreview={state.preview}
          showEditor={state.editor}
        />
      </div>
    </Stack>
  );
};

export default Readme;
