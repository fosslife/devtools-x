import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  Input,
  MantineSize,
} from "@mantine/core";
import { clipboard } from "@tauri-apps/api";
import { CSSProperties, HTMLInputTypeAttribute, useState } from "react";
import { IconCopy, IconEye } from "@tabler/icons-react";

function OutputBox({
  label,
  value,
  copyValue,
  type: propType,
  size,
  onCopy,
  style,
  onChange,
  btnLabel = "Copy",
}: {
  label?: string;
  value: string;
  copyValue?: string;
  type?: HTMLInputTypeAttribute;
  size?: MantineSize;
  onCopy?: () => void;
  style?: CSSProperties;
  onChange?: (value: string) => void;
  btnLabel?: string;
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
                <IconCopy />
              </ActionIcon>
            ) : null}
            <CopyButton value={value}>
              {({ copied, copy }) => (
                <Button
                  leftSection={btnLabel === "Copy" ? <IconEye /> : null}
                  size={size || "xs"}
                  // fullWidth={true}
                  onClick={() => {
                    copy(); //  copy doesn't work but need this function for animation.
                    clipboard.writeText(copyValue ?? value);
                    onCopy?.();
                  }}
                  style={style}
                >
                  {copied ? "Copied" : btnLabel}
                </Button>
              )}
            </CopyButton>
          </Group>
        }
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        readOnly={!onChange}
      ></Input>
    </Input.Wrapper>
  );
}

export { OutputBox };
