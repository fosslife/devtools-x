import { Text } from "@mantine/core";
import { MatchResult } from "./RegexTester";
import { ReactNode } from "react";

type HighlightProps = {
  matches: MatchResult[];
  input: string;
  error: string;
};
const HighlightedText = ({ matches, input, error }: HighlightProps) => {
  if (!input) return null;
  if (error)
    return (
      <Text c="red" style={{ whiteSpace: "pre-wrap" }}>
        {input}
      </Text>
    );
  if (matches.length === 0)
    return <Text style={{ whiteSpace: "pre-wrap" }}>{input}</Text>;

  const lines = input.split("\n");

  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {lines.map((line, lineIndex) => {
        let lineElements: ReactNode[] = [];
        let lastIndex = 0;

        // Find matches that belong to this line
        const lineStartIndex =
          input.split("\n", lineIndex).join("\n").length +
          (lineIndex > 0 ? 1 : 0);
        const lineEndIndex = lineStartIndex + line.length;

        const lineMatches = matches.filter(
          (match) => match.start >= lineStartIndex && match.end <= lineEndIndex
        );

        lineMatches.forEach((match, idx) => {
          const relativeStart = match.start - lineStartIndex;
          const relativeEnd = match.end - lineStartIndex;

          if (lastIndex < relativeStart) {
            lineElements.push(
              <span key={`text-${lineIndex}-${idx}`}>
                {line.slice(lastIndex, relativeStart)}
              </span>
            );
          }

          lineElements.push(
            <span
              key={`match-${lineIndex}-${idx}`}
              style={{
                backgroundColor: "#ffd700",
                color: "#000",
                padding: "0 2px",
                borderRadius: "2px",
              }}
            >
              {match.match}
            </span>
          );

          lastIndex = relativeEnd;
        });

        if (lastIndex < line.length) {
          lineElements.push(
            <span key={`text-${lineIndex}-final`}>{line.slice(lastIndex)}</span>
          );
        }

        return (
          <div key={`line-${lineIndex}`}>
            {lineElements.length > 0 ? lineElements : line}
          </div>
        );
      })}
    </div>
  );
};

export default HighlightedText;
