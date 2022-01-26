import { Flex, Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { Welcome } from "./Components/Welcome";
import { JsonFormatter } from "./Features/Json/JsonFormatter";
import { Navbar } from "./Layout/Navbar";

function App() {
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
        </Routes>
      </Flex>
    </Flex>
  );
}

export default App;
