import {
  ActionIcon,
  Button,
  Group,
  Pagination,
  Stack,
  Table,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import Database from "@tauri-apps/plugin-sql";
import { Monaco } from "@/Components/MonacoWrapper";
import { useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { confirm } from "@tauri-apps/plugin-dialog";
import { notifications } from "@mantine/notifications";

interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  tags: string;
  note: string;
  created_at: string;
}

const Snippets = () => {
  const [db, setDb] = useState<Database | null>(null);
  const [activeTab, setActiveTab] = useState<string>("search");
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [id, setId] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleSave = async () => {
    const isUpdate = id !== null;
    try {
      if (!title || !code || !language) {
        // You might want to add proper error handling/UI feedback here
        console.error("Title, code and language are required");
        return;
      }

      if (isUpdate) {
        await db?.execute(
          "UPDATE snippets SET title = $1, code = $2, language = $3, tags = $4, note = $5 WHERE id = $6",
          [title, code, language, tags, note, id]
        );
      } else {
        await db?.execute(
          "INSERT INTO snippets (title, code, language, tags, note) VALUES ($1, $2, $3, $4, $5)",
          [title, code, language, tags, note]
        );
      }

      notifications.show({
        title: isUpdate ? "Snippet updated" : "Snippet saved",
        variant: "success",
        message: "Snippet saved successfully",
      });

      // Clear form after successful save
      setTitle("");
      setCode("");
      setLanguage("");
      setTags("");
      setNote("");

      // Optional: Add success notification here
    } catch (error) {
      console.error("Failed to save snippet:", error);
      // Optional: Add error notification here
    }
  };

  const fetchSnippets = async () => {
    try {
      const result = await db?.select<Snippet[]>(
        `SELECT * FROM snippets ORDER BY created_at DESC LIMIT 10 OFFSET ${(page - 1) * 10}`
      );
      setSnippets(result || []);
    } catch (error) {
      console.error("Failed to fetch snippets:", error);
    }
  };

  const searchSnippets = async () => {
    try {
      const result = await db?.select<Snippet[]>(
        `
        SELECT snippets.*, rank
        FROM snippets
        JOIN snippets_fts ON snippets.id = snippets_fts.rowid
        WHERE snippets_fts MATCH $1
        ORDER BY rank
        LIMIT 10;
        `,
        [
          `title:${searchTerm}* OR code:${searchTerm}* OR note:${searchTerm}* OR tags:${searchTerm}*`,
        ]
      );

      setSnippets(result || []);
    } catch (error) {
      console.error("Failed to search snippets:", error);
    }
  };

  // Delete snippet
  const handleDelete = async (id: number) => {
    const confirmation = await confirm(
      "Are you sure you want to delete this snippet?"
    );
    if (confirmation) {
      try {
        await db?.execute("DELETE FROM snippets WHERE id = $1", [id]);
        await fetchSnippets(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete snippet:", error);
      }
    }
  };

  const handleEdit = async (id: number) => {
    const snippet = snippets.find((snippet) => snippet.id === id);
    if (snippet) {
      setId(snippet.id);
      setTitle(snippet.title);
      setCode(snippet.code);
      setLanguage(snippet.language);
      setTags(snippet.tags);
      setNote(snippet.note);
      setActiveTab("create");
    }
  };

  const clearForm = () => {
    setTitle("");
    setCode("");
    setLanguage("");
    setTags("");
    setNote("");
  };

  useEffect(() => {
    if (!db) {
      const initDb = async () => {
        const db = await Database.load("sqlite:devtools.db");
        setDb(db);
      };
      initDb();
    } else {
      fetchSnippets();
      db.select<{ count: number }[]>(
        "SELECT COUNT(*) AS count FROM snippets"
      ).then((result) => {
        console.log("Total pages", result[0].count);
        const totalPages = result[0].count;
        setTotalPages(Math.ceil(totalPages / 10));
      });
    }

    return () => {
      console.log("Closing database");
      if (db) {
        db.close();
      }
    };
  }, [db]);

  useEffect(() => {
    if (activeTab === "search" && searchTerm.length > 2) {
      searchSnippets();
    }

    if (activeTab === "search" && searchTerm.length === 0) {
      fetchSnippets();
    }

    if (activeTab === "search") {
      fetchSnippets();
    }
  }, [activeTab, searchTerm, page]);

  return (
    <Stack h="100%" style={{ overflow: "auto" }}>
      <Tabs
        value={activeTab}
        onChange={(value) => {
          if (value === "search") {
            fetchSnippets();
          }
          setActiveTab(value as string);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="search">Search Snippets</Tabs.Tab>
          <Tabs.Tab value="create">Create Snippet</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="create">
          <Stack>
            <TextInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextInput
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <TextInput
              label="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Textarea
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              minRows={2}
            />
            <Monaco
              height="200px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
            />
            <Group>
              <Button variant="light" onClick={() => clearForm()}>
                Clear
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title || !code || !language}
              >
                Save Snippet
              </Button>
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="search">
          <Stack>
            <TextInput
              label="Search"
              placeholder="Full text search inside code, title, note and tags is supported"
              min={2}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Language</Table.Th>
                  <Table.Th>Tags</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {snippets?.map((snippet) => (
                  <Table.Tr key={snippet.id}>
                    <Table.Td>{snippet.title}</Table.Td>
                    <Table.Td>{snippet.language}</Table.Td>
                    <Table.Td>{snippet.tags}</Table.Td>
                    <Table.Td>
                      {new Date(snippet.created_at).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(snippet.id)}
                        variant="subtle"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="blue"
                        onClick={() => handleEdit(snippet.id)}
                        variant="subtle"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages || 1}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Snippets;
