import { fs, path } from "@tauri-apps/api";
import { Low } from "lowdb";

const getAppDir = () => {
  return path.appDir();
};

const getConfFile = async () => {
  return path.join(await getAppDir(), "conf.json");
};

class CustomAdaptor {
  // Optional: your adapter can take arguments
  constructor() {}

  async read() {
    const data = await fs.readTextFile(await getConfFile());
    if (!data) {
      return "";
    }
    return JSON.parse(data);
  }

  async write(data: any) {
    await fs
      .writeFile({
        path: await getConfFile(),
        contents: JSON.stringify(data),
      })
      .catch((e) => {
        console.error("EEE", e);
      });
  }
}

const dir = await path.appDir();
try {
  await fs.readDir(dir);
  console.log("dir exists");
  try {
    await fs.readTextFile(await path.join(dir, "conf.json"));
  } catch (e) {
    console.error("conf file doesnt exist, creating one", e);
    await fs.writeFile({
      path: `${dir}${path.sep}conf.json`,
      contents: "{}",
    });
  }
} catch {
  console.log("conf dir doesn't exist, creating one");
  await fs.createDir(dir);
  await fs.writeFile({
    path: `${dir}${path.sep}conf.json`,
    contents: "{}",
  });
}

const adapter = new CustomAdaptor();
// TODO: it's possible to type this.
const db = new Low<any>(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

console.log("DB:", db.data);

if (!db.data || Object.keys(db.data).length === 0) {
  // conf file structure
  db.data = {
    json: {
      editor: "",
      diff: "",
    },
    hash: {
      editor: "",
    },
  };
  db.write();
}

export { db };
