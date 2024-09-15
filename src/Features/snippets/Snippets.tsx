import { Flex } from "@mantine/core";
import {
  findAllSnippets,
  getSnippetById,
  listSnippets,
  seedDatabase,
  updateSnippet,
} from "@/utils/database";
import { useEffect, useState } from "react";
import styles from "./Snippets.module.css";
import { Monaco } from "@/Components/MonacoWrapper";

type SideBar = {
  tags?: string[];
  search?: string;
  parent_id?: number;
  fields?: string[];
};
const Snippets = () => {
  const [snippetId, setSnippetId] = useState<number | null>(null);
  const [snippet, setSnippet] = useState<any | null>(null);

  const [snippets, setSnippets] = useState<any[]>([]);
  const [sidebar] = useState<SideBar>({
    fields: ["id", "name", "path", "filetype", "parent_id"],
  });
  // "content"

  useEffect(() => {
    listSnippets(sidebar).then((r) => {
      setSnippets(r as any);
    });
  }, [...Object.values(sidebar)]);

  const loadSnippet = async (id: number) => {
    setSnippetId(id);
    await getSnippetById(id).then((r) => {
      setSnippet(r as any);
    });
  };

  const onChange = async (content: string) => {
    setSnippet((prev: any) => ({ ...prev, content }));
    await updateSnippet({ ...snippet, content, id: snippet.id });
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
    <Flex
      style={{
        height: "100%",
      }}
      justify={"between"}
      align={"start"}
    >
      <aside className={styles.sidebar}>
        <ul className={styles.ul}>
          {snippets.map((snippet) => (
            <li
              key={snippet.id}
              className={
                (styles.li, snippet.id === snippetId ? styles.active : "")
              }
            >
              <button
                onClick={() => loadSnippet(snippet.id)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await loadSnippet(snippet.id);
                  }
                }}
              >
                {snippet.name} - {snippet.path}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => seed()}>Seed Database</button>
      </aside>
      <div className={styles.content}>
        <Monaco
          language={snippet?.filetype ?? "javascript"}
          value={snippet?.content ?? ""}
          onChange={onChange as any}
          height="500px"
        />
        <pre>{JSON.stringify(snippet, null, 2)}</pre>
      </div>
    </Flex>
  );
};

export default Snippets;
