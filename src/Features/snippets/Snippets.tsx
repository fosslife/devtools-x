import { Group, Stack } from "@mantine/core";
import { findAllSnippets, seedDatabase } from "@/utils/database";
import { useEffect, useState } from "react";

const Snippets = () => {
  const [snippets, setSnippets] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await findAllSnippets();
      setSnippets(data as any);
    };
    fetchData().then((r) => r);
  }, []);

  const seed = async () => {
    await seedDatabase();
    const data = await findAllSnippets();
    setSnippets(data as any);
  };
  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <Group></Group>
      <div style={{ width: "100%", height: "95%", display: "flex" }}>
        Snippets
      </div>
      <button onClick={() => seed()}>Seed Database</button>
      <pre>{JSON.stringify(snippets, null, 2)}</pre>
    </Stack>
  );
};

export default Snippets;
