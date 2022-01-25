import { Flex, Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { Welcome } from "./Components/Welcome";
import { Navbar } from "./Layout/Navbar";

function App() {
  return (
    <Flex h="full" justifyContent={"flex-start"}>
      <Navbar />
      <Box flex="1">
        <Routes>
          <Route path="/" element={<Welcome />}></Route>
        </Routes>
      </Box>
    </Flex>
  );
}

export default App;
