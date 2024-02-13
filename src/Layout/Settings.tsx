import {
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { version } from "../../package.json";

import { db } from "../utils";
import { openFileAndGetData, saveDataToFile } from "../utils/functions";

export const Settings = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const backup = async () => {
    const entries = await db.entries();

    await saveDataToFile(
      JSON.stringify(
        entries.reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})
      ),
      "Backup current configuration",
      [{ name: "json", extensions: ["json"] }],
      {
        title: "Backup success",
        message: "Setting backed up successfully",
      }
    );
  };

  const restore = async () => {
    const contents = await openFileAndGetData(
      "Select backup file",
      [{ name: "json", extensions: ["json"] }],
      "text"
    );
    try {
      const parsed = JSON.parse(contents);
      Object.entries(parsed).map(([key, value]) => {
        db.set(key, value);
      });
      notifications.show({
        title: "Success!",
        message: "Settings restored successfully, refreshing UI now",
        autoClose: 2000,
        onClose: () => window.location.reload(),
      });
    } catch {
      notifications.show({
        title: "Error!",
        message: "Invalid backup file",
      });
    }
  };

  return (
    <Stack>
      <Checkbox
        label="Dark Theme"
        checked={colorScheme === "dark"}
        onChange={() => toggleColorScheme()}
      />
      <Divider />
      <Group>
        <Button onClick={backup}>Backup Settings</Button>
        <Divider orientation="vertical" />
        <Button onClick={restore}>Restore Settings</Button>
      </Group>
      <Divider />
      <Text c="dimmed">DevTools-X v{version}</Text>
      <Text c="dimmed">
        File issue at:{" "}
        <Text c="blue">https://github.com/fosslife/devtools-x/issues</Text>
      </Text>
    </Stack>
  );
};
