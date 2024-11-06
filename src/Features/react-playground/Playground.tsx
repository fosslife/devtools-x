import { Group, Stack } from "@mantine/core";
import { LivePreview, LiveProvider, LiveError, LiveEditor } from "react-live";

const boilerplate = `
// Syntax highlighting works. autocompletion doesn't work.
// access to entire \`React\` is auto injected. 

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h4>Counter: {count}</h4>
      <button onClick={() => setCount(count + 1)}>add1</button>
    </div>
  );
}


`;

function Playground() {
  return (
    <Stack
      style={{
        height: "100%",
        overflow: "auto",
      }}
    >
      <Group style={{ height: "100%", width: "100%" }} wrap="nowrap">
        <LiveProvider code={boilerplate} enableTypeScript>
          <LiveEditor style={{ width: "50%", height: "100%" }} />
          <Stack align="start" h="100%" w="50%">
            {" "}
            <LiveError
              style={{
                color: "red",
              }}
            />
            <LivePreview
              style={{
                width: "50%",
                color: "white",
                padding: 15,
                height: "100%",
              }}
            />
          </Stack>
        </LiveProvider>
      </Group>
    </Stack>
  );
}

export default Playground;
