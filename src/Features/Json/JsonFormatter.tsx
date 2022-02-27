import { Button, Flex, Tooltip } from "@chakra-ui/react";
import { useDebouncedCallback } from "@react-hookz/web/esm";
import { useState } from "react";
import AceEditor from "react-ace";

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
  const [code, setCode] = useState(JSON.stringify(def, null, 2));

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

  return (
    <Flex w="100%" h="100%" gap={3} flexDir="column">
      <AceEditor
        width="100%"
        fontSize={"14px"}
        mode="json"
        theme="dracula"
        onChange={onChange}
        value={code}
        name="editor-json"
        editorProps={{ $blockScrolling: true }}
      />
      <Flex gap={5} mt={10}>
        <Tooltip label="Alt+Shift+F" openDelay={500}>
          <Button
            size={"sm"}
            onClick={() => {
              setCode(JSON.stringify(def, null, 2));
            }}
          >
            Format
          </Button>
        </Tooltip>

        <Tooltip label="Alt+Shift+M" openDelay={500}>
          <Button
            size={"sm"}
            onClick={() => {
              setCode(JSON.stringify(def));
            }}
          >
            Minify
          </Button>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

/* TODO:
Save editors in storage on change - p1
fix formatting - instead of default values get editor text - p1
*/

export default JsonFormatter;
