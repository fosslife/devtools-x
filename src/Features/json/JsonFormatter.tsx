import { Button, Stack, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";

import { db } from "../../utils";
import { useDebouncedCallback } from "../../utils/";
import { SingleTab } from "./SingleTab";

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
    async function getExistingTabs() {
      const existing = await db.get<any>("jsoneditor");
      console.log("existing", existing);
      if (existing) {
        const saved = Object.keys(existing);
        if (saved.length > 0) {
          setTabs(
            saved.map((e) => {
              try {
                return {
                  tab: Number(e),
                  data: JSON.parse(existing[e]),
                };
              } catch {
                return {
                  tab: Number(e),
                  data: existing[e],
                };
              }
            })
          );
          setActiveTab(saved[0]);
        }
      }
    }
    getExistingTabs();
  }, []);

  const handleTabChange = useDebouncedCallback(
    async (e: string = "", t: any) => {
      const existingtabs = await db.get<any>("jsoneditor");
      await db.set("jsoneditor", { ...existingtabs, [t]: e });
      await db.save();
    },
    500,
    []
  );

  return (
    <Stack style={{ height: "100%", width: "100%" }}>
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
                  const lastTabid = tabs[tabs.length - 1].tab;
                  let jsoneditor = await db.get<any>("jsoneditor");
                  if (tabid) {
                    delete jsoneditor[tabid.tab];
                    await db.set("jsoneditor", { ...jsoneditor });
                    await db.save();
                  }
                  setTabs(tabs.filter((e) => e.tab !== t.tab));
                  setActiveTab((lastTabid - 1).toString());
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
              if (!tabs.length) {
                setTabs([{ tab: 1, data: { tab: 1, ...def } }]);
                setActiveTab("1");
                return;
              }

              const lastTabid = tabs[tabs.length - 1].tab;
              tabs.push({
                tab: lastTabid + 1,
                data: { tab: lastTabid + 1, ...def },
              });
              setTabs([...tabs]);
              setActiveTab((lastTabid + 1).toString());
              const newTab = {
                tab: lastTabid + 1,
                ...def,
              };
              const currDbTabs = await db.get<any>("jsoneditor");
              await db.set("jsoneditor", {
                ...currDbTabs,
                [lastTabid + 1]: newTab,
              });
              await db.save();
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
              tabdata={
                typeof t.data === "object"
                  ? JSON.stringify(t.data, null, 2)
                  : t.data
              }
              onChange={handleTabChange}
            />
          </Tabs.Panel>
        ))}
        <Tabs.Panel value="+">
          <Button mt="lg">Add a new Tab</Button>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default JsonFormatter;
