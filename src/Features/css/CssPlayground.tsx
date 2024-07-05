import { Box, Group, Stack } from "@mantine/core";
import { Monaco } from "../../Components/MonacoWrapper";
import { useState } from "react";

const htmlBoilerplate = `
    <div id="red">Hello World</div>
    <div class="blue">Hello World</div>
    <h4 class="blue">Counter: 0</h4>
`;

const cssBoilerplate = `
    #red {
        color: red;
    }
    .blue {
        background-color: white;
        color: blue;
    }
`;

export default function CssPlayground() {
  const [css, setCss] = useState(cssBoilerplate);
  const [html, setHtml] = useState(htmlBoilerplate);

  return (
    <Group h="100%" wrap="nowrap" align="start">
      <Stack h="100%" w={"50%"}>
        <Monaco
          language="html"
          width="100%"
          height="50%"
          value={html}
          setValue={(e) => setHtml(e || "")}
        />
        <Monaco
          language="css"
          width="100%"
          height="50%"
          value={css}
          setValue={(e) => setCss(e || "")}
        />
      </Stack>
      {/* <Divider orientation="vertical" /> */}
      <Box
        dangerouslySetInnerHTML={{
          __html: `${html}<style>${css}</style>`,
        }}
      ></Box>
    </Group>
  );
}
