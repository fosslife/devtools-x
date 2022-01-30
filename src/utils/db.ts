import { Low } from "lowdb";
import { path, fs } from "@tauri-apps/api";

const getAppDir = () => {
  return path.appDir();
};

const getConfFile = async () => {
  return `${await getAppDir()}\conf.json`;
};

//TODO: Json parsing strigify is slow. look for possible alternatives - p5 since conf file will be really small
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

const adapter = new CustomAdaptor();
// TODO: it's possible to type this.
const db = new Low<any>(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

export { db };
