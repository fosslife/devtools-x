// @ts-nocheck
import "./markdown.css";

import { Box, Group } from "@mantine/core";
import { Monaco } from "@/Components/MonacoWrapper";

import "katex/dist/katex.min.css";
import MdPreview from "./MarkdownPreview";

const MarkdownEditor = ({
  file,
  previewFile,
  setFile,
  showPreview = true,
  showEditor = true,
}: {
  file: string;
  previewFile?: string;
  setFile: (file: string) => void;
  showPreview?: boolean;
  showEditor?: boolean;
}) => {
  return (
    <Group style={{ width: "100%", height: "95%" }} grow gap={10}>
      {showEditor ? (
        <Box style={{ width: showPreview ? "50%" : "100%", height: "100%" }}>
          <Monaco
            setValue={(e) => setFile(e || "")}
            value={file}
            language="markdown"
            onEditorMounted={(editor) => {
              // eslint-disable-next-line
              editor.getContribution(
                "editor.linkDetector"
              ).openerService._defaultExternalOpener.openExternal = () => {};
            }}
          />
        </Box>
      ) : null}
      {showPreview ? (
        <Box style={{ width: showEditor ? "50%" : "100%", height: "100%" }}>
          <MdPreview
            source={previewFile ?? file}
            style={{ padding: "15px", height: "100%", overflow: "scroll" }}
          />
        </Box>
      ) : null}
    </Group>
  );
};

export default MarkdownEditor;
