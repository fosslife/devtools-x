import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { clipboard } from '@tauri-apps/api';

type HashBoxProps = {
  value: string;
  hashtype: string;
};

export const HashBox = ({ value, hashtype }: HashBoxProps) => {
  return (
    <FormControl>
      <FormLabel htmlFor={hashtype}>{hashtype}</FormLabel>
      <InputGroup>
        <Input
          w="75%"
          variant={'filled'}
          id={hashtype}
          type="text"
          value={value}
          readOnly
          cursor={'progress'}
          overflow={'hidden'}
          textOverflow={'ellipsis'}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="xs"
            onClick={() => {
              clipboard.writeText(value);
            }}
          >
            Copy
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};
