import { path, fs } from "@tauri-apps/api";

export const setupConfig = async () => {
  const appdir = await path.appDir();
  console.log("appdir", appdir);
  fs.readDir(appdir)
    .then((exists) => {
      console.log("config dir exists", exists);
    })
    .then(() => {
      //check if config file exists
      fs.readTextFile(`${appdir}/conf.json`)
        .then(() => {
          console.log("config file exists");
          //file exists
        })
        .catch(() => {
          console.log("file doesn't exists, creating one");
          fs.writeFile({ path: `${appdir}/conf.json`, contents: "" });
        });
    })
    .catch((notExits: string) => {
      console.log("not exists", notExits);
      if (notExits.includes("os error 3")) {
        // doesn't exist
        fs.createDir(appdir);
        console.log("config dir didn't exist, created!");

        fs.writeFile({ path: `${appdir}/conf.json`, contents: "" });
      }
    });
};
