// this script will read package.json. tauri.conf.json and Cargo.toml
// and bump the version number in all of them

import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
import { EOL } from "os";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

const tauriConf = JSON.parse(
  readFileSync(join("src-tauri", "tauri.conf.json"), "utf8")
);

const cargoToml = readFileSync(join("src-tauri", "Cargo.toml"), "utf8");

const version = packageJson.version;

const versionParts = version.split(".");

const bumpPart =
  process.argv[2] === "major"
    ? "major"
    : process.argv[2] === "minor"
      ? "minor"
      : "patch";

const newVersion =
  bumpPart === "major"
    ? `${parseInt(versionParts[0]) + 1}.0.0`
    : bumpPart === "minor"
      ? `${versionParts[0]}.${parseInt(versionParts[1]) + 1}.0`
      : `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`;

packageJson.version = newVersion;

tauriConf.package.version = newVersion;

const newCargoToml = cargoToml.replace(
  /version = "(.*)"/,
  `version = "${newVersion}"`
);

writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + EOL);

writeFileSync(
  join("src-tauri", "tauri.conf.json"),
  JSON.stringify(tauriConf, null, 2) + EOL
);
writeFileSync(join("src-tauri", "Cargo.toml"), newCargoToml);

console.log("Version bumped to", newVersion);
