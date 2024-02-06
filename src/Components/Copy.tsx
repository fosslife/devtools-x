import { Button, CopyButton, Tooltip } from "@mantine/core";
import { clipboard } from "@tauri-apps/api";
import { FaCheck, FaCopy } from "react-icons/fa";

export function Copy({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <CopyButton value={value.toString()} timeout={2400}>
      {({ copied, copy }) => (
        <Tooltip label={"Copy"}>
          <Button
            leftSection={copied ? <FaCheck /> : <FaCopy />}
            size="xs"
            fullWidth
            color={copied ? "teal" : "blue"}
            onClick={() => {
              copy(); //  copy doesn't work but need this function for animation.
              clipboard.writeText(value.toString());
            }}
          >
            {copied ? "Copied" : label}
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
}
