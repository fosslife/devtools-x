import Database from "tauri-plugin-sql-api";

const getDb = async () => await Database.load("sqlite:devtools.db");

// Insert a new snippet
async function insertSnippet(snippet: {
  name: string;
  path: string;
  content?: string;
  filetype?: string;
  parent_id?: number;
}) {
  const db = await getDb();
  try {
    const snippetId = await db
      .execute(
        "INSERT INTO snippets (name, path, content, filetype, parent_id) VALUES (?, ?, ?, ?, ?)",
        [
          snippet.name,
          snippet.path,
          snippet.content,
          snippet.filetype,
          snippet.parent_id,
        ]
      )
      .then((result) => result.lastInsertId)
      .catch((error) => {
        console.error(error);
        return undefined;
      });

    return snippetId;
  } catch (error) {
    console.error("Failed to insert snippet:", error);
    return undefined;
  }
}

// Insert a new tag
async function insertSnippetTag(snippet_id: number, tag: string) {
  const db = await getDb();
  await db
    .execute("INSERT INTO snippets_tags (snippet_id, tag) VALUES (?, ?)", [
      snippet_id,
      tag,
    ])
    .catch((error) => {
      console.error("Tag:", error);
    });
}

// Insert a new note
async function insertSnippetNote(snippet_id: number, note: string) {
  const db = await getDb();
  await db
    .execute("INSERT INTO snippets_notes (snippet_id, note) VALUES (?, ?)", [
      snippet_id,
      note,
    ])
    .catch((error) => {
      console.error("Note:", error);
    });
}

// Update a snippet
export async function updateSnippet(snippet: {
  id: number;
  name?: string;
  path?: string;
  content?: string;
  filetype?: string;
  parent_id?: number;
}) {
  const db = await getDb();
  await db.execute(
    `UPDATE snippets SET
      name = COALESCE(?, name),
      path = COALESCE(?, path),
      content = COALESCE(?, content),
      filetype = COALESCE(?, filetype),
      parent_id = COALESCE(?, parent_id)
    WHERE id = ?`,
    [
      snippet.name,
      snippet.path,
      snippet.content,
      snippet.filetype,
      snippet.parent_id,
      snippet.id,
    ]
  );
}

// Get snippet by ID
export async function getSnippetById(id: number) {
  const db = await getDb();
  const snippet = await db.select("SELECT * FROM snippets WHERE id = ?", [id]);
  return snippet && Array.isArray(snippet) ? snippet[0] : {};
}

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
  parent_id?: number;
  fields?: string[];
};

export async function listSnippets(props: ListSnippetsProps) {
  const db = await getDb();
  const { limit = 10, skip = 0, search = "", tags = [], parent_id } = props;

  const tagFilter = tags.length
    ? `AND snippet_id IN (
        SELECT snippet_id FROM snippets_tags WHERE tag IN (${tags.map(
          () => "?"
        )})
        )`
    : "";

  const fields = props.fields ? props.fields.join(", ") : "*";

  const snippets = await db.select(
    `SELECT ? FROM snippets
        WHERE name LIKE ?
        AND parent_id = ?
        ${tagFilter}
        LIMIT ?
        OFFSET ?`,
    [fields, `%${search}%`, parent_id, ...tags, limit, skip]
  );

  return snippets;
}

export async function seedDatabase() {
  const db = await getDb();

  try {
    // Clear existing data (optional)
    await db.execute("DELETE FROM snippets_notes");
    await db.execute("DELETE FROM snippets_tags");
    await db.execute("DELETE FROM snippets");
  } catch (error) {
    console.error("Failed to clear existing data:", error);
  }
  try {
    // Insert sample snippets
    const snippetId1 = await insertSnippet({
      name: "Kill port 3000 & 3001",
      path: "/bash/ports",
      content: "kill -9 $(lsof -ti:3000,3001)",
      filetype: "bash",
      parent_id: undefined,
    });

    const snippetId2 = await insertSnippet({
      name: "Grainy background",
      path: "/css/backgrounds",
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
      filetype: "css",
      parent_id: undefined,
    });

    await insertSnippet({
      name: "Role Permissions",
      path: "/sql/permissions",
      filetype: "sql",
      parent_id: undefined,
      content: `SELECT t.name       as "team",
    r.name          as "role",
    u.displayName   as "member"
FROM core.team_user as tu
    JOIN core.user u ON tu.userId = u.id
    JOIN core.role r ON tu.roleId = r.id
    JOIN core.team t ON tu.teamId = t.id
WHERE tu.teamId = 1`,
    });

    await insertSnippet({
      name: "Get Interface",
      path: "ts/interfaces",
      filetype: "typescript",
      parent_id: undefined,
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
    });

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
