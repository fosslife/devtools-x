import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";

import { IsolateTab } from "./IsolateTab";
// import { db } from "../../utils"; FIXME:

const JsonFormatter = () => {
  const [tabs, setTabs] = useState([1, 2]);
  // Note: this controlls the selecting newly created tab on + click
  const [tidx, setTidx] = useState(0);

  return (
    <Flex w="100%" h="100%" gap={3} flexDir="column" pl="2">
      <Heading>Json Tools</Heading>
      <Tabs
        height={"100%"}
        isLazy
        index={tidx}
        onChange={(i) => setTidx(i)}
        lazyBehavior="keepMounted"
      >
        <TabList>
          {tabs.map((t) => (
            <Tab key={t}>{t}</Tab>
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
            <TabPanel key={t} height={"100%"}>
              <IsolateTab t={t} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

/* TODO:
Save editors in storage on change - p1
fix formatting - instead of default values get editor text - p1
*/

export default JsonFormatter;
