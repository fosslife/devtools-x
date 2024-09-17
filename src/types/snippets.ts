export type SnippetTag = {
  id: number;
  snippet_id: number;
  tag: string;
};

export type SnippetNote = {
  id: number;
  snippet_id: number;
  note: string;
};

export type SnippetFile = {
  id: number;
  snippet_id: number;
  name?: string;
  file_path?: string;
  filetype?: string;
  content?: string;

  created_at: string;
  updated_at: string;
};

export type SnippetFileInput = Pick<
  SnippetFile,
  "name" | "file_path" | "filetype" | "content"
>;

export type Snippet = {
  id: number;
  name: string;
  path: string;

  created_at: string;
  updated_at: string;
};

export type SnippetInput = Pick<Snippet, "name" | "path">;
