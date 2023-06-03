import { notifications } from "@mantine/notifications";
import { open, save } from "@tauri-apps/api/dialog";
import { readBinaryFile, readTextFile, writeFile } from "@tauri-apps/api/fs";

interface DialogFilter {
  /** Filter name. */
  name: string;
  /**
   * Extensions to filter, without a `.` prefix.
   * @example
   * ```typescript
   * extensions: ['svg', 'png']
   * ```
   */
  extensions: string[];
}

type FileType = "text" | "binary";

type ResponseType<T extends FileType> = T extends "text" ? string : Uint8Array;

export async function openFileAndGetData<T extends FileType>(
  title: string,
  dialogFilter: DialogFilter[],
  fileType: T
): Promise<ResponseType<T>> {
  const file = await open({
    title: title,
    directory: false,
    multiple: false,
    filters: dialogFilter,
  });

  if (!file) {
    throw notifications.show({
      title: "Error!",
      message: "No file selected",
      color: "red",
    });
  } else {
    const data =
      fileType === "text"
        ? ((await readTextFile(file as string)) as unknown as Promise<
            ResponseType<T>
          >)
        : ((await readBinaryFile(file as string)) as unknown as Promise<
            ResponseType<T>
          >);
    return data;
  }
}

export async function saveDataToFile(
  contents: string,
  title: string,
  filters: DialogFilter[],
  notification?: { message: string; title: string }
) {
  const path = await save({
    title,
    filters,
  });

  if (!path) {
    throw notifications.show({
      title: "Error!",
      message: "No path selected",
      color: "red",
    });
  }

  await writeFile({
    path: path as string,
    contents,
  }).then(() => {
    notifications.show({
      title: notification?.title || "Success!",
      message: notification?.message || "File saved successfully",
      color: "green",
    });
  });
}
