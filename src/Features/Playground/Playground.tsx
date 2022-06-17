import { Box, Flex, Heading } from "@chakra-ui/react";

import React, { useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { createRoot } from "react-dom/client";

import { Monaco } from "../../Components/MonacoWrapper";

const boilerplate = `

function App(){
    const [count, setCount] = useState(0);
    return <div>
        <h4>Counter: {count}</h4>
        <button onClick={() => setCount(count+1)}>Add 1</button>
    </div>
}

`;

function Playground() {
  return (
    <Flex
      h="full"
      w="100%"
      gap={6}
      alignSelf={"start"}
      flexDirection={"column"}
      p={2}
    >
      <Heading>Playground</Heading>
      <Flex height="100%" gap={5}>
        {/* <Monaco
          width="50%"
          value={code}
          setValue={handleCode}
          language="typescript"
          onEditorMounted={(editor, monaco) => {
            const root = createRoot(rootDiv.current);
            root.render(code);
          }}
        />
        <Box width="50%" bg="white" border="1px" ref={rootDiv}></Box> */}

        {/* <Sandpack
            template="react"
            theme={"dark"}
            files={{
              "/App.js": boilerplate,
            }}
          /> */}
      </Flex>
    </Flex>
  );
}

export default Playground;
