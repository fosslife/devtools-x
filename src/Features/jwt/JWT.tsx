import { useRef, useState, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Group, Select, Stack, Text, Textarea } from "@mantine/core";
import { SignJWT, jwtVerify, decodeJwt, decodeProtectedHeader } from "jose";

// import base64url from "base64url";

const algorithms = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512",
];

/**
 * Don't use monaco wrapper for this component
 * this is extremly customized component,
 * the common wrapper won't fit here unless we change it.
 */
const JWTEditor = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [algorithm, setAlgorithm] = useState<string>("HS256");
  const [jwt, setJwt] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const [payload, setPayload] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>("");

  const [secret, setSecret] = useState<string>("your-256-bit-secret");

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

  const verifyJwt = async (secret: string) => {
    try {
      const key = new TextEncoder().encode(secret);
      await jwtVerify(jwt, key, { algorithms: [algorithm] });
      setIsVerified(true);
    } catch (e) {
      setIsVerified(false);
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      const jwt = await new SignJWT({
        foo: "bar",
        name: "John Doe",
      })
        .setProtectedHeader({ alg: algorithm, typ: "JWT" })
        .setIssuedAt()
        .setIssuer("https://jwt.io")
        .setAudience("https://jwt.io")
        .setExpirationTime("2h")
        .setSubject("subject")
        .sign(new TextEncoder().encode(secret));

      setJwt(jwt);
      await verifyJwt(secret);
    })();
    // Note: should be returned but throws an error when formatted
    () => {
      editorRef.current?.dispose();
      setJwt("");
    };
  }, [algorithm]);

  useEffect(() => {
    if (jwt) {
      const parts = jwt.split(".");
      if (parts.length === 3) {
        const [headerPart, payloadPart, signaturePart] = parts;

        try {
          const decodedPayload = decodeJwt(`${jwt}`);
          setPayload(JSON.stringify(decodedPayload, null, 2));
        } catch (e) {
          setPayload(payloadPart);
        }

        try {
          const decodedHeader = decodeProtectedHeader(jwt);
          setHeader(JSON.stringify(decodedHeader, null, 2));
        } catch (e) {
          setHeader(headerPart);
        }

        setSignature(signaturePart);
      }
      (async () => {
        await verifyJwt(secret);
      })();
    }
  }, [signature, jwt]);

  return (
    <Group h="100%" w={"100%"} wrap="nowrap" align="start">
      <Editor
        height="100%"
        width={"50%"}
        defaultLanguage="jwt"
        onChange={(e) => setJwt(e || "")}
        value={jwt}
        options={{
          fontSize: 18,
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
        <Text c="dimmed" size="sm">
          <strong>Header:</strong> Algorithm and Token Type
          <Select
            data={algorithms}
            value={algorithm}
            onChange={(e) => setAlgorithm(e as string)}
          />
        </Text>
        <Editor
          path="header.json"
          height="20%"
          width="100%"
          defaultLanguage="json"
          defaultValue={header}
          value={header}
          options={{
            minimap: { enabled: false },
            lineNumbers: "off",
          }}
        />
        <Text c="dimmed" size="sm">
          <strong>Payload:</strong> Data
        </Text>
        <Editor
          path="payload.json"
          height="40%"
          width="100%"
          defaultLanguage="json"
          defaultValue={payload}
          value={payload}
          options={{
            minimap: { enabled: false },
            lineNumbers: "off",
          }}
        />
        <Text c="dimmed" size="sm">
          <strong>Verify Signature</strong>
        </Text>
        <div
          style={{
            color: isVerified ? "green" : "red",
            border: "1px solid",
            borderColor: isVerified ? "green" : "red",
            height: "10%",
          }}
        >
          <Editor
            path="signature.txt"
            width="100%"
            defaultLanguage="plaintext"
            defaultValue={signature}
            value={signature}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              wordWrap: "on",
              scrollbar: { vertical: "hidden", horizontal: "hidden" },
            }}
          />
        </div>
        <Text c="dimmed" size="sm">
          <strong>Secret</strong>
        </Text>
        <Textarea
          value={secret}
          onChange={async (e) => {
            setSecret(e.target.value as string);
            // Todo check if this can be done in a better way
            await verifyJwt(e.target.value);
          }}
        />
      </Stack>
    </Group>
  );
};

export default JWTEditor;
