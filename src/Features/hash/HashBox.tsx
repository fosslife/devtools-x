import { Input } from "@mantine/core";

import { Copy } from "../../Components/Copy";

type HashBoxProps = {
  value: string;
  hashtype: string;
};

export const HashBox = ({ value, hashtype }: HashBoxProps) => {
  return (
    <Input
      size="xs"
      rightSectionWidth={100}
      rightSection={<Copy value={value} label={hashtype} />}
      rightSectionPointerEvents="auto"
      value={value}
      readOnly
    ></Input>
  );
};
