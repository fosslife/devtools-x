import classes from "./styles.module.css";

import {
  Button,
  Group,
  JsonInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import FakerInput from "./FakerInput"
import { useState } from "react";
import { faker } from "@faker-js/faker";
import { Monaco } from "../../Components/MonacoWrapper";

const formats = [
  { format: "json", label: "JSON" },
  { format: "sql", label: "SQL" },
];

const generateRandomData = (categoryName: string, subsetName: string): any => {
  if ((faker as any)[categoryName] && typeof (faker as any)[categoryName][subsetName] === 'function') {
    return (faker as any)[categoryName][subsetName]();
  } else {
    throw new Error(`Invalid category or subset: ${categoryName}.${subsetName}`);
  }
};

interface Field {
  fieldName: string,
  category: string,
  dataType: string,
  expression?: {},
}

export default function Faker() {
  const [lang, setLang] = useState<string | null>("json");

  const calcOP = async (e: string) => { };


  return (
    <Stack h="100%">
      <Group className={classes.parent}>
        <Stack style={{ height: "100%", width: "100%" }}>
          <Group>
            {" "}
            <Select
              value={lang}
              allowDeselect={false}
              onChange={setLang}
              data={formats.map((l) => ({
                value: l.format,
                label: l.label,
              }))}
            />
            <Button onClick={() => calcOP('')}>Generate</Button>
          </Group>
          <Group wrap="nowrap" style={{ height: "100%", width: "100%" }}>
            <Stack justify="flex-start" h="100%">
              <FakerInput />
            </Stack>
            <Monaco
              height="100%"
              width="55%"
              language={
                formats.find((l) => l.format === lang)?.format || "text"
              }
              value={'{}'}
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

// todo: impl lang specific toggle options, sample above
