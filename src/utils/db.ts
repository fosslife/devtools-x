import { fs, path } from "@tauri-apps/api";
import { BaseDirectory } from "@tauri-apps/api/fs";
import { Low } from "lowdb";

// const dir = await path.appDir();

class CustomAdaptor {
  // Optional: your adapter can take arguments
  constructor() {}

  async read() {
    const data = await fs.readTextFile("conf.json", { dir: BaseDirectory.App });
    if (!data) {
      return "";
    }
    return JSON.parse(data);
  }

  async write(data: any) {
    await fs
      .writeFile(
        {
          path: "conf.json",
          contents: JSON.stringify(data),
        },
        {
          dir: BaseDirectory.App,
        }
      )
      .catch((e) => {
        console.error("Error", e);
      });
  }
}

try {
  console.log("Reading conf dir");
  // await fs.readDir("", { dir: BaseDirectory.Config });
  await fs.readDir("devtools", { dir: BaseDirectory.Config });
  console.log("dir exists");
  try {
    await fs.readTextFile("conf.json", { dir: BaseDirectory.App });
  } catch (e) {
    console.error("conf file doesnt exist, creating one", e);
    try {
      console.log("Creating conf file");
      await fs.writeFile(
        {
          path: "conf.json",
          contents: "{}",
        },
        {
          dir: BaseDirectory.App,
        }
      );
      console.log("conf file created successfully");
    } catch (x) {
      console.log("issue writting a file", x);
    }
  }
} catch (e) {
  console.log("conf dir doesn't exist, creating one", e);
  try {
    // await fs.createDir("")
    const p = await path.appDir();
    console.log("app dir is", p);
    await fs.createDir("devtools", {
      dir: BaseDirectory.Config,
      recursive: true,
    });
    console.log("App dir created successfully");
  } catch (x) {
    console.log("creating conf dir failed", e);
  }

  try {
    console.log("Creating conf file");
    await fs.writeFile(
      {
        path: "conf.json",
        contents: "{}",
      },
      {
        dir: BaseDirectory.App,
      }
    );
    console.log("conf file created successfully");
  } catch (y) {
    console.log("Writting conf file failed", y);
  }
}

const adapter = new CustomAdaptor();
// TODO: it's possible to type this.
const db = new Low<any>(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

if (!db.data || Object.keys(db.data).length === 0) {
  // conf file structure
  db.data = {
    jsoneditor: { tabsstate: {} },
    hashes: {},
    pinned: [],
  };
  db.write();
}

export { db };
