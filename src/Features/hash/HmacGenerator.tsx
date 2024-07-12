import { Divider, Stack, Textarea, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useEffect, useState } from "react";

export default function HmacGenerator() {
  const [hmac, setHmac] = useState("");
  const [input, setInput] = useInputState("");
  const [secret, setSecret] = useInputState("");

  useEffect(() => {
    if (input && secret) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const key = encoder.encode(secret);
      crypto.subtle
        .importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, [
          "sign",
        ])
        .then((key) =>
          crypto.subtle.sign("HMAC", key, data).then((signature) => {
            const view = new DataView(signature);
            let hex = "";
            for (let i = 0; i < view.byteLength; i += 1) {
              const byte = view.getUint8(i).toString(16);
              hex += byte.length === 1 ? `0${byte}` : byte;
            }
            setHmac(hex);
          })
        );
    } else {
      setHmac("");
    }
  }, [input, secret]);

  return (
    <Stack>
      <Textarea
        minRows={5}
        autosize
        value={input}
        onChange={setInput}
        placeholder="Enter input data"
      />
      <TextInput
        placeholder="Enter secret key"
        value={secret}
        onChange={setSecret}
      />
      <Divider label="HMAC" />
      <Textarea placeholder="generated HMAC" value={hmac} readOnly />
    </Stack>
  );
}
