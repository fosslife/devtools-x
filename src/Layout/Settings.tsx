import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { fs } from "@tauri-apps/api";
import { open, save } from "@tauri-apps/api/dialog";

import { db } from "../utils";

export const Settings = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Stack>
      <Checkbox
        label="Dark Theme"
        checked={colorScheme === "dark"}
        onChange={() => toggleColorScheme()}
      />
      <Divider />
      <Group>
        <Button
          onClick={async () => {
            const entries = await db.entries();
            const path = await save({
              defaultPath: "backup.json",
              filters: [{ name: "json", extensions: ["json"] }],
              title: "Backup current configuration",
            });
            if (!path) {
              notifications.show({
                title: "Error!",
                color: "red",
                message: "No path selected",
              });
              return;
            }
            fs.writeTextFile({
              path: path,
              contents: JSON.stringify(
                entries.reduce(
                  (acc, curr) => ({ ...acc, [curr[0]]: curr[1] }),
                  {}
                )
              ),
            }).then(() => {
              notifications.show({
                title: "Saved!",
                message: "Setting backed up successfully",
              });
            });
          }}
        >
          Backup Settings
        </Button>
        <Divider orientation="vertical" />
        <Button
          onClick={async () => {
            const path = (await open({
              directory: false,
              multiple: false,
              title: "Select backup file",
            })) as string;

            if (!path) {
              notifications.show({
                title: "Error!",
                color: "red",
                message: "No file selected",
              });
              return;
            }
            fs.readTextFile(path).then((contents) => {
              try {
                const parsed = JSON.parse(contents);
                Object.entries(parsed).map(([key, value]) => {
                  db.set(key, value);
                });
                notifications.show({
                  title: "Success!",
                  message: "Settings restored successfully, refreshing UI now",
                  onClose: () => window.location.reload(),
                });
              } catch (e) {
                notifications.show({
                  title: "Error!",
                  color: "red",
                  message:
                    "Error parsing given file. Check if format is correct",
                });
              }
            });
          }}
        >
          Restore Settings
        </Button>
      </Group>
    </Stack>
  );
};
