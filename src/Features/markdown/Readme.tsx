import { Button, Group, Select, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFile } from "@/hooks";
import MarkdownEditor from "@/Features/markdown/Editor";
import { templates } from "@/Features/markdown/templates";

type Part = {
  title: string;
  template: string;
};

// TODO: Add these:
// https://github.com/fosslife/devtools-x/issues/94
// [ ] Reordering parts
// [ ] Removing parts
// [ ] Preview templates before inserting
// [ ] Build more advanced templates like Awsome Readme
const Readme = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [showEditor, setShowEditor] = useState(true);

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

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <Group>
        <Button onClick={openFile}>Open md file</Button>
        <Button onClick={saveFile}>Save md file</Button>
        <Select
          data={parts.map((part) => part.title)}
          value={activePart?.title}
          onChange={(value) =>
            setActiveIndex(parts.findIndex((part) => part.title === value))
          }
        />
        {/*  add part select */}
        <Select
          data={Object.keys(templates)}
          value={activePart?.title}
          onChange={(value) => {
            const template = templates[value as keyof typeof templates];
            const render =
              typeof template === "string" ? template : template?.render;

            setParts((prev) => [
              ...prev,
              {
                title: value,
                template: render,
              } as Part,
            ]);
          }}
        />
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
      </Group>
      <MarkdownEditor
        file={(activePart?.template ?? "") as string}
        // previewFile={combineParts() as string}
        previewFile={file}
        setFile={(value) => updatePart(value as string)}
        showPreview={showPreview}
        showEditor={showEditor}
      />
    </Stack>
  );
};

export default Readme;
