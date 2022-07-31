import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";

type MonacoProps = {
  value?: string;
  setValue?: (e?: string) => void;
  extraOptions?: editor.IStandaloneDiffEditorConstructionOptions;
  height?: string;
  width?: string;
  onEditorMounted?: OnMount;
  language: string;
};

export const Monaco = ({
  value,
  setValue,
  height = "100%",
  width = "100%",
  extraOptions,
  onEditorMounted,
  language,
}: MonacoProps) => {
  const onMount: OnMount = (editor, monaco) => {
    // disable TS incorrect diagnostic
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    import("monaco-themes/themes/Tomorrow-Night.json").then((data: any) => {
      monaco.editor.defineTheme("tmnight", data);
      monaco.editor.setTheme("tmnight");
    });

    if (onEditorMounted) {
      onEditorMounted(editor, monaco);
    }
  };
  // console.log("refres", value);

  return (
    <Editor
      theme="dracula"
      value={value}
      onChange={setValue}
      language={language}
      onMount={onMount}
      height={height}
      width={width}
      options={{
        minimap: {
          enabled: false,
        },
        lineNumbersMinChars: 3,
        ...extraOptions,
      }}
    />
  );
};
