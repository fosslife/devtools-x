import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
//@ts-ignore
import { generatePassword } from "lesspass";
import { useEffect, useState } from "react";

import { IconCheck, IconX } from "@tabler/icons-react";

import { OutputBox } from "@/Components/OutputBox";
import { db } from "@/utils";
import { QuantityInput } from "./Counter";

type Config = {
  options: string[];
  counter: number;
  length: number;
};

type StoredData = {
  site: Config;
};

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
  const [length, setLength] = useState<string | number>(12);
  const [counter, setCounter] = useState<string | number>(1);
  const [generated, setGenerated] = useState("");
  const [val, setVal] = useState("");
  const [prevData, setPrevData] = useState<StoredData>();

  const loadConfig = (site: string, config: Config) => {
    setSite(site);
    setOptions([...config.options]);
    setLength(config.length);
    setCounter(config.counter);
  };

  const store = async () => {
    const prev = await db.get<StoredData>("password");
    if (!site || !masterPassword || !login) return;
    await db
      .set("password", {
        ...prev,
        [site]: {
          counter,
          length,
          options,
        },
      })
      .then(() => {
        if (prevData) {
          setPrevData({
            ...prevData,
            [site]: {
              counter,
              length,
              options,
            },
          });
        }

        notifications.show({
          title: "Done",
          icon: <IconCheck />,
          message: "Data stored to db",
        });
      });
  };

  useEffect(() => {
    async function getPrevData() {
      const data = await db.get<StoredData>("password");
      if (data) {
        setPrevData({ ...data });
      }
    }
    getPrevData();
  }, []);

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
    <Stack>
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
        <Group gap={50} grow>
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
      <Group grow>
        <Button onClick={() => setVal(generated)}>Generate</Button>
        <Tooltip label="This will store site, options and counter to a volatile DB. Think carefully">
          <Button onClick={store}>Store</Button>
        </Tooltip>
      </Group>
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
      <Stack>
        <Text size={"sm"} color="dimmed">
          NOTE: This is just a custom implementation of lesspass.com. Visit
          their site and github to know more about it
        </Text>
      </Stack>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Site</Table.Th>
            <Table.Th>Options</Table.Th>
            <Table.Th>Length</Table.Th>
            <Table.Th>Counter</Table.Th>
            <Table.Th>manage</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {prevData &&
            Object.entries(prevData).map(([site, config]) => (
              <Table.Tr key={site}>
                <Table.Td>{site}</Table.Td>
                <Table.Td>
                  {config.options.map((o) => (
                    <Badge size="xs" key={o}>
                      {o}
                    </Badge>
                  ))}
                </Table.Td>
                <Table.Td>{config.length}</Table.Td>
                <Table.Td>{config.counter}</Table.Td>
                <Table.Td>
                  <Group>
                    <ActionIcon
                      title="Load config"
                      onClick={() => loadConfig(site, config)}
                      variant="filled"
                    >
                      <IconCheck />
                    </ActionIcon>
                    <ActionIcon
                      title="Delete Record"
                      onClick={() => {
                        // @ts-ignore
                        delete prevData[site];
                        setPrevData({ ...prevData });
                        db.set("password", { ...prevData });
                      }}
                      variant="filled"
                    >
                      <IconX />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
};
export default StatelessPassword;
