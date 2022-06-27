import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";

import { MdClose } from "react-icons/md";
import { IsolateTab } from "./IsolateTab";

const Rest = () => {
  const [tabs, setTabs] = useState([1, 2]);
  // Note: this controlls the selecting newly created tab on + click
  const [tidx, setTidx] = useState(0);

  return (
    <Flex h="full" w="100%" gap={3} p={1} alignSelf={"start"} flexDir="column">
      <Flex align={"end"} gap="4">
        <Heading size="sm">REST API</Heading>
        <Tooltip
          placement="right-start"
          label="This module doesn't revolve around
          &lsquo;correctness&rsquo; it's only meant for quick api testing"
        >
          <Text fontSize={12}>Note</Text>
        </Tooltip>
      </Flex>

      <Tabs
        height={"100%"}
        isLazy
        index={tidx}
        onChange={(i) => setTidx(i)}
        lazyBehavior="keepMounted"
      >
        <TabList>
          {tabs.map((t, i) => (
            <Tab key={t}>
              <Flex align={"center"} gap={4}>
                {" "}
                <Text fontSize={"md"}>{t}</Text>
                <Box
                  onClick={() => {
                    tabs.splice(i, 1);
                    setTabs([...tabs]);
                    setTidx(i === tabs.length ? i - 1 : i);
                  }}
                  width={"14px"}
                  borderRadius={5}
                  _hover={{
                    backgroundColor: "gray",
                  }}
                >
                  {/* TODO: on hover? */}
                  <Icon w="12px" h="12px" as={MdClose} />
                </Box>
              </Flex>
            </Tab>
          ))}
          <Button
            variant={"ghost"}
            onClick={() => {
              setTabs([...tabs, tabs.length + 1]);
              setTidx(tabs.length);
            }}
          >
            +
          </Button>
        </TabList>

        <TabPanels height={"95%"}>
          {tabs.map((t) => (
            <TabPanel key={t} height={"100%"} w="100%">
              <IsolateTab t={t} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Rest;
