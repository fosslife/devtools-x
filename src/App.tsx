import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Welcome } from "./Components/Welcome";
import { Hash } from "./Features/hash/Hash";
import { JsonFormatter } from "./Features/Json/JsonFormatter";
import { Random } from "./Features/random/Random";
import { Navbar } from "./Layout/Navbar";
import { db } from "./utils";

function App() {
  useEffect(() => {
    // TODO: Setup logging, caching
    // first config structure
    if (!db.data) {
      db.data ||= { json: { editor: "", diff: "" }, hash: { editor: "" } };
      db.write();
    }
  }, []);
  return (
    <Flex h="full" justifyContent={"flex-start"}>
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
        </Routes>
      </Flex>
    </Flex>
  );
}

export default App;
