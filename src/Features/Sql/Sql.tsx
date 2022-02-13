import { Flex } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import sqlFormatter from "@sqltools/formatter";
import { useState } from "react";

const Sql = () => {
  const [formatted, setFormatted] = useState("");

  return (
    <Flex
      h="full"
      w="100%"
      gap={3}
      alignSelf={"start"}
      sx={{
        "& div": {
          maxWidth: "98%",
        },
      }}
    >
      <Editor
        options={{
          minimap: { enabled: false },
          contextmenu: false,
        }}
        defaultLanguage="sql"
        theme="vs-dark"
        height={"96%"}
        defaultValue={"Enter SQL"}
        onChange={(e) => {
          setFormatted(
            sqlFormatter.format(e || "", {
              language: "sql",
              indent: "\t", // TODO: take this from user?
              reservedWordCase: "upper",
            })
          );
        }}
      />
      <Editor
        options={{
          minimap: { enabled: false },
          readOnly: true,
          contextmenu: false,
        }}
        defaultLanguage="sql"
        theme="vs-dark"
        height={"96%"}
        value={formatted}
        onChange={(e) => {
          setFormatted(
            sqlFormatter.format(e || "", {
              language: "sql",
              indent: "\t", // TODO: take this from user?
              reservedWordCase: "upper",
            })
          );
        }}
      />
    </Flex>
  );
};

export default Sql;
