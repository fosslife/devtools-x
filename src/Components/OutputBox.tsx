import { Button, CopyButton, Input } from "@mantine/core";
import { clipboard } from "@tauri-apps/api";
import { FaCopy } from "react-icons/fa";

function OutputBox({ label, value }: { label: string; value: string }) {
  return (
    <Input.Wrapper label={label}>
      <Input
        size="xs"
        rightSectionWidth={100}
        rightSection={
          <CopyButton value={value}>
            {({ copied, copy }) => (
              <Button
                leftIcon={<FaCopy />}
                size="xs"
                fullWidth={true}
                color={copied ? "teal" : "blue"}
                onClick={() => {
                  copy(); //  copy doesn't work but need this function for animation.
                  clipboard.writeText(value);
                }}
              >
                {copied ? "Copied" : `Copy`}
              </Button>
            )}
          </CopyButton>
        }
        value={value}
        readOnly
      ></Input>
    </Input.Wrapper>
  );
}

export { OutputBox };
