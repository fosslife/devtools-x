import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Select,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { Monaco } from "../../Components/MonacoWrapper";

import { Params } from "./Params";

export type ParamType = { key: string; value: string; enabled: boolean };

export const IsolateTab = ({ t }: { t: number }) => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;
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

  // FIXME: Height is totally broken in responsive screens.
  const isSmallScreen = useMediaQuery("(min-height: 850px)");

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
    <Flex gap={3} direction="column" w="100%" h="100%">
      <Flex w="100%" gap={4}>
        <Flex flex={"1"}>
          <Select
            w={"36"}
            borderRightRadius="0"
            value={method}
            onChange={(e) => setMethod(e.target.value as Methods)}
          >
            {methods.map((m) => (
              <option value={m} key={m}>
                {m}
              </option>
            ))}
          </Select>
          <Input
            borderLeftRadius={0}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Flex>
        <Button colorScheme={"red"} onClick={makeRequest}>
          Send
        </Button>
      </Flex>
      <Flex h="100%" w="100%" direction={"column"} gap="2">
        <Flex>
          <Tabs h="100%" w="100%">
            <TabList>
              <Tab>Params</Tab>
              <Tab>Headers</Tab>
              <Tab>Authorization</Tab>
              <Tab>Body</Tab>
            </TabList>

            {/* FIXME: should not in pixels */}
            <TabPanels h={"150px"} overflow={"scroll"}>
              <TabPanel h="100%">
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
              </TabPanel>
              <TabPanel>
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
              </TabPanel>
              <TabPanel>
                <p>authorization!</p>
              </TabPanel>
              <TabPanel>
                <p>body!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>

        {/* TODO: make draggable */}
        <Divider my={2} cursor={"ns-resize"} />
        <Flex
          h={"50vh"}
          w="100%"
          overflow="auto"
          justify={"stretch"}
          flexDir="column"
          align="tr"
        >
          <Text unselectable={"on"} style={{ userSelect: "none" }}>
            Response {respText}
          </Text>
          {response.data && (
            <Tabs h="100%">
              <TabList>
                <Tab>Response</Tab>
                <Tab>Headers</Tab>
              </TabList>

              <TabPanels h="100%">
                <TabPanel h="100%">
                  <Monaco
                    language="json"
                    value={JSON.stringify(response.data, null, 2)}
                  />
                </TabPanel>
                <TabPanel>
                  <Table variant={"striped"} size="sm">
                    <Tbody>
                      {Object.entries(response.headers).map(
                        ([key, value]: any) => {
                          return (
                            <Tr key={key}>
                              <Td>{key}</Td>
                              <Td>{value}</Td>
                            </Tr>
                          );
                        }
                      )}
                    </Tbody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Flex>

        {/* =========== RESPONSE */}
      </Flex>
    </Flex>
  );
};
