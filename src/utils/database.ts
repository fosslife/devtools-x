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
  await db
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
    .then((r) => console.log(r))
    .catch((e) => console.log(e));
}

// Insert a new tag
async function insertSnippetTag(snippet_id: number, tag: string) {
  const db = await getDb();
  await db.execute(
    "INSERT INTO snippets_tags (snippet_id, tag) VALUES (?, ?)",
    [snippet_id, tag]
  );
}

// Insert a new note
async function insertSnippetNote(snippet_id: number, note: string) {
  const db = await getDb();
  await db.execute(
    "INSERT INTO snippets_notes (snippet_id, note) VALUES (?, ?)",
    [snippet_id, note]
  );
}

// Update a snippet
async function updateSnippet(snippet: {
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
async function getSnippetById(id: number) {
  const db = await getDb();
  const snippet = await db.execute("SELECT * FROM snippets WHERE id = ?", [id]);
  return snippet;
}

export async function findAllSnippets() {
  try {
    const db = await getDb();
    const snippets = await db.execute("SELECT * FROM snippets");
    return snippets;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function seedDatabase() {
  const db = await getDb();

  // Clear existing data (optional)
  await db.execute("DELETE FROM snippets");
  await db.execute("DELETE FROM snippets_tags");
  await db.execute("DELETE FROM snippets_notes");

  // Insert sample snippets
  const snippetId1 = await insertSnippet({
    name: "Sample Snippet 1",
    path: "/path/to/snippet1",
    content: "Content of the first snippet.",
    filetype: "text",
    parent_id: undefined,
  });

  const snippetId2 = await insertSnippet({
    name: "Sample Snippet 2",
    path: "/path/to/snippet2",
    content: "Content of the second snippet.",
    filetype: "text",
    parent_id: undefined,
  });

  // Insert tags
  await insertSnippetTag(snippetId1, "sample");
  await insertSnippetTag(snippetId2, "example");

  // Insert notes
  await insertSnippetNote(snippetId1, "This is a note for the first snippet.");
  await insertSnippetNote(snippetId2, "This is a note for the second snippet.");

  console.log("Database seeded successfully.");
}
