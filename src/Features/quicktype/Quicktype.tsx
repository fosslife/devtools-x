import { Button, createStyles, Group, Stack, Textarea } from "@mantine/core";
// import {  } from "quicktype";
import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

const useStyles = createStyles((theme) => ({
  leftBar: {
    position: "fixed",
    left: 0,
    top: 0,
    backgroundColor: "red",
  },
  parent: {
    height: "100%",
    width: "100%",
  },
}));

export default function Quicktype() {
  const { classes } = useStyles();
  const [op, setOp] = useState("");

  return (
    <Stack>
      <Group className={classes.parent}>
        <Stack sx={{ height: "100%", width: "100%" }}>
          <Button>Well</Button>
          <Group noWrap sx={{ height: "100%", width: "100%" }}>
            <Textarea
              styles={{
                wrapper: {
                  height: "100%",
                  textarea: {
                    height: "100%",
                  },
                },
              }}
              sx={{ height: "100%", width: "25%" }}
              onChange={async (e) => {
                try {
                  const jsonInput = jsonInputForTargetLanguage("rust");
                  await jsonInput.addSource({
                    name: "Person",
                    samples: [e.target.value],
                  });
                  const inputData = new InputData();
                  inputData.addInput(jsonInput);

                  const o = await quicktype({
                    inputData,
                    lang: "rust",
                  });
                  console.log("I", o);
                  setOp(o.lines.join("\r\n"));
                } catch (e) {
                  //   console.error(e);
                  setOp("// invalid input json");
                }
              }}
            />
            <Monaco
              height="100%"
              width="75%"
              language="rust"
              value={op}
              extraOptions={{
                readOnly: true,
              }}
            />
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
}
