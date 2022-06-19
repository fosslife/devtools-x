import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";

type MonacoProps = {
  value?: string;
  setValue?: (e: string | undefined) => void;
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

    import("monaco-themes/themes/Dracula.json").then((data: any) => {
      monaco.editor.defineTheme("dracula", data);
      monaco.editor.setTheme("dracula");
    });

    if (onEditorMounted) {
      onEditorMounted(editor, monaco);
    }
  };

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
        ...extraOptions,
        minimap: {
          enabled: false,
        },
        lineNumbersMinChars: 3,
      }}
    />
  );
};
