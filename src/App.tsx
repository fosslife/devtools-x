import { Flex } from "@chakra-ui/react";
import loadable from "@loadable/component";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// import { JWT } from "./Features/jwt/JWT";
import { Navbar } from "./Layout/Navbar";
import { db } from "./utils";

// Lazy load components
const Welcome = loadable(() => import("./Components/Welcome"));
const Hash = loadable(() => import("./Features/hash/Hash"));
const JsonFormatter = loadable(() => import("./Features/Json/JsonFormatter"));
const Random = loadable(() => import("./Features/random/Random"));
const JWT = loadable(() => import("./Features/jwt/JWT"));

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
          <Route path="/jwt" element={<JWT />}></Route>
        </Routes>
      </Flex>
    </Flex>
  );
}

export default App;
