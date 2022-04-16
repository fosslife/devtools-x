import { Flex } from "@chakra-ui/react";
import sqlFormatter from "@sqltools/formatter";
import { useState } from "react";
import AceEditor from "react-ace";

const Sql = () => {
  const [formatted, setFormatted] = useState("");

  return (
    <Flex h="full" w="100%" gap={3} alignSelf={"start"} flexDir="column">
      <AceEditor
        theme="dracula"
        width="100%"
        fontSize={"16px"}
        mode="sql"
        placeholder="Paste original SQL"
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
      <AceEditor
        value={formatted}
        readOnly
        theme="dracula"
        width="100%"
        fontSize={"16px"}
        mode="sql"
      />
    </Flex>
  );
};

export default Sql;
