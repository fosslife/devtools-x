import {
  Button,
  Divider,
  Group,
  rem,
  Select,
  Stack,
  Switch,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconMoon, IconSun, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { version } from "../../package.json";

import { db } from "@/utils";
import { openFileAndGetData, saveDataToFile } from "@/utils/functions";
import { confirm } from "@tauri-apps/api/dialog";
import { useLocalStorage } from "@mantine/hooks";
import { useAppContext } from "@/Contexts/AppContextProvider";
import { themes } from "./themes";

export const Settings = () => {
  const { config, handleConfig } = useAppContext();
  const { toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const [groupItems, setGroupItems] = useLocalStorage({
    key: "groupItems",
    defaultValue: true,
  });

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconMoon
      style={{ width: rem(16), height: rem(16) }}
      color={theme.colors.blue[6]}
    />
  );

  const yesIcon = (
    <IconCheck
      style={{ width: rem(16), height: rem(16) }}
      color={theme.colors.green[6]}
    />
  );

  const noIcon = (
    <IconX
      style={{ width: rem(16), height: rem(16) }}
      color={theme.colors.red[6]}
    />
  );

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

  const resetSidebar = async () => {
    let c = await confirm("reset sidebar order?", {
      title: "Reset sidebar",
      type: "warning",
    });
    if (c) {
      await db.set("sidebar", []);
      window.location.reload();
    }
  };

  return (
    <Stack>
      <Switch
        label="Theme"
        size="md"
        color="dark.4"
        onLabel={sunIcon}
        offLabel={moonIcon}
        onChange={toggleColorScheme}
      />
      <Switch
        label="Group sidebar items"
        size="md"
        color="dark.4"
        checked={groupItems}
        onLabel={yesIcon}
        offLabel={noIcon}
        onChange={() => setGroupItems(!groupItems)}
      />
      <Divider />
      <Group>
        <Button onClick={backup}>Backup Settings</Button>
        <Divider orientation="vertical" />
        <Button onClick={restore}>Restore Settings</Button>
      </Group>

      <Divider />
      <Group>
        <Button onClick={resetSidebar}>Reset sidebar order</Button>
      </Group>
      <Divider />
      <Select
        searchable
        data={themes}
        value={config.editorThemeDark}
        onChange={(e) => handleConfig({ editorThemeDark: e as string })}
      />
      <Select
        searchable
        data={themes}
        value={config.editorThemeLight}
        onChange={(e) => handleConfig({ editorThemeLight: e as string })}
      />

      <Divider />
      <Text c="dimmed">DevTools-X v{version}</Text>
      <Text c="dimmed">File issue at: </Text>
      <Text c="blue">https://github.com/fosslife/devtools-x/issues</Text>
    </Stack>
  );
};
