import { Box, Button, Divider, Flex, Textarea } from "@chakra-ui/react";
import { useDebouncedCallback } from "@react-hookz/web/esm";
import { dialog, fs } from "@tauri-apps/api";
import { lib, MD5, SHA1, SHA224, SHA256, SHA512 } from "crypto-js";
import { ChangeEventHandler, useState } from "react";

import { HashBox } from "../../Components/HashBox";
import { db } from "../../utils";

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

  // FIXME: definitely reusable function everywhere.
  const onChangeDeb = useDebouncedCallback(
    (e) => {
      try {
        db.data.hash.editor = JSON.parse(e);
      } catch {
        db.data.hash.editor = e;
      }
      db.write();
    },
    [],
    1000, // delay for debounce
    500 // maxwait ( call at least once every 500ms )
  );

  const ellipsify = (state: HashState) =>
    Object.entries(state).reduce((acc, curr) => {
      return {
        ...acc,
        [curr[0]]: `${curr[1].substring(0, 6)}...${curr[1].substring(
          curr[1].length - 7
        )}`,
      };
    }, init);

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = async (e) => {
    // calculate hash
    const val = e.target.value;
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
    onChangeDeb(e);
  };
  return (
    <Flex
      h="full"
      w="100%"
      gap={3}
      alignSelf={"start"}
      sx={{
        "& div": {
          maxWidth: "98%",
        },
      }}
    >
      <Textarea
        height={"100%"}
        width="60%"
        placeholder="Enter text to hash"
        onChange={onChange}
        resize="none"
      />
      <Flex width={"40%"} gap={2} flexDirection={"column"}>
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
        <Divider mt="10" />
        <Box mt="10">
          <Button
            onClick={async () => {
              const filePath = (await dialog.open({
                multiple: false,
              })) as string; // Multiple is false
              const fileContent = await fs.readBinaryFile(filePath);

              const md5 = MD5(byteArrayToWordArray(fileContent)).toString();
              const sha1 = SHA1(byteArrayToWordArray(fileContent)).toString();
              const sha256 = SHA256(
                byteArrayToWordArray(fileContent)
              ).toString();
              const sha512 = SHA512(
                byteArrayToWordArray(fileContent)
              ).toString();
              const sha224 = SHA224(
                byteArrayToWordArray(fileContent)
              ).toString();

              const state = {
                md5,
                sha1,
                sha256,
                sha512,
                sha224,
              };
              setHashes(ellipsify(state));
            }}
          >
            Calculate hashes of a file
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
// Thousands of thanks to this guy for this function: https://gist.github.com/artjomb/7ef1ee574a411ba0dd1933c1ef4690d1
function byteArrayToWordArray(ba: number[]) {
  const wa: number[] = [];
  for (let i = 0; i < ba.length; i++) {
    wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
  }

  return lib.WordArray.create(wa, ba.length);
}

// TODO: toggle for 'full hash mode', skips middle text of hash and shows starting and ending of hash
// TODO: add copy success toast? animation?
// TODO: hashes are costly, use LRU memoisation?
// HELP: use this to verify : https://www.browserling.com/tools/all-hashes

export default Hash;
