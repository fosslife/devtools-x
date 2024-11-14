import { Button, CopyButton, MantineSize, Tooltip } from "@mantine/core";
import {} from "@tauri-apps/api";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import * as clipboard from "@tauri-apps/plugin-clipboard-manager";

type CopyProps = {
  value: number | string;
  label: string;
  size?: MantineSize;
};

export function Copy({ value, label, size }: CopyProps) {
  return (
    <CopyButton value={value.toString()} timeout={2400}>
      {({ copied, copy }) => (
        <Tooltip label={"Copy"}>
          <Button
            leftSection={
              copied ? <IconCheck size={16} /> : <IconCopy size={16} />
            }
            size={size ?? "xs"}
            fullWidth
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
