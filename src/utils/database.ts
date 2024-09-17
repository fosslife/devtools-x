import Database from "tauri-plugin-sql-api";
import {
  Snippet,
  SnippetFile,
  SnippetFileInput,
  SnippetInput,
  SnippetNote,
  SnippetTag,
} from "@/types/snippets";

const getDb = async () => await Database.load("sqlite:devtools.db");

const success = (message: string) => ({ status: 200, message });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const failure = (message: string, error?: any) => ({ status: 501, message });

// Insertions

const insertSnippet = async (
  snippet: SnippetInput,
  files: SnippetFileInput | SnippetFileInput[]
) => {
  const db = await getDb();
  const snippetId = await db
    .execute("INSERT INTO snippets (name, path) VALUES (?, ?)", [
      snippet.name,
      snippet.path,
    ])
    .then((result) => result.lastInsertId)
    .catch((error) => {
      console.error(error);
      return undefined;
    });

  if (!snippetId) return undefined;

  files = Array.isArray(files) ? files : [files];
  await Promise.all(files.map((file) => insertSnippetFile(snippetId, file)));

  return snippetId;
};

export const insertSnippetFile = async (
  snippet_id: number,
  file: SnippetFileInput
) => {
  const db = await getDb();
  return db
    .execute(
      "INSERT INTO snippets_files (snippet_id, name, file_path, filetype, content) VALUES (?, ?, ?, ?, ?)",
      [snippet_id, file.name, file.file_path, file.filetype, file.content]
    )
    .then((result) => result.lastInsertId)
    .catch((error) => {
      console.error("File:", error);
      return undefined;
    });
};

const insertSnippetTag = async (snippet_id: number, tag: string) => {
  const db = await getDb();
  return db
    .execute("INSERT INTO snippets_tags (snippet_id, tag) VALUES (?, ?)", [
      snippet_id,
      tag,
    ])
    .then((result) => result.lastInsertId)
    .catch((error) => {
      console.error("Tag:", error);
      return undefined;
    });
};

const insertSnippetNote = async (snippet_id: number, note: string) => {
  const db = await getDb();
  return db
    .execute("INSERT INTO snippets_notes (snippet_id, note) VALUES (?, ?)", [
      snippet_id,
      note,
    ])
    .then((result) => result.lastInsertId)
    .catch((error) => {
      console.error("Note:", error);
      return undefined;
    });
};

// Updates

export const updateSnippet = async (
  snippet_id: number,
  snippet: SnippetInput
) => {
  const db = await getDb();
  return db
    .execute(
      "UPDATE snippets SET name = ?, path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [snippet.name, snippet.path, snippet_id]
    )
    .then(() => success("Snippet updated successfully."))
    .catch((error) => failure("Failed to update snippet.", error));
};

export const updateSnippetFile = async (
  file_id: number,
  snippet: SnippetFileInput
) => {
  const db = await getDb();
  return db
    .execute(
      `UPDATE snippets_files
         SET name       = ?,
             file_path  = ?,
             filetype   = ?,
             content    = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      [
        snippet.name,
        snippet.file_path,
        snippet.filetype,
        snippet.content,
        file_id,
      ]
    )
    .then(() => success("Snippet file updated successfully."))
    .catch((error) => failure("Failed to update snippet file.", error));
};

export const updateSnippetNote = async (note_id: number, note: string) => {
  const db = await getDb();
  return db
    .execute(`UPDATE snippets_notes SET note = ? WHERE id = ?`, [note, note_id])
    .then(() => success("Snippet note updated successfully."))
    .catch((error) => failure("Failed to update snippet note.", error));
};

// Removals

export const removeSnippetNote = async (
  key: string,
  value: string | number
) => {
  const db = await getDb();
  return db
    .execute("DELETE FROM snippets_notes WHERE ? = ?", [key, value])
    .then(() => success("Snippet note removed successfully."))
    .catch((error) => failure("Failed to remove snippet note.", error));
};

export const removeSnippetFile = async (
  key: string,
  value: string | number
) => {
  const db = await getDb();
  return db
    .execute("DELETE FROM snippets_files WHERE ? = ?", [key, value])
    .then(() => success("Snippet file removed successfully."))
    .catch((error) => failure("Failed to remove snippet file.", error));
};

export const removeSnippetTag = async (key: string, value: string | number) =>
  await (
    await getDb()
  )
    .execute("DELETE FROM snippets_tags WHERE ? = ?", [key, value])
    .then(() => success("Snippet tag removed successfully."))
    .catch((error) => failure("Failed to remove snippet tag.", error));

export const removeSnippet = async (snippet_id: number) => {
  const db = await getDb();
  await removeSnippetNote("snippet_id", snippet_id);
  await removeSnippetTag("snippet_id", snippet_id);
  await removeSnippetFile("snippet_id", snippet_id);
  await db.execute("DELETE FROM snippets WHERE id = ?", [snippet_id]);
};

// Get snippet by ID
export const getSnippetById = async (
  id: number
): Promise<Snippet | undefined> => {
  const db = await getDb();
  const snippet = await db.select("SELECT * FROM snippets WHERE id = ?", [id]);
  return snippet && Array.isArray(snippet) ? snippet[0] : undefined;
};

export const getSnippetFiles = async (snippet_id: number) => {
  const db = await getDb();
  const files = await db.select(
    "SELECT * FROM snippets_files WHERE snippet_id = ?",
    [snippet_id]
  );
  return files as SnippetFile[];
};

export const getSnippetTags = async (snippet_id: number) => {
  const db = await getDb();
  const tags = await db.select(
    "SELECT * FROM snippets_tags WHERE snippet_id = ?",
    [snippet_id]
  );
  return tags as SnippetTag[];
};

export const getSnippetNotes = async (snippet_id: number) => {
  const db = await getDb();
  const notes = await db.select(
    "SELECT * FROM snippets_notes WHERE snippet_id = ?",
    [snippet_id]
  );
  return notes as SnippetNote[];
};

// List snippets

export async function findAllSnippets() {
  try {
    const db = await getDb();
    const snippets = await db.select("SELECT * FROM snippets");
    return snippets;
  } catch (error) {
    console.error(error);
    return [];
  }
}

type ListSnippetsProps = {
  limit?: number;
  skip?: number;
  search?: string;
  tags?: string[];
  fields?: string[];
};

export async function listSnippets(props: ListSnippetsProps) {
  const db = await getDb();
  const { limit = 10, skip = 0, search = "", tags = [] } = props;

  const tagFilter = tags.length
    ? `AND snippet_id IN (
        SELECT snippet_id FROM snippets_tags WHERE tag IN (${tags.map(
          () => "?"
        )})
        )`
    : "";

  const snippets = await db.select(
    `SELECT * FROM snippets
        WHERE name LIKE ?
        ${tagFilter}
        LIMIT ?
        OFFSET ?`,
    [`%${search}%`, ...tags, limit, skip]
  );

  return snippets;
}

export async function seedDatabase() {
  const db = await getDb();

  try {
    // Clear existing data (optional)
    await db.execute("DELETE FROM snippets_notes");
    await db.execute("DELETE FROM snippets_tags");
    await db.execute("DELETE FROM snippets_files");
    await db.execute("DELETE FROM snippets");
  } catch (error) {
    console.error("Failed to clear existing data:", error);
  }
  try {
    // Insert sample snippets
    const snippetId1 = await insertSnippet(
      {
        name: "Kill port 3000 & 3001",
        path: "/bash/ports",
      },
      {
        filetype: "bash",
        content: "kill -9 $(lsof -ti:3000,3001)",
      }
    );

    const snippetId2 = await insertSnippet(
      {
        name: "Grainy background",
        path: "/css/backgrounds",
      },
      {
        filetype: "css",
        content: `.bg-grain {
    z-index: auto;
    position: fixed;
    top: 0%;
    bottom: 0%;
    left: 0%;
    right: 0%;
}

.bg-grain:after {
    animation: grain 8s steps(10) infinite;
    background-image: url(https://uploads.com/noise.jpg);
    content: "";
    height: 300%;
    left: -50%;
    opacity: 0.10;
    position: fixed;
    z-index: -10;
    top: -100%;
    width: 300%;
}

::selection {
    background: #955FFB;
    color: #EAE5DB;
    text-shadow: 0 0 6px #CEC9C9, 0 0 20px rgba(206,201,201,0.42);
}
`,
      }
    );

    await insertSnippet(
      {
        name: "Role Permissions",
        path: "/sql/permissions",
      },
      {
        filetype: "sql",
        content: `SELECT t.name       as "team",
    r.name          as "role",
    u.displayName   as "member"
FROM core.team_user as tu
    JOIN core.user u ON tu.userId = u.id
    JOIN core.role r ON tu.roleId = r.id
    JOIN core.team t ON tu.teamId = t.id
WHERE tu.teamId = 1`,
      }
    );

    await insertSnippet(
      {
        name: "Get Interface",
        path: "ts/interfaces",
      },
      {
        filetype: "typescript",
        content: `interface MyInterface {
  id: number;
  name: string;
  properties: string[];
}

const myObject: MyInterface = {
  id: 1,
  name: 'foo',
  properties: ['a', 'b', 'c']
};

function getValue(value: keyof MyInterface) {
  return myObject[value];
}
`,
      }
    );

    // Insert tags
    if (!snippetId1 || !snippetId2) {
      console.error("Failed to insert snippets.");
      return;
    }
    console.log("Snippet IDs:", snippetId1, snippetId2);
    await insertSnippetTag(snippetId1, "sample");
    await insertSnippetTag(snippetId2, "example");

    // Insert notes
    await insertSnippetNote(
      snippetId1,
      "This is a note for the first snippet."
    );
    await insertSnippetNote(
      snippetId2,
      "This is a note for the second snippet."
    );

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
