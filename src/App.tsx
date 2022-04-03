import { Flex } from "@chakra-ui/react";
import loadable from "@loadable/component";
import { loader } from "@monaco-editor/react";
import { config } from "ace-builds";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Pastebin from "./Features/pastebin/Pastebin";
import { Navbar } from "./Layout/Navbar";
import { db } from "./utils";

// Lazy load components
const Welcome = loadable(() => import("./Components/Welcome"));
const Hash = loadable(() => import("./Features/hash/Hash"));
const JsonFormatter = loadable(() => import("./Features/Json/JsonFormatter"));
const Random = loadable(() => import("./Features/random/Random"));
const JWT = loadable(() => import("./Features/jwt/JWT"));
const Nums = loadable(() => import("./Features/nums/Nums"));
const Sql = loadable(() => import("./Features/Sql/Sql"));
const Colors = loadable(() => import("./Features/colors/Colors"));
const RegexTester = loadable(() => import("./Features/Regex/RegexTester"));
const TextDiff = loadable(() => import("./Features/text/TextDiff"));
const Markdown = loadable(() => import("./Features/Markdown/Markdown"));
const YamlJson = loadable(() => import("./Features/YamlJson/Yaml"));

function App() {
  useEffect(() => {
    // monaco loader setup
    if (process.env.NODE_ENV === "production") {
      loader.config({ paths: { vs: "/vs" } });
    }

    // Ace setup: https://github.com/securingsincity/react-ace/issues/725#issuecomment-629068872
    config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/"
    );
    config.setModuleUrl(
      "ace/mode/javascript_worker",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js"
    );

    // TODO: Setup logging, caching
    // first config structure
    if (!db.data) {
      db.data ||= { json: { editor: "", diff: "" }, hash: { editor: "" } };
      db.write();
    }
  }, []);
  return (
    <Flex h="full" justifyContent={"flex-start"} bg="gray.800">
      <Navbar />
      <Flex
        p="2"
        h="full"
        flexDirection={"column"}
        alignItems={"center"}
        flex="1"
      >
        <Routes>
          <Route path="/" element={<Welcome />}></Route>
          <Route path="/json-formatter" element={<JsonFormatter />}></Route>
          <Route path="/hash" element={<Hash />}></Route>
          <Route path="/random" element={<Random />}></Route>
          <Route path="/jwt" element={<JWT />}></Route>
          <Route path="/nums" element={<Nums />}></Route>
          <Route path="/sql" element={<Sql />}></Route>
          <Route path="/colors" element={<Colors />}></Route>
          <Route path="/regex" element={<RegexTester />}></Route>
          <Route path="/text" element={<TextDiff />}></Route>
          <Route path="/markdown" element={<Markdown />}></Route>
          <Route path="/yamljson" element={<YamlJson />}></Route>
          <Route path="/pastebin" element={<Pastebin />}></Route>
        </Routes>
      </Flex>
    </Flex>
  );
}

export default App;
