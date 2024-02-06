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
      style={{ height: "100%", width: "100%", overflow: "auto" }}
      p="xs"
      gap={"lg"}
    >
      <LoadingOverlay visible={loading} />

      <Group>
        <Button onClick={selectFile}>Select Files</Button>
      </Group>
      <Table
        // striped
        verticalSpacing={"md"}
        highlightOnHover
        withTableBorder
        withColumnBorders
        // withRowBorders
      >
        <Table.Thead>
          <Table.Tr
            style={
              {
                // display: "flex",
                // justifyContent: "space-around",
              }
            }
          >
            <Table.Th>file</Table.Th>
            <Table.Th>hash</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {fileHashes.map((el: any) => (
            <Table.Tr
              key={el.hash}
              style={
                {
                  // display: "flex",
                  // justifyContent: "space-between",
                }
              }
            >
              <Table.Td
                style={{
                  // width: "50%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "45vw",
                }}
              >
                {el.name}
              </Table.Td>
              <Table.Td>{el.hash}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
};

export default FileHash;

//TODO: export calculated hashes
//TODO: singular hash box copy button on select
