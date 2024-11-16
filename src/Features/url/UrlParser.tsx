import {
  Button,
  Divider,
  Group,
  Stack,
  Table,
  TextInput,
  Textarea,
} from "@mantine/core";
import { FormEventHandler, useState } from "react";

const sampleUrlWithQueryparams =
  "https://www.example.com:8080?name=John&age=30&city=NewYork&country=USA&hobbies=reading&hobbies=swimming&hobbies=movies";

export default function UrlParser() {
  const [url, setUrl] = useState(sampleUrlWithQueryparams);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(url.split("?")[1])
  );
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!key || !value) return;
    searchParams.append(key, value);
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
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group wrap="nowrap" align="start" justify="space-between" h="100%">
          <Textarea
            w={"50%"}
            autosize
            minRows={30}
            placeholder={sampleUrlWithQueryparams}
            value={url}
            onChange={(e) => {
              setUrl(e.currentTarget.value);
              setSearchParams(
                new URLSearchParams(e.currentTarget.value.split("?")[1])
              );
            }}
          />
          <Stack w="50%" px="xs" gap="xl">
            <Table withTableBorder striped>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>hostname</Table.Td>
                  <Table.Td>{new URL(url).hostname}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>pathname</Table.Td>
                  <Table.Td>{new URL(url).pathname}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>port</Table.Td>
                  <Table.Td>{new URL(url).port}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>protocol</Table.Td>
                  <Table.Td>{new URL(url).protocol}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Divider />
            <Table w="100%" withColumnBorders striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Key</Table.Th>
                  <Table.Th>Value</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {[...new Set(searchParams.keys())].map((key, i) => (
                  <Table.Tr key={key + i}>
                    <Table.Td>{key}</Table.Td>
                    <Table.Td>{searchParams.getAll(key).join(", ")}</Table.Td>
                  </Table.Tr>
                ))}
                <Table.Tr>
                  <Table.Td>
                    <TextInput
                      autoComplete="off"
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
                      autoComplete="off"
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
              style={{
                alignSelf: "flex-end",
              }}
              type="submit"
            >
              Add
            </Button>
          </Stack>
        </Group>
      </Stack>
    </form>
  );
}
