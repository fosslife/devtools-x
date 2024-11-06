import { Group, Select, Stack, Text, Textarea } from "@mantine/core";
import { useDebouncedValue, useInputState } from "@mantine/hooks";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

const algorithms = ["gzip", "deflate", "zlib"];

export default function Compress() {
  const [text, setText] = useInputState("Sample text");
  const [debounced] = useDebouncedValue(text, 500);
  const [compressionLevel, setCompressionLevel] = useInputState("6");
  const [algorithm, setAlgorithm] = useInputState("gzip");

  const [compressedText, setCompressedText] = useState("");

  useEffect(() => {
    async function handleCompress(text: string) {
      const compressed = await invoke<string>("compress", {
        input: text,
        compressionLevel: Number(compressionLevel),
        algorithm,
      });
      setCompressedText(compressed);
    }

    handleCompress(debounced);
  }, [debounced, compressionLevel, algorithm]);

  return (
    <Stack>
      <Textarea
        placeholder="Enter text to compress"
        minRows={3}
        maxRows={6}
        autosize
        value={text}
        onChange={setText}
      />
      <Group>
        <Select
          label="Compression algorithm"
          data={algorithms}
          defaultValue="gzip"
          allowDeselect={false}
          onChange={setAlgorithm}
          value={algorithm}
        />
        <Select
          label="compression level"
          data={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
          defaultValue="1"
          allowDeselect={false}
          onChange={setCompressionLevel}
          value={compressionLevel}
        />
      </Group>
      <Textarea
        readOnly
        value={compressedText}
        minRows={2}
        maxRows={5}
        autosize
      />
      <Stack gap={4}>
        <Text>Original length: {text.length} </Text>
        <Text>Compressed length: {compressedText.length} </Text>
        <Text>Diff: {text.length - compressedText.length}</Text>
        <Text>
          Percentage:{" "}
          {100 - Math.round((compressedText.length / text.length) * 100) || 0}%
        </Text>
      </Stack>
    </Stack>
  );
}
