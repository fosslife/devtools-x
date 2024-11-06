import classes from "./styles.module.css";

import {
  ActionIcon,
  Group,
  NumberInput,
  NumberInputHandlers,
  Stack,
  Text,
} from "@mantine/core";
import { useRef } from "react";
import { IconPlus, IconMinus } from "@tabler/icons-react";

interface QuantityInputProps {
  min: number;
  max: number;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
}

export function QuantityInput({
  min,
  max,
  label,
  value,
  onChange,
}: QuantityInputProps) {
  const handlers = useRef<NumberInputHandlers>(null);
  //   const [value, setValue] = useState<number | "">(min);

  return (
    <Stack gap={10}>
      <Text>{label}</Text>
      <Group className={classes.wrapper} justify="space-between">
        <ActionIcon<"button">
          //   size={28}
          variant="transparent"
          onClick={() => handlers.current?.decrement()}
          disabled={value === min}
          className={classes.control}
          onMouseDown={(event) => event.preventDefault()}
        >
          <IconMinus />
        </ActionIcon>

        <NumberInput
          variant="unstyled"
          min={min}
          max={max}
          handlersRef={handlers}
          value={value}
          onChange={onChange}
          classNames={{ input: classes.input }}
        />

        <ActionIcon<"button">
          //   size={28}
          variant="transparent"
          onClick={() => handlers.current?.increment()}
          disabled={value === max}
          className={classes.control}
          onMouseDown={(event) => event.preventDefault()}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
