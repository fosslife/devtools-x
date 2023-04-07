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
}: {
  label: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  size?: MantineSize;
}) {
  const [type, setType] = useState(propType);

  return (
    <Input.Wrapper label={label}>
      <Input
        type={type}
        size={size || "xs"}
        rightSectionWidth={100}
        rightSection={
          <Group noWrap>
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
                  leftIcon={<FaCopy />}
                  size={size || "xs"}
                  // fullWidth={true}
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
          </Group>
        }
        value={value}
        readOnly
      ></Input>
    </Input.Wrapper>
  );
}

export { OutputBox };
