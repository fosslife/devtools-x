import { useState, useEffect, useCallback } from "react"; // Changed from useMemo
import {
  TextInput,
  Checkbox,
  Textarea,
  Paper,
  Stack,
  Group,
  Text,
  Box,
} from "@mantine/core";
import HighlightedText from "./Highlight";

export interface MatchResult {
  start: number;
  end: number;
  match: string;
}

const MAX_ITERATIONS = 10000;
const MAX_INPUT_LENGTH = 50000;
const EXECUTION_TIMEOUT = 1000;

const RegexTester = () => {
  const [pattern, setPattern] = useState<string>("/hello/");
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
  });
  const [input, setInput] = useState<string>(
    "Hello world! hello there. HELLO everyone."
  );
  const [error, setError] = useState<string>("");
  const [matches, setMatches] = useState<MatchResult[]>([]); // New state for matches

  const safeRegexExec = useCallback(
    (regex: RegExp, text: string): Promise<MatchResult[]> => {
      const results: MatchResult[] = [];
      let iterations = 0;
      let lastIndex = 0;

      const timeoutPromise = new Promise<MatchResult[]>((_, reject) => {
        setTimeout(
          () => reject(new Error("Regex execution timed out")),
          EXECUTION_TIMEOUT
        );
      });

      const regexPromise = new Promise<MatchResult[]>((resolve, reject) => {
        try {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            if (iterations++ > MAX_ITERATIONS) {
              reject(new Error("Too many matches - pattern may be too broad"));
              break;
            }

            const match = regex.exec(text);
            if (!match) break;

            if (match.index === lastIndex && match[0].length === 0) {
              if (lastIndex >= text.length) break;
              regex.lastIndex = lastIndex + 1;
              continue;
            }

            results.push({
              start: match.index,
              end: match.index + match[0].length,
              match: match[0],
            });

            lastIndex = regex.lastIndex;
            if (!flags.global) break;
          }
          resolve(results);
        } catch (err) {
          reject(err);
        }
      });

      return Promise.race([regexPromise, timeoutPromise]);
    },
    [flags.global]
  );

  // Using useEffect instead of useMemo for async operations
  useEffect(() => {
    let mounted = true;

    const getMatches = async () => {
      if (!pattern || !input) {
        setError("");
        setMatches([]);
        return;
      }

      if (input.length > MAX_INPUT_LENGTH) {
        setError(`Input too long (max ${MAX_INPUT_LENGTH} characters)`);
        setMatches([]);
        return;
      }

      try {
        const cleanPattern = pattern.replace(/^\/|\/$/g, "");
        if (!cleanPattern) {
          setError("");
          setMatches([]);
          return;
        }

        const flagsString = [
          flags.global ? "g" : "",
          flags.ignoreCase ? "i" : "",
          flags.multiline ? "m" : "",
        ].join("");

        const regex = new RegExp(cleanPattern, flagsString);
        const results = await safeRegexExec(regex, input);

        if (mounted) {
          setError("");
          setMatches(results);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Invalid regular expression";
          setError(errorMessage);
          setMatches([]);
        }
      }
    };

    getMatches();

    return () => {
      mounted = false;
    };
  }, [pattern, input, flags, safeRegexExec]);

  return (
    <Stack gap="md" style={{ overflow: "auto" }}>
      <TextInput
        label="RegEx Pattern"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        error={error}
        placeholder="Enter regex pattern"
      />

      <Group>
        <Checkbox
          label="Global (g)"
          checked={flags.global}
          onChange={(e) =>
            setFlags({ ...flags, global: e.currentTarget.checked })
          }
        />
        <Checkbox
          label="Case Insensitive (i)"
          checked={flags.ignoreCase}
          onChange={(e) =>
            setFlags({ ...flags, ignoreCase: e.currentTarget.checked })
          }
        />
        <Checkbox
          label="Multiline (m)"
          checked={flags.multiline}
          onChange={(e) =>
            setFlags({ ...flags, multiline: e.currentTarget.checked })
          }
        />
      </Group>

      <Textarea
        label="Test String"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        minRows={4}
        autosize
        maxRows={8}
        placeholder="Enter text to test against the pattern"
        error={input.length > MAX_INPUT_LENGTH ? "Input too long" : ""}
      />

      <Box>
        <Text size="sm" fw={500} mb={5}>
          Results:
        </Text>
        <Paper p="xs" withBorder>
          <HighlightedText matches={matches} input={input} error={error} />
        </Paper>

        {!error && (
          <Text size="sm" mt={5} c="dimmed">
            Matches found: {matches.length}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default RegexTester;
