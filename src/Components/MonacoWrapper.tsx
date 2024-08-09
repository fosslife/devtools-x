import Editor, {
  DiffEditor,
  DiffOnMount,
  EditorProps,
  OnMount,
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

let inMemoryThemeCache: any = {};

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

  const applyTheme = (monaco: any, theme: { value: string; label: string }) => {
    // Importing it from `monaco-themes/themes/${theme.label}.json` gave all sorts of issues
    // so fallback to using the CDN is fine for now, but we should look into this later / improve caching
    const themeUrl = `https://cdn.jsdelivr.net/npm/monaco-themes@0.4.4/themes/${encodeURIComponent(theme.label)}.json`;

    if ((inMemoryThemeCache as any)[theme.label]) {
      monaco.editor.setTheme(theme.value);
      return;
    }

    fetch(themeUrl)
      .then(async (data: any) => {
        console.log(`monaco-themes/themes/${theme.label}.json`);
        const value = await data.json();
        const name = theme.value ?? "tomorrow-night";
        inMemoryThemeCache[theme.label] = value;
        monaco.editor.defineTheme(name, value);
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
