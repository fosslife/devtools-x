import "./markdown.css";

import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import React from "react";

import "katex/dist/katex.min.css";

const MdPreview = ({
  source,
  style,
}: {
  source: string;
  style?: React.CSSProperties;
}) => {
  return (
    <MarkdownPreview
      source={source}
      style={style}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      rehypeRewrite={(node) => {
        if (hackyCast(node)?.tagName === "a") {
          hackyCast(node).properties.target = "_blank";
          hackyCast(node).properties.rel = "noopener noreferrer";
        }
      }}
    />
  );
};

const hackyCast = (node: any): any => node;

export default MdPreview;
