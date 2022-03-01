import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import JsonEditorReact from "../../Components/JsonEditor";
// import { db } from "../../utils"; FIXME:

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

type Mode = "tree" | "code" | "text" | "form" | "view" | "preview";

const JsonFormatter = () => {
  const [code, setCode] = useState(def);
  const [mode, setMode] = useState<Mode>("code");

  return (
    <Flex w="100%" h="100%" gap={3} flexDir="column">
      <JsonEditorReact
        jsoneditorOptions={{
          mode: mode,
          modes: ["tree", "code", "text"],
          indentation: 4,
          onChangeJSON: setCode,
          onModeChange: setMode,
          theme: "ace/theme/dracula",
          navigationBar: true,
        }}
        json={code}
      />
    </Flex>
  );
};

/* TODO:
Save editors in storage on change - p1
fix formatting - instead of default values get editor text - p1
*/

export default JsonFormatter;
