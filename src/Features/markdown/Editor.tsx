// @ts-nocheck
import "./markdown.css";

import { Box, Group } from "@mantine/core";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Monaco } from "@/Components/MonacoWrapper";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";

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
          <MarkdownPreview
            source={previewFile ?? file}
            style={{ padding: "15px", height: "100%", overflow: "scroll" }}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            rehypeRewrite={(node) => {
              if (node.tagName === "a") {
                node.properties.target = "_blank";
                node.properties.rel = "noopener noreferrer";
              }
            }}
          />
        </Box>
      ) : null}
    </Group>
  );
};

export default MarkdownEditor;
