import {
  ActionIcon,
  Group,
  Select,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import Convert, { Unit } from "convert-units";
import { useRef, useState } from "react";
import { IconExchange } from "@tabler/icons-react";

const UnitConverter = () => {
  const [category, setCategory] = useState<Convert.Measure>("length");
  const possibilities = Convert().possibilities(category);

  const [toValue, setToValue] = useState("");

  // units
  const [fromUnit, setFromUnit] = useState(possibilities[0]);
  const [toUnit, setToUnit] = useState(possibilities[1]);

  const fromRef = useRef<HTMLInputElement>(null);

  const handleCategory = (e: Convert.Measure) => {
    setCategory(e);
    setToUnit(Convert().possibilities(e)[1]);
    setFromUnit(Convert().possibilities(e)[0]);
  };

  const calculate = (from?: Unit, to?: Unit) => {
    if (!fromRef.current) {
      return;
    }
    if (!fromRef.current.value) {
      return;
    }
    if (isNaN(Number(fromRef.current.value))) {
      return;
    }

    let mFrom;
    let mTo;

    if (from && to) {
      mFrom = from;
      mTo = to;
    } else {
      mFrom = fromUnit;
      mTo = toUnit;
    }

    let v = Convert(Number(fromRef.current.value)).from(mFrom).to(mTo);
    if (Number.isInteger(v)) {
      setToValue(v.toString());
    } else {
      setToValue(Number(v).toFixed(2));
    }
  };

  return (
    <Stack h="100%">
      <Select
        style={{ width: "100%" }}
        label="Category"
        value={category}
        data={Convert()
          .measures()
          .map((m) => ({ value: m, label: m }))}
        onChange={(e) => {
          handleCategory(e as Convert.Measure);
        }}
      >
        {}
      </Select>
      <Group style={{ width: "100%" }} align={"center"} justify="space-between">
        <Stack style={{ width: "45%" }}>
          <TextInput label="From" ref={fromRef} onChange={() => calculate()} />
          <Select
            label="Unit"
            value={fromUnit}
            data={possibilities.map((c) => ({
              value: Convert().describe(c).abbr,
              label: Convert().describe(c).plural,
            }))}
            onChange={(e: any) => {
              setFromUnit(e);
              calculate(e, toUnit);
            }}
          ></Select>
        </Stack>

        <Tooltip label="Swap" position="bottom">
          <ActionIcon
            onClick={() => {
              calculate(toUnit, fromUnit);
              setToUnit(fromUnit);
              setFromUnit(toUnit);
            }}
          >
            <IconExchange size={16} />
          </ActionIcon>
        </Tooltip>

        <Stack style={{ width: "45%" }}>
          {/* FIXME: make second inputbox as editable */}
          <TextInput label="To" readOnly value={toValue} />
          <Select
            label="Unit"
            value={toUnit}
            data={possibilities.map((c) => ({
              value: Convert().describe(c).abbr,
              label: Convert().describe(c).plural,
            }))}
            onChange={(e: any) => {
              setToUnit(e);
              calculate(fromUnit, e);
            }}
          ></Select>
        </Stack>
      </Group>
    </Stack>
  );
};

export default UnitConverter;
