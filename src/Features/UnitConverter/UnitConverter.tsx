import {
  chakra,
  Flex,
  Heading,
  Icon,
  Input,
  InputProps,
  Select,
} from "@chakra-ui/react";
import Convert, { Unit } from "convert-units";
import { forwardRef, Ref, useRef, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";

const StyledInput = forwardRef(function mInput(
  props: InputProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <Input
      ref={ref}
      placeholder="Enter Value"
      borderBottom={"none"}
      borderBottomLeftRadius={0}
      borderBottomRightRadius={0}
      borderColor={"inherit"}
      _focus={{
        boxShadow: "none",
        borderColor: "inherit",
      }}
      _readOnly={{
        cursor: "not-allowed",
      }}
      _hover={{
        borderColor: "inherit",
      }}
      {...props}
    />
  );
});

const StyledSelect = chakra(Select, {
  baseStyle: {
    _focus: {
      boxShadow: "none",
      borderColor: "inherit",
    },
    _hover: {
      borderColor: "inherit",
    },
    borderColor: "inherit",
    borderTop: "none",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

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

    // let v = Convert(Number(fromRef.current.value)).from(fromUnit).to(toUnit);
    // setToValue(v.toString());
  };

  return (
    <Flex h="full" w="100%" gap={3} alignSelf={"start"} flexDir="column" p="2">
      <Heading>Unit Converter</Heading>
      <Select
        value={category}
        onChange={(e) => {
          handleCategory(e.target.value as Convert.Measure);
          // setValue("");
        }}
      >
        {Convert()
          .measures()
          .map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
      </Select>

      <Flex gap="5" py="3" w="100%" align={"center"}>
        <Flex direction={"column"} w="48%">
          <StyledInput
            placeholder="Enter From Value"
            ref={fromRef}
            onChange={() => calculate()}
          />
          <StyledSelect
            value={fromUnit}
            onChange={(e: any) => {
              setFromUnit(e.target.value);
              calculate(e.target.value, toUnit);
            }}
          >
            {possibilities.map((c) => (
              <option value={c} key={c}>
                {Convert().describe(c).plural}
              </option>
            ))}
          </StyledSelect>
        </Flex>

        <Icon
          as={FaExchangeAlt}
          // p="2.5"
          padding="2px"
          w="4%"
          h="24px"
          onClick={() => {
            calculate(toUnit, fromUnit);
            setToUnit(fromUnit);
            setFromUnit(toUnit);
          }}
          _hover={{
            bg: "#adadad53",
            borderRadius: 4,
          }}
        />

        <Flex direction={"column"} w="48%">
          {/* FIXME: make second inputbox as editable */}
          <StyledInput placeholder="Output" isReadOnly value={toValue} />
          <StyledSelect
            value={toUnit}
            onChange={(e: any) => {
              setToUnit(e.target.value);
              calculate(fromUnit, e.target.value);
            }}
          >
            {possibilities.map((c) => (
              <option value={c} key={c}>
                {Convert().describe(c).plural}
              </option>
            ))}
          </StyledSelect>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UnitConverter;
