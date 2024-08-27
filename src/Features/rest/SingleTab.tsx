import {
  Box,
  Button,
  Divider,
  Group,
  NativeSelect,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

import { Monaco } from "@/Components/MonacoWrapper";
import { Params } from "./Params";

export type ParamType = { key: string; value: string; enabled: boolean };

export const SingleTab = ({ t }: { t: number }) => {
  const methods = [
    "GET",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "POST",
    "PUT",
    "PATCH",
  ] as const;

  type Methods = (typeof methods)[number];

  const [method, setMethod] = useState<Methods>("GET");
  const [url, setUrl] = useState<string>(
    `https://jsonplaceholder.typicode.com/users/${t}`
  );
  const [params, setParams] = useState<ParamType[]>([
    { key: "", value: "", enabled: true },
  ]);
  const [headers, setHeaders] = useState<ParamType[]>([
    { key: "", value: "", enabled: true },
  ]);
  const [statusText, setStatusText] = useState<string>("");
  const [response, setResponse] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  function parseKV(arr: ParamType[]) {
    return arr
      .filter((e) => e.enabled)
      .reduce(
        (acc, curr) => (curr.key ? { ...acc, [curr.key]: curr.value } : acc),
        {}
      );
  }

  const makeRequest = async () => {
    setResponse(null);
    setError(null);
    const paramsCopy = [...params];
    const headersCopy = [...headers];
    const t1 = performance.now();

    const res = await fetch(url, {
      method,
      headers: parseKV(headersCopy),
      body: !["GET", "HEAD"].includes(method)
        ? JSON.stringify(parseKV(paramsCopy))
        : undefined,
    }).catch((e) => setError(e.message));

    try {
      const t2 = performance.now();
      if (res) {
        console.debug(res); // Keeping for dbg
        if (method === "HEAD") {
          setStatusText(`${res.status} - ${res.statusText || res.ok}`);
          setResponse({ headers: Object.fromEntries(res.headers), body: {} });

          return;
        }
        setStatusText(
          `${res.status} - ${res.statusText}  Time: ${(t2 - t1).toFixed(2)}ms`
        );
        setResponse({
          body: await res.json(),
          headers: Object.fromEntries(res.headers),
        });
      }
    } catch (e) {
      console.error(e);
      setError((e as Error).message);
    }
  };

  return (
    <Stack style={{ width: "100%" }} mt="sm">
      <Group gap={10}>
        <NativeSelect
          style={{ width: "15%" }}
          data={methods.map((m) => ({ value: m, label: m }))}
          value={method}
          onChange={(e) => setMethod(e.currentTarget.value as Methods)}
        ></NativeSelect>
        <TextInput
          style={{ flex: 1 }}
          size="sm"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
        <Button onClick={makeRequest} size="sm">
          Send
        </Button>
      </Group>
      {/* Bottom panels */}
      <Stack>
        {/* Request configuration */}
        <Group align="start" grow>
          <Tabs defaultValue={"params"} variant="outline">
            <Tabs.List>
              <Tabs.Tab value="params">Params</Tabs.Tab>
              <Tabs.Tab value="headers">Headers</Tabs.Tab>
              <Tabs.Tab value="body">Body</Tabs.Tab>
            </Tabs.List>

            <Box style={{ height: "200px", overflow: "auto" }}>
              <Tabs.Panel value="params">
                {/* ============= PARAMS ========== */}
                {params.length === 0 ? (
                  <Button
                    onClick={() =>
                      setParams([{ key: "", value: "", enabled: true }])
                    }
                  >
                    Add Param
                  </Button>
                ) : (
                  <Params params={params} setParams={setParams} />
                )}
              </Tabs.Panel>
              <Tabs.Panel value="headers">
                {headers.length === 0 ? (
                  <Button
                    onClick={() =>
                      setHeaders([{ key: "", value: "", enabled: true }])
                    }
                  >
                    Add Headers
                  </Button>
                ) : (
                  <Params params={headers} setParams={setHeaders} />
                )}
              </Tabs.Panel>
              <Tabs.Panel value="body" style={{ height: "100%" }}>
                <Monaco language="json" />
              </Tabs.Panel>
            </Box>
          </Tabs>
        </Group>

        {/* TODO: make draggable? */}
        <Divider />
        <Stack>
          {statusText && <Text c="dimmed">{statusText}</Text>}
          {response?.body && (
            <Tabs defaultValue={"response"} variant="outline">
              <Tabs.List>
                <Tabs.Tab value="response">Response</Tabs.Tab>
                <Tabs.Tab value="headers">Headers</Tabs.Tab>
              </Tabs.List>

              {/* FIXME: If possible fix the Pixels hardcoding.  */}
              <Box style={{ height: "404px", overflow: "auto" }}>
                <Tabs.Panel value="response" style={{ height: "100%" }}>
                  <Monaco
                    height="100%"
                    options={{
                      automaticLayout: true,
                    }}
                    language="json"
                    value={JSON.stringify(response.body, null, 2)}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="headers">
                  <Table striped>
                    <Table.Tbody>
                      {Object.entries(response.headers as any).map(
                        ([key, value]: any) => {
                          return (
                            <Table.Tr key={key}>
                              <Table.Td>{key}</Table.Td>
                              <Table.Td>{value}</Table.Td>
                            </Table.Tr>
                          );
                        }
                      )}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>
              </Box>
            </Tabs>
          )}
          {error && <Text c="red">{error}</Text>}
        </Stack>
      </Stack>
    </Stack>
  );
};
