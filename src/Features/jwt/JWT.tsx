import { Stack } from "@mantine/core";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { useEffect, useState } from "react";

import { Monaco } from "../../Components/MonacoWrapper";

const JWT = () => {
  const [jwt, setJwt] = useState({
    token: "",
    decoded: {},
    headers: {},
  });

  useEffect(() => {
    if (jwt.token) {
      try {
        let decoded = decodeJwt(jwt.token);
        let headers = decodeProtectedHeader(jwt.token);
        setJwt({ ...jwt, decoded: decoded, headers: headers });
      } catch {
        // ignore error I guess?
        setJwt({ token: "", decoded: "Invalid TOken", headers: "" });
      }
    }
  }, [jwt]);

  return (
    <Stack p={2} style={{ width: "100%", height: "100%" }}>
      Token:
      <Monaco
        language="text"
        height="30%"
        setValue={(e) => setJwt({ ...jwt, token: e || "" })}
      />
      Payload:
      <Monaco
        language="json"
        height="30%"
        value={JSON.stringify(jwt.decoded, null, 2)}
        extraOptions={{ readOnly: true }}
      />
      Headers:
      <Monaco
        language="json"
        value={JSON.stringify(jwt.headers, null, 2)}
        extraOptions={{ readOnly: true }}
      />
    </Stack>
  );
};

export default JWT;

// TODO: add token verify? any other features?
// TODO: color jwt
