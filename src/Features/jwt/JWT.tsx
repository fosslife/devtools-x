import { Flex, Textarea } from "@chakra-ui/react";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { useEffect, useState } from "react";

// const token = test token:
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const JWT = () => {
  const [jwt, setJwt] = useState({
    token: "",
    decoded: {},
    headers: {},
  });

  useEffect(() => {
    if (jwt.token) {
      let decoded = decodeJwt(jwt.token);
      let headers = decodeProtectedHeader(jwt.token);
      setJwt({ ...jwt, decoded: decoded, headers: headers });
    }
  }, [jwt]);

  return (
    <Flex
      h="full"
      w="100%"
      gap={3}
      alignSelf={"start"}
      flexDir="column"
      sx={{
        "& div": {
          maxWidth: "98%",
        },
      }}
    >
      <Textarea
        onChange={(e) => setJwt({ ...jwt, token: e.target.value })}
        resize={"none"}
        placeholder="Enter JWT"
      />
      Payload:
      <Textarea
        height={60}
        readOnly
        resize={"none"}
        value={JSON.stringify(jwt.decoded, null, 2)}
      />
      Headers:
      <Textarea
        height={40}
        readOnly
        resize={"none"}
        value={JSON.stringify(jwt.headers, null, 2)}
      />
    </Flex>
  );
};

export default JWT;

// TODO: add token verify? any other features?
