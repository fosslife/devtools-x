import { Button, Stack, Tabs } from "@mantine/core";
import { useState } from "react";

import { SingleTab } from "./SingleTab";

const Rest = () => {
  const [tabs, setTabs] = useState([1, 2]);
  // Note: this controlls the selecting newly created tab on + click
  const [activeTab, setActiveTab] = useState<string | null>("1");

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          {tabs.map((t) => (
            <Tabs.Tab
              value={t.toString()}
              key={t}
              onMouseDown={async (e) => {
                if (e.button === 1) {
                  // const tabid = tabs.find((el) => el === t);
                  setTabs(tabs.filter((e) => e !== t));
                }
              }}
            >
              {t}
            </Tabs.Tab>
          ))}
          <Button
            ml="xs"
            size="xs"
            onClick={async () => {
              const lastTabid = tabs[tabs.length - 1];
              tabs.push(lastTabid + 1);
              setTabs([...tabs]);
              setActiveTab((lastTabid + 1).toString());
            }}
          >
            +
          </Button>
        </Tabs.List>

        {tabs.map((t) => (
          <Tabs.Panel key={t} value={t.toString()}>
            <SingleTab key={t} t={t} />
          </Tabs.Panel>
        ))}
        <Tabs.Panel value="+">
          <Button mt="lg">Add a new Tab</Button>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Rest;
