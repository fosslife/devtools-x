import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  Input,
  MantineSize,
} from "@mantine/core";
import { clipboard } from "@tauri-apps/api";
import { HTMLInputTypeAttribute, useState } from "react";
import { FaCopy, FaEye } from "react-icons/fa";

function OutputBox({
  label,
  value,
  type: propType,
  size,
  onCopy,
}: {
  label: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  size?: MantineSize;
  onCopy?: () => void;
}) {
  const [type, setType] = useState(propType);

  return (
    <Input.Wrapper label={label}>
      <Input
        type={type}
        size={size || "xs"}
        rightSectionWidth={75}
        rightSectionPointerEvents="auto"
        rightSection={
          <Group wrap="nowrap">
            {propType === "password" ? (
              <ActionIcon<"button">
                onClick={() =>
                  setType(type === "password" ? "text" : "password")
                }
              >
                <FaEye />
              </ActionIcon>
            ) : null}
            <CopyButton value={value}>
              {({ copied, copy }) => (
                <Button
                  leftSection={<FaCopy />}
                  size={size || "xs"}
                  // fullWidth={true}
                  color={copied ? "teal" : "blue"}
                  onClick={() => {
                    copy(); //  copy doesn't work but need this function for animation.
                    clipboard.writeText(value);
                    onCopy?.();
                  }}
                >
                  {copied ? "Copied" : `Copy`}
                </Button>
              )}
            </CopyButton>
          </Group>
        }
        value={value}
        readOnly
      ></Input>
    </Input.Wrapper>
  );
}

export { OutputBox };
