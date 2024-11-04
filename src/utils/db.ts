import { LazyStore } from "@tauri-apps/plugin-store";
import { defaultConfig } from "@/Contexts/AppContextProvider";

const db = new LazyStore("settings.json");

if (!(await db.length())) {
  await Promise.all([
    db.set("firstTime", true),
    db.set("jsoneditor", {}),
    db.set("hashes", ""),
    db.set("pinned", []),
    db.set("epoch", {}),
    db.set("password", {}),
    db.set("sidebar", []),
    db.set("config", defaultConfig),
  ]);
  await db.save();
}

if (import.meta.env.DEV) {
  (window as any).db = db;
}
export { db };
