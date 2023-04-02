import {
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Stack,
  Table,
} from "@mantine/core";
import { dialog, invoke } from "@tauri-apps/api";
import { useState } from "react";

const FileHash = () => {
  const [fileHashes, setFileHashes] = useState<
    { name: string; hash: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const selectFile = async () => {
    const filePaths = (await dialog.open({
      multiple: true,
    })) as string[]; // Multiple is true

    setLoading(true);

    console.time("t1");
    let hashes = await invoke<Record<string, string>>("hash", {
      filenames: filePaths,
    });

    setFileHashes(
      Object.entries(hashes).map(([key, value]) => ({
        name: key,
        hash: value,
      }))
    );
    console.timeEnd("t1");
    setLoading(false);
  };

  return (
    <Stack
      sx={{ height: "100%", width: "100%", overflow: "auto" }}
      p="xs"
      spacing={"lg"}
    >
      <LoadingOverlay visible={loading} />

      <Group>
        <Button onClick={selectFile}>Select Files</Button>
      </Group>
      <Table striped>
        <thead>
          <tr>
            <th>file</th>
            <th>hash</th>
          </tr>
        </thead>
        <tbody>
          {fileHashes.map((el: any) => (
            <tr key={el.hash}>
              <td>{el.name}</td>
              <td>{el.hash}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Stack>
  );
};

export default FileHash;
