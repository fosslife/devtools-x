import { Box, LoadingOverlay, Stack } from "@mantine/core";
import { MD5, SHA1, SHA224, SHA256, SHA512 } from "crypto-js";
import { useEffect, useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";
import { db } from "../../utils";
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
  const [loading, setLoading] = useState(false);
  const [editorText, setEditorText] = useState("Hello World");

  useEffect(() => {
    // calculate dummy hashes of first text
    async function firsthashes() {
      const firstText = await db.get<string>("hash");
      if (firstText) {
        onChange(firstText);
        return;
      }
      onChange("Enter Text");
    }
    firsthashes();
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

    db.set("hash", val);
    // set state
    // setHashes(ellipsify(state));
    setHashes(state);
    setLoading(false);
    setEditorText(val);
  };

  return (
    <Stack
      style={{
        height: "100%",
      }}
    >
      <LoadingOverlay visible={loading} />
      <Monaco
        language="text"
        height="100%"
        width="100%"
        value={editorText}
        setValue={onChange}
      />
      <Stack gap={"lg"} pr={"sm"}>
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
      </Stack>
    </Stack>
  );
};

export default Hash;
