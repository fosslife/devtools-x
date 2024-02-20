import { Store } from "tauri-plugin-store-api";

const db = new Store("settings.json");

if (!(await db.length())) {
  await Promise.all([
    db.set("jsoneditor", {}),
    db.set("hashes", ""),
    db.set("pinned", []),
    db.set("epoch", {}),
    db.set("password", {}),
    db.set("sidebar", []),
  ]);
  await db.save();
}

if (import.meta.env.DEV) {
  (window as any).db = db;
}
export { db };
