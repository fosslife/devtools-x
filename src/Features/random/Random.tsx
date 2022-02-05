import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react';
import { clipboard } from '@tauri-apps/api';
import { generate } from 'generate-password-ts';
import { useState } from 'react';
import { MdGraphicEq } from 'react-icons/md';

type PassOpt = {
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  uppercase: boolean;
  excludeSimilarCharacters?: boolean;
};

const Random = () => {
  const [length, setLength] = useState(16); // default pass length
  const [pass, setPass] = useState({ pass: '', entropy: 0 });
  const [passOpt, setPassOption] = useState<PassOpt>({
    lowercase: true,
    numbers: true,
    symbols: true,
    uppercase: true,
    excludeSimilarCharacters: false,
  });

  const isError = () => {
    // dumb check on if all are false
    const copy = { ...passOpt };
    delete copy.excludeSimilarCharacters;
    return Object.values(copy).every((e) => e === false);
  };

  const genPassword = () => {
    if (isError()) return;
    const x = generate({
      strict: true, // password must contain one char from each pool
      length: length,
      ...passOpt,
    });

    // Entropy calculation, broken!
    // let l = x.length;
    // let poolsize = 0;
    // if (passOpt.lowercase) poolsize += 26;
    // if (passOpt.uppercase) poolsize += 26;
    // if (passOpt.symbols) poolsize += 31;
    // if (passOpt.numbers) poolsize += 10;

    // const combinations = Math.pow(poolsize, l);
    // const e = Math.log2(combinations);
    // console.log(poolsize, length, "Entropu", e);

    setPass({ pass: x, entropy: 0 });
  };

  return (
    <Flex
      h="full"
      w="100%"
      gap={6}
      alignSelf={'start'}
      flexDirection={'column'}
      sx={{
        '& div': {
          maxWidth: '98%',
        },
      }}
    >
      <FormControl>
        <FormLabel htmlFor="email">Password:</FormLabel>
        <InputGroup>
          <Input readOnly size={'lg'} value={pass.pass} />
          <InputRightElement width="4.5rem">
            <Button
              size="sm"
              onClick={() => {
                clipboard.writeText(pass.pass);
              }}
            >
              Copy
            </Button>
          </InputRightElement>
        </InputGroup>
        {isError() ? (
          <FormHelperText color={'red.300'}>
            Please select at least one checkbox
          </FormHelperText>
        ) : null}
      </FormControl>

      <Box>
        <CheckboxGroup colorScheme="green" defaultValue={['naruto', 'kakashi']}>
          <Stack spacing={[1, 5]} direction={['column', 'row']}>
            <Checkbox
              isChecked={passOpt.lowercase}
              onChange={(e) => {
                setPassOption({ ...passOpt, lowercase: e.target.checked });
              }}
            >
              Lowercase
            </Checkbox>
            <Checkbox
              isChecked={passOpt.uppercase}
              onChange={(e) => {
                setPassOption({ ...passOpt, uppercase: e.target.checked });
              }}
            >
              Uppercase
            </Checkbox>
            <Checkbox
              isChecked={passOpt.numbers}
              onChange={(e) => {
                setPassOption({ ...passOpt, numbers: e.target.checked });
              }}
            >
              Digits
            </Checkbox>
            <Checkbox
              isChecked={passOpt.symbols}
              onChange={(e) => {
                setPassOption({
                  ...passOpt,
                  symbols: e.target.checked,
                });
              }}
            >
              Symbols
            </Checkbox>
            <Checkbox
              isChecked={passOpt.excludeSimilarCharacters}
              onChange={(e) =>
                setPassOption({
                  ...passOpt,
                  excludeSimilarCharacters: e.target.checked,
                })
              }
            >
              Exclude similar chars
            </Checkbox>
            <Button disabled={isError()} onClick={genPassword}>
              Generate
            </Button>
          </Stack>
        </CheckboxGroup>
      </Box>
      <Box>
        <Slider
          aria-label="slider-ex-4"
          min={8}
          max={128} // overkill?
          value={length}
          onChange={(v) => {
            setLength(v);
            genPassword();
          }}
        >
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="tomato" />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="tomato" as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
        length: {length}
      </Box>

      {/* <Box>Entropy: {pass.entropy}</Box> */}
    </Flex>
  );
};

// FIXME: entropy calculation is borked!
// TODO: exclude characters

export default Random;
