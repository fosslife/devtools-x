import {
  ActionIcon,
  createStyles,
  Group,
  NumberInput,
  NumberInputHandlers,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { useRef } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const useStyles = createStyles((theme) => ({
  wrapper: {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "space-between",
    padding: `${rem(6)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]
    }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,

    "&:focus-within": {
      borderColor: theme.colors[theme.primaryColor][6],
    },
  },

  control: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]
    }`,

    "&:disabled": {
      borderColor:
        theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3],
      opacity: 0.8,
      backgroundColor: "transparent",
    },
  },
  label: {
    display: "block",
  },

  input: {
    textAlign: "center",
    paddingRight: `${theme.spacing.sm} !important`,
    paddingLeft: `${theme.spacing.sm} !important`,
    height: rem(28),
    flex: 1,
  },
}));

interface QuantityInputProps {
  min: number;
  max: number;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function QuantityInput({
  min,
  max,
  label,
  value,
  onChange,
}: QuantityInputProps) {
  const { classes } = useStyles();
  const handlers = useRef<NumberInputHandlers>(null);
  //   const [value, setValue] = useState<number | "">(min);

  return (
    <Stack spacing={10}>
      <Text>{label}</Text>
      <Group className={classes.wrapper} position="apart">
        <ActionIcon<"button">
          //   size={28}
          variant="transparent"
          onClick={() => handlers.current?.decrement()}
          disabled={value === min}
          className={classes.control}
          onMouseDown={(event) => event.preventDefault()}
        >
          <FiMinus />
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
          <FiPlus />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
