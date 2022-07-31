import { Box, Button, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";

import { SingleTab } from "./SingleTab";
import { db } from "../../utils";
import { useDebouncedCallback } from "../../utils/useDebouceCallback";

// default state
const def = {
  array: [1, 2, 3],
  boolean: true,
  color: "gold",
  null: null,
  number: 123,
  object: {
    a: "b",
    c: "d",
  },
  string: "Hello World",
};

const JsonFormatter = () => {
  const [tabs, setTabs] = useState<{ tab: number; data: any }[]>([
    { tab: 1, data: { tab: 1, ...def } },
    { tab: 2, data: { tab: 2, ...def } },
  ]);
  const [activeTab, setActiveTab] = useState<string | null>("1");

  useEffect(() => {
    const { tabsstate } = db.data.jsoneditor;
    const saved = Object.keys(tabsstate);

    if (saved.length > 0) {
      setTabs(saved.map((e) => ({ tab: Number(e), data: tabsstate[e] })));
      setActiveTab(saved[0]);
    }
  }, []);

  const handleTabChange = useDebouncedCallback(
    async (e: string = "", t: any) => {
      let isJson;
      try {
        isJson = JSON.parse(e);
      } catch {
        isJson = e;
      }

      db.data.jsoneditor.tabsstate[t] = isJson;
      await db.write();
    },
    500,
    []
  );

  return (
    <Box style={{ width: "100%" }}>
      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        sx={() => ({
          "div[role='tabpanel']": {
            height: "85vh",
          },
        })}
      >
        <Tabs.List>
          {tabs.map((t) => (
            <Tabs.Tab
              key={t.tab}
              value={t.tab.toString()}
              onMouseDown={async (e) => {
                if (e.button === 1) {
                  const tabid = tabs.find((el) => el.tab === t.tab);
                  console.log("closing", tabid);
                  if (tabid) delete db.data.jsoneditor.tabsstate[tabid.tab];
                  setTabs(tabs.filter((e) => e.tab !== t.tab));
                  await db.write();
                }
              }}
            >
              {t.tab}
            </Tabs.Tab>
          ))}

          <Button
            ml="xs"
            size="xs"
            onClick={async () => {
              const lastTabid = tabs[tabs.length - 1].tab;
              tabs.push({
                tab: lastTabid + 1,
                data: { tab: lastTabid + 1, ...def },
              });
              setTabs([...tabs]);
              setActiveTab((lastTabid + 1).toString());
              db.data.jsoneditor.tabsstate[lastTabid + 1] = {
                tab: lastTabid + 1,
                ...def,
              }; // save this new tab to db
              await db.write();
            }}
          >
            +
          </Button>
        </Tabs.List>

        {tabs.map((t) => (
          <Tabs.Panel key={t.tab} value={t.tab.toString()}>
            <SingleTab
              key={t.tab}
              tabid={t.tab}
              tabdata={JSON.stringify(t.data, null, 2)}
              onChange={handleTabChange}
            />
          </Tabs.Panel>
        ))}
        <Tabs.Panel value="+">
          <Button mt="lg">Add a new Tab</Button>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default JsonFormatter;
