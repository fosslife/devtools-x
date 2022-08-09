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
import axios, { AxiosResponse } from "axios";
import { useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";
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
    // "PURGE", FIXME: Enable these?
    // "LINK",
    // "UNLINK",
  ] as const;

  type Methods = typeof methods[number];

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

  const [respText, setRespText] = useState<string>("");
  const [response, setResponse] = useState<AxiosResponse>({
    config: {},
    data: null,
    headers: {},
    status: 1,
    statusText: "",
    request: "",
  });

  const makeRequest = async () => {
    function parseKV(arr: ParamType[]) {
      return arr
        .filter((e) => e.enabled)
        .reduce(
          (acc, curr) => (curr.key ? { ...acc, [curr.key]: curr.value } : acc),
          {}
        );
    }
    const paramsCopy = [...params];
    const headersCopy = [...headers];
    const t1 = performance.now();

    const res = await axios({
      method,
      url,
      headers: parseKV(headersCopy),
      params: parseKV(paramsCopy),
    });
    const t2 = performance.now();
    console.log(res); // Keeping for dbg
    setRespText(
      `${res.status} - ${res.statusText}  Time: ${(t2 - t1).toFixed(2)}ms`
    );
    setResponse(res);
  };

  return (
    <Stack sx={{ width: "100%" }} mt="sm">
      <Group spacing={10}>
        <NativeSelect
          placeholder="Method"
          sx={{ width: "15%" }}
          data={methods.map((m) => ({ value: m, label: m }))}
          value={method}
          onChange={(e) => setMethod(e.currentTarget.value as Methods)}
        ></NativeSelect>
        <TextInput
          sx={{ flex: 1 }}
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
          <Tabs defaultValue={"params"}>
            <Tabs.List>
              <Tabs.Tab value="params">Params</Tabs.Tab>
              <Tabs.Tab value="headers">Headers</Tabs.Tab>
              <Tabs.Tab value="body">Body</Tabs.Tab>
            </Tabs.List>

            <Box sx={{ height: "200px", overflow: "auto" }}>
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
              <Tabs.Panel value="body" sx={{ height: "100%" }}>
                <Monaco language="json" />
              </Tabs.Panel>
            </Box>
          </Tabs>
        </Group>

        {/* TODO: make draggable? */}
        <Divider />
        <Stack>
          {/* TODO: unselectable={"on"} style={{ userSelect: "none" }} */}
          <Text color={"dimmed"} size="xs">
            Response {respText}
          </Text>
          {response.data && (
            <Tabs defaultValue={"response"}>
              <Tabs.List>
                <Tabs.Tab value="response">Response</Tabs.Tab>
                <Tabs.Tab value="headers">Headers</Tabs.Tab>
              </Tabs.List>

              {/* FIXME: If possible fix the Pixels hardcoding.  */}
              <Box sx={{ height: "404px", overflow: "auto" }}>
                <Tabs.Panel value="response" sx={{ height: "100%" }}>
                  <Monaco
                    height="100%"
                    language="json"
                    value={JSON.stringify(response.data, null, 2)}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="headers">
                  <Table>
                    <tbody>
                      {Object.entries(response.headers).map(
                        ([key, value]: any) => {
                          return (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>{value}</td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                </Tabs.Panel>
              </Box>
            </Tabs>
          )}
        </Stack>

        {/* =========== RESPONSE */}
      </Stack>
    </Stack>
  );
};
