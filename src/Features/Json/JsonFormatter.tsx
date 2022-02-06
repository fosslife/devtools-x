import { Button, Checkbox, Flex, Tooltip } from "@chakra-ui/react";
import Editor, {
  type DiffOnMount,
  type OnMount,
  DiffEditor,
} from "@monaco-editor/react";
import { useDebouncedCallback } from "@react-hookz/web/esm";
import { useRef, useState } from "react";

import { db } from "../../utils";

// default
const def = {
  array: [1, 2, 3],
  boolean: true,
  color: "gold",
  null: null,
  number: 123,
  object: {
    a: "b",
    c: "d",
  },
  string: "Hello World",
};

const JsonFormatter = () => {
  const editorRef = useRef<any>(null);
  const [diff, setDiff] = useState(false);

  const onChange = useDebouncedCallback(
    (e) => {
      try {
        db.data.json.editor = JSON.parse(e);
      } catch {
        db.data.json.editor = e;
      }
      db.write();
    },
    [],
    1000, // delay for debounce
    500 // maxwait ( call at least once every 500ms )
  );

  const onMount: OnMount = (editor, monaco) => {
    // console.log("Mounted", monaco);
    // minify command
    editor.addAction({
      id: "minify-json",
      label: "Minify json",
      //FIXME: keybindings not working
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM],
      // A precondition for this action.
      precondition: undefined,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: undefined,

      contextMenuGroupId: "navigation",

      contextMenuOrder: 1.5,
      run: function (ed: any) {
        ed.setValue(JSON.stringify(def));
      },
    });

    // ref
    editorRef.current = editor;
  };

  const diffOnMout: DiffOnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Flex
      w="full"
      h="full"
      gap={3}
      alignSelf={"start"}
      //thanks: https://stackoverflow.com/questions/54278276/improper-resizing-after-using-resize-bar
      sx={{
        "& div": {
          maxWidth: "98%",
        },
      }}
    >
      {diff ? (
        <DiffEditor
          options={{
            minimap: { enabled: false },
            originalEditable: true,
          }}
          theme="vs-dark"
          height={"95%"}
          // width={diff ? "95%" : "100%"}
          originalLanguage="json"
          modifiedLanguage="json"
          original={JSON.stringify(def, null, 2)}
          modified={JSON.stringify(def, null, 2)}
          onMount={diffOnMout}
        />
      ) : (
        <Editor
          //refer: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditorMinimapOptions.html
          options={{
            minimap: { enabled: false },
          }}
          defaultLanguage="json"
          theme="vs-dark"
          height={"95%"}
          // width={"99%"}
          defaultValue={JSON.stringify(def, null, 2)}
          onMount={onMount}
          onChange={onChange}
        />
      )}

      <Flex gap={5} mt={10} flexDirection={"column"}>
        <Tooltip label="calculate Diff" openDelay={500}>
          <Checkbox
            size={"sm"}
            onChange={() => {
              console.log("toggling");
              setDiff(!diff);
            }}
          >
            Diff
          </Checkbox>
        </Tooltip>
        {!diff && (
          <Tooltip label="Alt+Shift+F" openDelay={500}>
            <Button
              size={"sm"}
              onClick={() => {
                editorRef.current?.setValue(JSON.stringify(def, null, 2));
              }}
            >
              Format
            </Button>
          </Tooltip>
        )}

        {!diff && (
          <Tooltip label="Alt+Shift+M" openDelay={500}>
            <Button
              size={"sm"}
              onClick={() => {
                editorRef.current?.setValue(JSON.stringify(def));
              }}
            >
              Minify
            </Button>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  );
};

/* TODO:
Save editors in storage on change - p1
fix formatting - instead of default values get editor text - p1
*/

export default JsonFormatter;
