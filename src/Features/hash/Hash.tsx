import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { dialog, fs } from "@tauri-apps/api";
import { lib, MD5, SHA1, SHA224, SHA256, SHA512 } from "crypto-js";
import { useState } from "react";

import { HashBox } from "../../Components/HashBox";
import { Monaco } from "../../Components/MonacoWrapper";

type HashState = {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
  sha224: string;
};

const init = {
  md5: "",
  sha1: "",
  sha256: "",
  sha512: "",
  sha224: "",
};

const Hash = () => {
  const [hashes, setHashes] = useState(init);
  const [filePath, setFilePath] = useState("");

  const ellipsify = (state: HashState) =>
    Object.entries(state).reduce((acc, curr) => {
      return {
        ...acc,
        [curr[0]]: `${curr[1].substring(0, 10)}....${curr[1].substring(
          curr[1].length - 10
        )}`,
      };
    }, init);

  const onChange = async (val: string | undefined) => {
    // calculate hash
    if (!val) {
      setHashes({ ...init });
      return;
    }
    const md5hash = MD5(val).toString();
    const sha1Hash = SHA1(val).toString();
    const sha256Hash = SHA256(val).toString();
    const sha512Hash = SHA512(val).toString();
    const sha224Hash = SHA224(val).toString();
    const state = {
      md5: md5hash,
      sha1: sha1Hash,
      sha256: sha256Hash,
      sha512: sha512Hash,
      sha224: sha224Hash,
    };
    // set state
    setHashes(ellipsify(state));
  };

  const selectFile = async () => {
    const filePath = (await dialog.open({
      multiple: false,
    })) as string; // Multiple is false
    setFilePath(filePath);

    const fileContent = await fs.readBinaryFile(filePath);

    const md5 = MD5(byteArrayToWordArray(fileContent)).toString();
    const sha1 = SHA1(byteArrayToWordArray(fileContent)).toString();
    const sha256 = SHA256(byteArrayToWordArray(fileContent)).toString();
    const sha512 = SHA512(byteArrayToWordArray(fileContent)).toString();
    const sha224 = SHA224(byteArrayToWordArray(fileContent)).toString();

    const state = {
      md5,
      sha1,
      sha256,
      sha512,
      sha224,
    };
    setHashes(ellipsify(state));
  };

  return (
    <Flex
      h="full"
      w="100%"
      gap={3}
      alignSelf={"start"}
      flexDir="column"
      pl="2"
      p="4"
    >
      <Heading>Hashing</Heading>
      <Box>
        <Monaco height="150px" value={"Enter Text"} setValue={onChange} />
      </Box>
      <Flex align={"center"} gap="5">
        <Flex width={"60%"} gap={2} direction="column">
          <Box width={"full"}>
            <HashBox value={hashes.md5} hashtype="MD5" />
          </Box>
          <Box width={"full"}>
            <HashBox value={hashes.sha1} hashtype="SHA-1" />
          </Box>
          <Box width={"full"}>
            <HashBox value={hashes.sha256} hashtype="SHA-256" />
          </Box>
          <Box width={"full"}>
            <HashBox value={hashes.sha512} hashtype="SHA-512" />
          </Box>
          <Box width={"full"}>
            <HashBox value={hashes.sha224} hashtype="SHA-224" />
          </Box>
        </Flex>
        <Divider orientation="vertical"></Divider>
        <Box w="40%">
          <Button w="100%" bgColor={"red.500"} onClick={selectFile}>
            Select a File
          </Button>
          <Text align={"center"} color="gray.400" mt="3">
            {filePath ? filePath : ""}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
// Thousands of thanks to this guy for this function: https://gist.github.com/artjomb/7ef1ee574a411ba0dd1933c1ef4690d1
function byteArrayToWordArray(ba: any) {
  const wa: number[] = [];
  for (let i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return lib.WordArray.create(wa, ba.length);
}

// TODO: toggle for 'full hash mode', skips middle text of hash and shows starting and ending of hash
// TODO: add copy success toast? animation?
// TODO: hashes are costly, use LRU memoisation?
// TODO: show loading spinner for heavy files?
// HELP: use this to verify : https://www.browserling.com/tools/all-hashes

export default Hash;
