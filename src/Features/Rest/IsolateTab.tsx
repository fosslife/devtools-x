import {
  Button,
  Divider,
  Flex,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Monaco } from "../../Components/MonacoWrapper";
import { Params } from "./Params";

export type ParamType = { key: string; value: string };

export const IsolateTab = ({ t }: { t: number }) => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;
  type Methods = typeof methods[number];
  const [method, setMethod] = useState<Methods>("GET");
  const [url, setUrl] = useState<string>(
    `https://jsonplaceholder.typicode.com/users/${t}`
  );
  const [params, setParams] = useState<ParamType[]>([{ key: "", value: "" }]);

  const [respText, setRespText] = useState<string>("");
  const [response, setResponse] = useState<any>("");

  const makeRequest = async () => {
    const copy = [...params];
    const t1 = performance.now();
    delete copy[copy.length - 1]; // The last empty one
    const res = await axios({
      method,
      url,
      params: copy.reduce(
        (acc, curr) => ({ ...acc, [curr.key]: curr.value }),
        {}
      ),
    });
    const t2 = performance.now();
    console.log(res);
    setRespText(
      `${res.status} - ${res.statusText}  Time: ${(t2 - t1).toFixed(2)}ms`
    );
    setResponse(JSON.stringify(res.data, null, 2));
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
        <Button onClick={makeRequest}>Send</Button>
      </Flex>
      <Flex h="100%" direction={"column"} gap="2">
        <Flex h="40%">
          <Tabs w="100%" height={"100%"}>
            <TabList>
              <Tab>Params</Tab>
              <Tab>Headers</Tab>
              <Tab>Authorization</Tab>
              <Tab>Body</Tab>
            </TabList>

            <TabPanels height={"80%"}>
              <TabPanel height={"100%"} overflow={"scroll"}>
                {/* ============= PARAMS ========== */}
                <Params params={params} setParams={setParams} />
              </TabPanel>
              <TabPanel>
                <p>headers!</p>
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
        <Divider />
        <Flex direction={"column"} height="50%" gap={2}>
          <Text>Response {respText}</Text>
          <Monaco language="json" value={response} />
        </Flex>
      </Flex>
    </Flex>
  );
};
