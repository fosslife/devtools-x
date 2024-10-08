import { Group, Stack, Textarea } from "@mantine/core";
import { useState } from "react";

const sampleDecoded =
  "https://www.example.com? abc =-+!?@#$%^&*()_+ 1234567890 qwertyuiopasdfghjklzxcvbnm ;:'\"\\|,./<>?`~ ";

export default function UrlEncoderDecoder() {
  const [decoded, setDecoded] = useState(sampleDecoded);
  const [encoded, setEncoded] = useState(encodeURIComponent(sampleDecoded));

  return (
    <Stack>
      <Group wrap="nowrap" align="start" h="100%">
        <Textarea
          w={"50%"}
          autosize
          minRows={15}
          placeholder={sampleDecoded}
          maxRows={30}
          value={decoded}
          onChange={(e) => {
            setDecoded(e.currentTarget.value);
            setEncoded(encodeURIComponent(e.currentTarget.value));
          }}
        />
        <Textarea
          w={"50%"}
          autosize
          minRows={15}
          placeholder={sampleDecoded}
          maxRows={30}
          value={encoded}
          readOnly
          color="red"
        />
      </Group>
    </Stack>
  );
}
