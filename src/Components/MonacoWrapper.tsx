import Editor, {
  DiffEditor,
  DiffOnMount,
  OnMount,
  EditorProps,
} from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useAppContext } from "@/Contexts/AppContextProvider";
import { themes } from "@/Layout/themes";

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
} & EditorProps;

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
  ...rest
}: MonacoProps) => {
  const { config } = useAppContext();

  const dark = themes.find((t) => t.value === config.editorThemeDark)!;
  const light = themes.find((t) => t.value === config.editorThemeLight)!;

  const applyTheme = (
    monaco: typeof import("monaco-editor/esm/vs/editor/editor.api"),
    theme: { value: string; label: string }
  ) => {
    // hardcoding the path is fine since it's a static import.
    import(`../../node_modules/monaco-themes/themes/${theme.label}.json`)
      .then((data) => {
        const name = theme.value ?? "tomorrow-night";
        monaco.editor.defineTheme(name, data);
        monaco.editor.setTheme(name);
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  const diffOnMount: DiffOnMount = (editor, monaco) => {
    // disable TS incorrect diagnostic
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    applyTheme(monaco, dark);

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

    // Theme command
    editor.addAction({
      id: "change-theme-dark",
      label: "Dark Theme",
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD
        ),
      ],
      contextMenuOrder: -1,
      run: function () {
        applyTheme(monaco, dark);
      },
    });

    editor.addAction({
      id: "change-theme-light",
      label: "Light Theme",
      keybindings: [
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL
        ),
      ],
      contextMenuOrder: -1,
      run: function () {
        applyTheme(monaco, light);
      },
    });

    applyTheme(monaco, dark);

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
      value={value}
      onChange={setValue}
      language={language}
      onMount={onMount}
      height={height}
      width={width}
      options={{
        automaticLayout: true,
        fontSize: 12,
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        wordWrap: "on",
        minimap: {
          enabled: false,
        },
        lineNumbersMinChars: 3,
        ...extraOptions,
      }}
      {...rest}
    />
  );
};
