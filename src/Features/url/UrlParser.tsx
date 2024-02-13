import {
  Button,
  Divider,
  Stack,
  Table,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useState } from "react";

const sampleUrlWithQueryparams =
  "https://www.example.com?name=John&age=30&city=NewYork&country=USA&hobbies=reading&hobbies=swimming&hobbies=movies";

export default function UrlParser() {
  const [url, setUrl] = useState(sampleUrlWithQueryparams);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(url.split("?")[1])
  );
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <Stack>
      <Textarea
        autosize
        minRows={4}
        placeholder={sampleUrlWithQueryparams}
        maxRows={10}
        value={url}
        onChange={(e) => {
          setUrl(e.currentTarget.value);
          setSearchParams(
            new URLSearchParams(e.currentTarget.value.split("?")[1])
          );
        }}
      />
      <Divider label="output" />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Key</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from(searchParams.keys()).map((key, i) => (
            <Table.Tr key={key + i}>
              <Table.Td>{key}</Table.Td>
              <Table.Td>{searchParams.get(key)}</Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td>
              <TextInput
                value={key}
                onChange={(e) => {
                  let key = e.currentTarget.value;
                  setKey(key);
                }}
                placeholder="Key"
              />
            </Table.Td>
            <Table.Td>
              <TextInput
                value={value}
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  setValue(value);
                }}
                placeholder="Value"
              />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <Button
        w="fit-content"
        onClick={() => {
          searchParams.set(key, value);
          setSearchParams(searchParams);
          setUrl(
            url.split("?")[0] +
              "?" +
              Array.from(searchParams)
                .map((x) => x.join("="))
                .join("&")
          );
          setKey("");
          setValue("");
        }}
      >
        Add new
      </Button>
    </Stack>
  );
}
