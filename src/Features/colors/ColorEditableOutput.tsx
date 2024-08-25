import { Output } from "@/hooks/useColorState";
import { OutputBox } from "@/Components/OutputBox";
import { Group } from "@mantine/core";

export const EditableColorOutput = ({
  conversions,
  onCopy,
}: {
  conversions: Output[];
  onCopy?: () => void;
}) => {
  return (
    <Group gap={10} grow style={{ marginBottom: 14 }}>
      {conversions.map((conv) => (
        <OutputBox
          key={conv.type}
          label={conv.type.toUpperCase() + ":"}
          value={conv.editableValue}
          copyValue={conv.renderValue}
          style={{ background: conv.renderValue }}
          onCopy={onCopy}
          onChange={conv?.onChange}
        />
      ))}
    </Group>
  );
};
