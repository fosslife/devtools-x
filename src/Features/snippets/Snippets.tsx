import { Button, Flex, Stack, Tabs, TextInput } from "@mantine/core";
import {
  findAllSnippets,
  getSnippetById,
  getSnippetFiles,
  getSnippetNotes,
  getSnippetTags,
  insertSnippetFile,
  listSnippets,
  seedDatabase,
  updateSnippetFile,
} from "@/utils/database";
import { useEffect, useState } from "react";
import styles from "./Snippets.module.css";
import type {
  Snippet,
  SnippetFile,
  SnippetNote,
  SnippetTag,
} from "@/types/snippets";
import { Monaco } from "@/Components/MonacoWrapper";

type SideBar = {
  tags?: string[];
  search?: string;
  fields?: string[];
};

type CombinedSnippet = {
  snippet: Snippet;
  files: SnippetFile[];
  notes: SnippetNote[];
  tags: SnippetTag[];
};
const Snippets = () => {
  const [activeIds, setActiveIds] = useState<{
    snippetId?: number;
    fileId?: number;
    noteId?: number;
  }>({});

  const activateId = (key: string, value: number) =>
    setActiveIds((prev) => ({ ...prev, [key]: value }));

  const [snippet, setSnippet] = useState<CombinedSnippet | null>(null);

  const [snippets, setSnippets] = useState<any[]>([]);
  const [sidebar] = useState<SideBar>({
    fields: ["id", "name", "path", "filetype"],
  });
  // "content"

  useEffect(() => {
    const load = () =>
      listSnippets(sidebar).then((r) => {
        console.log(r);
        setSnippets(r as any);
      });

    load().then(() => {});
  }, [...Object.values(sidebar)]);

  const loadSnippet = async (id: number) => {
    activateId("snippetId", id);
    const [snippet, files, notes, tags] = await Promise.all([
      getSnippetById(id),
      getSnippetFiles(id),
      getSnippetNotes(id),
      getSnippetTags(id),
    ]);

    if (!snippet) return;
    setSnippet({ snippet, files, notes, tags });
    setActiveIds({
      snippetId: id,
      fileId: files[0]?.id,
      noteId: notes[0]?.id,
    });
  };

  // Update current file
  const onChange = async (content: string) => {
    if (!snippet) return;
    if (!activeIds.fileId) return;
    const file = snippet.files.find((f) => f.id === activeIds.fileId);
    if (!file) return;
    await updateSnippetFile(file.id, { content });
    setSnippet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        files: prev.files.map((f) =>
          f.id === activeIds.fileId ? { ...f, content } : f
        ),
      };
    });
  };

  const addFile = async () => {
    if (!snippet) return;
    const newFile = {
      name: "Untitled",
      content: "",
      filetype: "js",
    };
    if (!activeIds.snippetId) return;
    const fileId = await insertSnippetFile(activeIds.snippetId, newFile);
    if (!fileId) return;
    setSnippet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        files: [...(prev?.files ?? []), { ...newFile, id: fileId }],
      } as CombinedSnippet;
    });
    setActiveIds((prev) => ({
      ...prev,
      fileId,
    }));
  };

  const seed = async () => {
    await seedDatabase();
    const data = await findAllSnippets().then((r) => {
      console.log(r);
      return r;
    });
    setSnippets(data as any);
  };

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <Flex
        style={{
          height: "100%",
        }}
        justify={"between"}
        align={"start"}
      >
        <aside className={styles.sidebar}>
          <div className={styles.header}>
            <TextInput placeholder="Search" variant="unstyled" />
          </div>

          <ul className={styles.ul}>
            {snippets.map((snippet) => (
              <li
                key={snippet.id}
                className={
                  (styles.li,
                  snippet.id && snippet.id === activeIds?.snippetId
                    ? styles.active
                    : "")
                }
              >
                <div
                  tabIndex={0}
                  role="button"
                  onClick={() => loadSnippet(snippet.id)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      await loadSnippet(snippet.id);
                    }
                  }}
                >
                  {snippet.name}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => seed()}>Seed Database</button>
        </aside>
        <div className={styles.content}>
          <Tabs
            value={activeIds?.fileId?.toString()}
            onChange={(fileId) =>
              setActiveIds((prev) => ({
                ...prev,
                fileId: parseInt(fileId as string),
              }))
            }
          >
            <Tabs.List>
              {snippet?.files?.map((t) => (
                <Tabs.Tab
                  value={t.id.toString()}
                  style={{ padding: "0.25em" }}
                  key={t.id}
                  onMouseDown={async (e) => {
                    if (e.button === 1) {
                      // const tabid = tabs.find((el) => el === t);
                      // setTabs(tabs.filter((e) => e !== t));
                      setActiveIds((prev) => ({
                        ...prev,
                        fileId: undefined,
                      }));
                    }
                  }}
                >
                  <TextInput
                    variant="unstyled"
                    className={styles.tabInput}
                    p={0}
                    value={
                      t.name ??
                      snippet?.snippet?.name ??
                      t.file_path ??
                      "Untitled"
                    }
                    onChange={(e) => {
                      setSnippet((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          files: prev.files.map((f) =>
                            f.id === t.id ? { ...f, name: e.target.value } : f
                          ),
                        };
                      });
                    }}
                  />
                </Tabs.Tab>
              ))}
              <Button ml="xs" size="xs" onClick={async () => addFile()}>
                +
              </Button>
            </Tabs.List>

            {snippet?.files?.map((file) => (
              <Tabs.Panel key={file.id} value={file.id.toString()}>
                <Monaco
                  language={file?.filetype ?? "javascript"}
                  value={file?.content ?? ""}
                  onChange={onChange as any}
                  height="500px"
                />
              </Tabs.Panel>
            ))}
            <Tabs.Panel value="+">
              <Button mt="lg">Add a new Tab</Button>
            </Tabs.Panel>
          </Tabs>
        </div>
      </Flex>
    </Stack>
  );
};

export default Snippets;
