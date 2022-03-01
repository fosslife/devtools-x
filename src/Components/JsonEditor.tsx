import "jsoneditor/dist/jsoneditor.css";
import "./jsoneditor.css";

import { JSONEditorOptions } from "jsoneditor";
// @ts-ignore
import JSONEditor from "jsoneditor/dist/jsoneditor-minimalist.js";
import { useEffect, useRef } from "react";

type JsonEditorReactProps = {
  json: Record<string, any>;
  schema?: object;
  jsoneditorOptions: JSONEditorOptions;
};
const JsonEditorReact = (props: JsonEditorReactProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const jsonEdRef = useRef<JSONEditor>();

  useEffect(() => {
    if (ref.current) {
      const je = new JSONEditor(ref.current, {
        ...props.jsoneditorOptions,
      });
      jsonEdRef.current = je;
      jsonEdRef.current.set(props.json);
      if (props.schema) {
        jsonEdRef.current.setSchema(props.schema);
      }
    }

    return () => {
      jsonEdRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    jsonEdRef.current?.update(props.json);
  }, [props.json]);

  useEffect(() => {
    jsonEdRef.current?.setMode(props.jsoneditorOptions.mode || "code");
  }, [props.jsoneditorOptions.mode]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={ref}
    />
  );
};

export default JsonEditorReact;
