import { useRef, useState, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Group, Stack } from "@mantine/core";
import { SignJWT, decodeJwt, decodeProtectedHeader } from "jose";

/**
 * Don't use monaco wrapper for this component
 * this is extremly customized component,
 * the common wrapper won't fit here unless we change it.
 */
const JWTEditor = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [jwt, setJwt] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const [payload, setPayload] = useState<string>("");
  // TODO: Implement signature
  // const [signature, setSignature] = useState<string>("");

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register custom language
    monaco.languages.register({ id: "jwt" });
    monaco.languages.setMonarchTokensProvider("jwt", {
      tokenizer: {
        root: [
          [/^[^.]+/, "jwt-header"],
          [/\./, "jwt-dot"],
          [/[^.]+(?=\.)/, "jwt-payload"],
          [/[^.]+$/, "jwt-signature"],
        ],
      },
    });

    import("monaco-themes/themes/Tomorrow-Night.json").then((data: any) => {
      monaco.editor.defineTheme("jwtTheme", {
        base: "vs-dark",
        inherit: false,
        rules: [
          { token: "jwt-header", foreground: "fb015b" },
          { token: "jwt-payload", foreground: "d63aff" },
          { token: "jwt-signature", foreground: "00b9f1" },
          { token: "jwt-dot", foreground: "ffffff" },
          ...data.rules,
        ],
        colors: {
          ...data.colors,
        },
      });
      monaco.editor.setTheme("jwtTheme");
    });
  };

  useEffect(() => {
    (async () => {
      const jwt = await new SignJWT({
        foo: "bar",
        name: "John Doe",
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setIssuer("https://jwt.io")
        .setAudience("https://jwt.io")
        .setExpirationTime("2h")
        .setSubject("subject")
        .sign(new Uint8Array(32));

      setJwt(jwt);
    })();

    () => {
      editorRef.current?.dispose();
      setJwt("");
    };
  }, []);

  useEffect(() => {
    if (jwt) {
      const decodedheader = decodeProtectedHeader(jwt);
      setHeader(JSON.stringify(decodedheader, null, 2));

      const decodedPayload = decodeJwt(jwt);
      setPayload(JSON.stringify(decodedPayload, null, 2));
    }
  }, [jwt]);

  return (
    <Group h="100%" w={"100%"} wrap="nowrap" align="start">
      <Editor
        height="100%"
        width={"50%"}
        defaultLanguage="jwt"
        onChange={(e) => setJwt(e || "")}
        value={jwt}
        options={{
          minimap: { enabled: false },
          lineNumbers: "off",
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
          wordWrap: "on",
          padding: { top: 10 },
          wrappingStrategy: "advanced",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          scrollbar: { vertical: "hidden", horizontal: "hidden" },
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
        }}
        onMount={handleEditorDidMount}
      />
      <Stack h="100%" w="50%">
        <Editor
          path="header.json"
          height="30%"
          width="100%"
          defaultLanguage="json"
          defaultValue={header}
          value={header}
          options={{
            minimap: { enabled: false },
          }}
        />
        <Editor
          path="payload.json"
          height="40%"
          width="100%"
          defaultLanguage="json"
          defaultValue={payload}
          value={payload}
          options={{
            minimap: { enabled: false },
          }}
        />
      </Stack>
    </Group>
  );
};

export default JWTEditor;

// TODO: Implement signature
// TODO: Token colors
