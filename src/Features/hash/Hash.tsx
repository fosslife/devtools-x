import { Box, Flex } from "@chakra-ui/react";
import Editor, { OnChange, type OnMount } from "@monaco-editor/react";
import { useDebouncedCallback } from "@react-hookz/web/esm";
import { MD5, SHA1, SHA256, SHA512, SHA224 } from "crypto-js";
import { useRef, useState } from "react";
import { HashBox } from "../../Components/HashBox";
import { db } from "../../utils";

const init = {
  md5: "",
  sha1: "",
  sha256: "",
  sha512: "",
  sha224: "",
};

const Hash = () => {
  const editorRef = useRef<any>(null);
  const [hashes, setHashes] = useState(init);

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

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

  const onChange: OnChange = async (e) => {
    // calculate hash
    if (!e) {
      setHashes({ ...init });
      return;
    }
    const md5hash = MD5(e).toString();
    const sha1Hash = SHA1(e).toString();
    const sha256Hash = SHA256(e).toString();
    const sha512Hash = SHA512(e).toString();
    const sha224Hash = SHA224(e).toString();

    // set state
    setHashes(() => {
      const state = {
        md5: md5hash,
        sha1: sha1Hash,
        sha256: sha256Hash,
        sha512: sha512Hash,
        sha224: sha224Hash,
      };
      const parsed = Object.entries(state).reduce((acc, curr) => {
        return {
          ...acc,
          [curr[0]]: `${curr[1].substring(0, 6)}...${curr[1].substring(
            curr[1].length - 7
          )}`,
        };
      }, init);

      return parsed;
    });
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
      <Editor
        options={{
          minimap: { enabled: false },
          contextmenu: false,
        }}
        defaultLanguage="text"
        theme="vs-dark"
        height={"95%"}
        defaultValue={"Enter string to hash"}
        onMount={onMount}
        onChange={onChange}
        width={"60%"}
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
      </Flex>
    </Flex>
  );
};

// TODO: toggle for 'full hash mode', skips middle text of hash and shows starting and ending of hash
// TODO: add copy success toast? animation?
// TODO: hashes are costly, use LRU memoisation?
// HELP: use this to verify : https://www.browserling.com/tools/all-hashes

export default Hash;
