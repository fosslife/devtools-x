import { Flex, Heading } from "@chakra-ui/react";
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
    console.log("jrw", jwt);
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
    <Flex h="full" w="100%" gap={3} alignSelf={"start"} flexDir="column" pl="2">
      <Heading>JWT</Heading>
      <Monaco
        language="text"
        height="30%"
        setValue={(e) => setJwt({ ...jwt, token: e || "" })}
      />
      Payload:
      <Monaco
        language="text"
        height="30%"
        value={JSON.stringify(jwt.decoded, null, 2)}
        extraOptions={{ readOnly: true }}
      />
      Headers:
      <Monaco
        language="text"
        value={JSON.stringify(jwt.headers, null, 2)}
        extraOptions={{ readOnly: true }}
      />
    </Flex>
  );
};

export default JWT;

// TODO: add token verify? any other features?
// TODO: color jwt
