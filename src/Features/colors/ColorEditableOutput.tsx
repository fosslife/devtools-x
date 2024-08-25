import { Output } from "@/hooks/useColorState";
import { OutputBox } from "@/Components/OutputBox";
import { Group } from "@mantine/core";
import classes from "./colorgenerator.module.css";

export const EditableColorOutput = ({
  conversions,
  onCopy,
}: {
  conversions: Output[];
  onCopy?: () => void;
}) => {
  return (
    <Group
      gap={20}
      grow
      className={classes.outputGroup}
      style={{ marginBottom: 14 }}
    >
      {conversions.map((conv) => (
        <OutputBox
          key={conv.type}
          value={conv.editableValue}
          copyValue={conv.renderValue}
          style={{
            ["--hover-background" as string]: conv.renderValue,
          }}
          onCopy={onCopy}
          onChange={conv?.onChange}
          btnLabel={`Copy ${conv.type.toUpperCase()}`}
        />
      ))}
    </Group>
  );
};
