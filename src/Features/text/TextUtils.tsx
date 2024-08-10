import { Group, Stack, Text, Textarea } from "@mantine/core";
import { useDebouncedValue, useInputState } from "@mantine/hooks";

const algorithms = ["gzip", "deflate", "zlib"];

export default function TextUtils() {
  const [text, setText] = useInputState("Sample text");

  const getWordSet = () => {
    const words = text
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word.toLowerCase());
    const wordSet = new Set(words);

    const uniqueWords = wordSet.size;
    const wordCount = words.length;

    const density = uniqueWords / wordCount;

    const stats = Array.from(wordSet).map((word) => ({
      word,
      count: words.filter((w) => w === word).length,
    }));

    return { stats, wordCount, uniqueWords, density };
  };

  const [retrieve] = useDebouncedValue(getWordSet, 500);
  // Todo check why pasing retrieve directly to wordset throws an type error
  const wordset = retrieve as unknown as {
    stats: { word: string; count: number }[];
    wordCount: number;
    uniqueWords: number;
    density: number;
  };

  return (
    <Group align="top">
      <Stack
        style={{
          width: "70%",
        }}
      >
        <Textarea
          placeholder="Enter text to compress"
          minRows={10}
          maxRows={25}
          autosize
          value={text}
          onChange={setText}
        />

        <Group
          gap={4}
          style={{
            justifyContent: "space-between",
            paddingRight: 15,
          }}
        >
          <Group align="center">
            <Text c="dimmed">Characters</Text>
            {text.length}
          </Group>
          <Group align="center">
            <Text c="dimmed">Words</Text> {text.split(" ").length}
          </Group>
          <Group align="center">
            <Text c="dimmed">Lines</Text> {text.split("\n").length}
          </Group>
          <Group align="center">
            <Text c="dimmed">Paragraphs</Text> {text.split("\n\n").length}
          </Group>
          <Group align="center">
            <Text c="dimmed">Spaces</Text> {text.split(" ").length - 1}
          </Group>
        </Group>
      </Stack>
      <Stack
        gap={4}
        style={{
          width: "25%",
        }}
      >
        {wordset ? (
          <Group gap={4}>
            <Group align="center">
              <Text c="dimmed">Unique</Text>
              {wordset.uniqueWords}
              <Text c="dimmed">/ {wordset.wordCount}</Text>
            </Group>{" "}
            <Group align="center">
              <Text c="dimmed">&amp; Density</Text>
              {wordset.density.toFixed(2)}
            </Group>
          </Group>
        ) : (
          <Text>Calculating...</Text>
        )}
        <Stack
          gap={4}
          style={{
            height: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: 15,
          }}
        >
          {wordset.stats
            .sort((a, b) => b.count - a.count)
            .map((stat) => (
              <Group
                key={stat.word}
                gap={2}
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text>{stat.word}</Text>
                <Text>{stat.count}</Text>
              </Group>
            ))}
        </Stack>
      </Stack>
    </Group>
  );
}
