import { Box, Button, LoadingOverlay, Stack, Text } from "@mantine/core";
import { dialog, fs } from "@tauri-apps/api";
import { lib, MD5, SHA1, SHA224, SHA256, SHA512 } from "crypto-js";
import { useEffect, useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";
// import { db } from "../../utils";
import { HashBox } from "./HashBox";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // calculate dummy hashes of first text
    onChange("Enter Text");
    // console.log(db.data);
  }, []);

  // const ellipsify = (state: HashState) =>
  //   Object.entries(state).reduce((acc, curr) => {
  //     return {
  //       ...acc,
  //       [curr[0]]: `${curr[1].substring(0, 10)}....${curr[1].substring(
  //         curr[1].length - 10
  //       )}`,
  //     };
  //   }, init);

  const onChange = async (val: string | undefined) => {
    // calculate hash
    if (!val) {
      setHashes({ ...init });
      return;
    }
    setLoading(true);
    const md5hash = MD5(val).toString().toUpperCase();
    const sha1Hash = SHA1(val).toString().toUpperCase();
    const sha256Hash = SHA256(val).toString().toUpperCase();
    const sha512Hash = SHA512(val).toString().toUpperCase();
    const sha224Hash = SHA224(val).toString().toUpperCase();
    const state = {
      md5: md5hash,
      sha1: sha1Hash,
      sha256: sha256Hash,
      sha512: sha512Hash,
      sha224: sha224Hash,
    };
    // set state
    // setHashes(ellipsify(state));
    setHashes(state);
    setLoading(false);
  };

  const selectFile = async () => {
    const filePath = (await dialog.open({
      multiple: false,
    })) as string; // Multiple is false
    setFilePath(filePath);

    console.time("t1");
    const fileContent = await fs.readBinaryFile(filePath);
    setLoading(true);
    const wordArray = byteArrayToWordArray(fileContent);
    const md5 = MD5(wordArray).toString().toUpperCase();
    const sha1 = SHA1(wordArray).toString().toUpperCase();
    const sha256 = SHA256(wordArray).toString().toUpperCase();
    const sha512 = SHA512(wordArray).toString().toUpperCase();
    const sha224 = SHA224(wordArray).toString().toUpperCase();

    const state = {
      md5,
      sha1,
      sha256,
      sha512,
      sha224,
    };
    // setHashes(ellipsify(state));
    setHashes(state);
    console.timeEnd("t1");
    setLoading(false);
  };

  return (
    <Stack style={{ height: "100%", width: "100%" }} p="xs" spacing={"lg"}>
      <LoadingOverlay visible={loading} />
      <Monaco
        language="text"
        height="50%"
        value={"Enter Text"}
        setValue={onChange}
      />
      <Stack spacing={"lg"} pr={"sm"}>
        <Stack>
          <Box>
            <HashBox value={hashes.md5} hashtype="MD5" />
          </Box>
          <Box>
            <HashBox value={hashes.sha1} hashtype="SHA1" />
          </Box>
          <Box>
            <HashBox value={hashes.sha224} hashtype="SHA224" />
          </Box>
          <Box>
            <HashBox value={hashes.sha256} hashtype="SHA256" />
          </Box>
          <Box>
            <HashBox value={hashes.sha512} hashtype="SHA512" />
          </Box>
        </Stack>

        <Box>
          <Button onClick={selectFile}>Select a File</Button>
          <Text>{filePath ? filePath : ""}</Text>
        </Box>
      </Stack>
    </Stack>
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
