import "./pastebin.css";
import "./dracula-prism.css";

import { Button, Flex, Select } from "@chakra-ui/react";
import Prism, { Grammar } from "prismjs";
import { languages } from "prismjs";
import { useState } from "react";
// Editor
import Editor from "react-simple-code-editor";

const hightlightWithLineNumbers = (
  input: string,
  grammar: Grammar,
  language: string
) =>
  Prism.highlight(input, grammar, language)
    .split("\n")
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join("\n");

function Pastebin() {
  const [codeValue, setCodeValue] = useState(`function test(){
  return "string";
}
  `);
  return (
    <Flex
      h="full"
      w="100%"
      gap={6}
      alignSelf={"start"}
      flexDirection={"column"}
      p={2}
    >
      <Select placeholder="Select provider">
        <option value="pastebin">Pastebin</option>
      </Select>
      <Editor
        value={codeValue}
        onValueChange={(code) => setCodeValue(code)}
        highlight={(code) =>
          hightlightWithLineNumbers(code, languages.go, "go")
        }
        padding={10}
        textareaId="codeArea"
        className="editor"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 16,
        }}
      />
      <Button
        onClick={() => {
          //
        }}
      >
        Create Paste
      </Button>
    </Flex>
  );
}

export default Pastebin;

// Pastebin API: https://pastebin.com/doc_api
// POST: https://pastebin.com/api/api_post.php
//   api_dev_key:         c3N79MMZbVY1IghaNpo61sYavJMAW8p6
//   api_paste_code:      any text
// Shouldn't support:
//   api_paste_private    = '1'; // 0=public 1=unlisted 2=private
//   api_paste_expire_date 		= '10M';
