import { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Group, Select, Stack, Text } from "@mantine/core";
import { decodeJwt, decodeProtectedHeader, jwtVerify, SignJWT } from "jose";

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
  const [secretBase64, setSecretBase64] = useState<boolean>(false);

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
      }
      (async () => {
        await verifyJwt(secret);
      })();
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
        <div
          className="editor__red"
          style={{
            height: "20%",
          }}
        >
          <Editor
            path="header.json"
            height="100%"
            width="100%"
            defaultLanguage="json"
            defaultValue={header}
            value={header}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
            }}
          />
          <style>{`.editor__red * { color: #fb015b; }`}</style>
        </div>
        <Text c="dimmed" size="sm">
          <strong>Payload:</strong> Data
        </Text>

        <div
          className="editor__purple"
          style={{
            height: "30%",
          }}
        >
          <Editor
            path="payload.json"
            height="100%"
            width="100%"
            defaultLanguage="json"
            defaultValue={payload}
            value={payload}
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
            }}
          />
          <style>{`.editor__purple * { color: #d63aff; }`}</style>
        </div>
        <Text c="dimmed" size="sm">
          <strong>Secret</strong> {isVerified ? "Verified" : "Not Verified"}
        </Text>
        <div
          style={{
            border: "1px solid #666",
            fontSize: 14,
            borderRadius: 4,
            padding: "0.5em",
            color: "#00b9f1",
          }}
        >
          <div>
            HMAC{algorithm.replaceAll(" ", "").toUpperCase()}
            {"("}
          </div>
          <div style={{ marginLeft: "1em" }}>
            base64UrlEncode(header) + {'"."'} +
          </div>
          <div style={{ marginLeft: "1em" }}>base64UrlEncode(payload),</div>
          <input
            value={secret}
            onChange={async (e) => {
              setSecret(e.target.value as string);
              // Todo check if this can be done in a better way
              await verifyJwt(e.target.value);
            }}
            style={{
              marginLeft: "1em",
              maxWidth: "calc(100% - 1em)",
              width: 170,
              fontSize: 12,
              border: "0.5px solid rgba(0,185,241,0.47)",
              borderRadius: 4,
              outline: "none",

              padding: "0.5em",
            }}
          />

          <div>
            ){/* Todo implement this checkbox 8_8 */}
            <input
              type="checkbox"
              checked={secretBase64}
              onChange={(e) => setSecretBase64(e.target.checked)}
              style={{ marginLeft: "0.2em" }}
            />
            secret base64 encoded
          </div>
        </div>
      </Stack>
    </Group>
  );
};

export default JWTEditor;
