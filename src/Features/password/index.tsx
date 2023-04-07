import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
//@ts-ignore
import { generatePassword } from "lesspass";
import { useEffect, useState } from "react";

import { OutputBox } from "../../Components/OutputBox";
import { QuantityInput } from "./Counter";

const StatelessPassword = () => {
  const [site, setSite] = useState("");
  const [login, setLogin] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [options, setOptions] = useState<string[]>([
    "lowercase",
    "uppercase",
    "digits",
    "symbols",
  ]);
  const [length, setLength] = useState(12);
  const [counter, setCounter] = useState(1);
  const [generated, setGenerated] = useState("");
  const [val, setVal] = useState("");

  useEffect(() => {
    if (!site || !login || !masterPassword) {
      setGenerated("");
      return;
    }
    setVal("");

    generatePassword(
      {
        site,
        login,
        length,
        counter,
        ...options.reduce(
          (acc: {}, cur: string) => ({ ...acc, [cur]: true }),
          {}
        ),
      },
      masterPassword
    )
      .then(setGenerated)
      .catch(console.error);
  }, [site, login, masterPassword, options, length, counter]);

  return (
    <Stack sx={{ width: "100%", height: "100%" }} p={2} spacing={"xl"}>
      <TextInput
        error={site.length < 1}
        value={site}
        onChange={(e) => setSite(e.target.value)}
        label="Site"
        placeholder="Website URL"
      />
      <TextInput
        error={login.length < 1}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        label="Username"
        placeholder="Username/Email"
      />
      <PasswordInput
        error={masterPassword.length < 1}
        description={
          masterPassword.length < 8
            ? "Stronger master password is recommended"
            : ""
        }
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
        label="Master Password"
        placeholder="Master Password"
      />

      <Checkbox.Group
        // defaultValue={}
        onChange={setOptions}
        value={options}
        label="Options"
        styles={{ label: { marginBlock: 10 } }}
      >
        <Group spacing={50} grow>
          <Checkbox label="lowercase" value={"lowercase"} />
          <Checkbox label="uppercase" value={"uppercase"} />
          <Checkbox label="digits" value={"digits"} />
          <Checkbox label="symbols" value={"symbols"} />
        </Group>
      </Checkbox.Group>

      <Group grow>
        <QuantityInput
          min={6}
          max={35}
          label="Length"
          value={length}
          onChange={setLength}
        />
        <QuantityInput
          min={1}
          max={35}
          label="Counter"
          value={counter}
          onChange={setCounter}
        />
      </Group>
      <Button onClick={() => setVal(generated)} fullWidth>
        Generate
      </Button>
      {val && (
        <Group grow mr={20}>
          <OutputBox
            label="Generated password"
            value={generated}
            type="password"
            size="md"
          />
        </Group>
      )}
    </Stack>
  );
};
export default StatelessPassword;
