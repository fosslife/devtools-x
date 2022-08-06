import Editor, { DiffEditor, DiffOnMount, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";

type MonacoProps = {
  value?: string;
  setValue?: (e?: string) => void;
  extraOptions?: editor.IStandaloneDiffEditorConstructionOptions;
  height?: string;
  width?: string;
  onEditorMounted?: OnMount;
  onDiffEditorMounted?: DiffOnMount;
  language: string;
  mode?: "diff" | "regular";
  diffProps?: {
    original: string;
    modified: string;
    modifiedLanguage: string;
    originalLanguage: string;
  };
};

export const Monaco = ({
  value,
  setValue,
  height = "100%",
  width = "100%",
  extraOptions,
  onEditorMounted,
  language,
  mode,
  onDiffEditorMounted,
  diffProps,
}: MonacoProps) => {
  // FIXME: (Typescript); both onMount are exactly same, absolutely reusable;
  const diffOnMount: DiffOnMount = (editor, monaco) => {
    // disable TS incorrect diagnostic
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    import("monaco-themes/themes/Tomorrow-Night.json").then((data: any) => {
      monaco.editor.defineTheme("tmnight", data);
      monaco.editor.setTheme("tmnight");
    });

    if (onDiffEditorMounted) {
      onDiffEditorMounted(editor, monaco);
    }
  };
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
  if (mode === "diff") {
    return (
      <DiffEditor
        {...diffProps}
        onMount={diffOnMount}
        options={{ ...extraOptions }}
      />
    );
  }

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
