import "./anim.css";
import classes from "./App.module.css";
import "@mantine/spotlight/styles.css";

import loadable from "@loadable/component";
import { Box, Drawer, Group } from "@mantine/core";
import { Spotlight } from "@mantine/spotlight";
import { loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// NOTE: keep Num converter here, do not lazy load. there's a rare crashing bug.
import Nums from "./Features/number-tools/Nums";
import { data, Navbar } from "./Layout/Navbar";
import { Settings } from "./Layout/Settings";

// Lazy load components
const Welcome = loadable(() => import("./Components/Welcome"));
const Hash = loadable(() => import("./Features/hash/Hash"));
const FileHash = loadable(() => import("./Features/hash/FileHash"));
const JsonFormatter = loadable(() => import("./Features/json/JsonFormatter"));
const Random = loadable(() => import("./Features/random/Random"));
const JWT = loadable(() => import("./Features/jwt/JWT"));
// const Nums = loadable(() => import("./Features/nums/Nums"));
const Sql = loadable(() => import("./Features/sql/Sql"));
const Colors = loadable(() => import("./Features/colors/Colors"));
const RegexTester = loadable(() => import("./Features/regex/RegexTester"));
const TextDiff = loadable(() => import("./Features/text/TextDiff"));
const Markdown = loadable(() => import("./Features/markdown/Markdown"));
const YamlJson = loadable(() => import("./Features/yaml-json/Yaml"));
const Pastebin = loadable(() => import("./Features/pastebin/Pastebin"));
const Repl = loadable(() => import("./Features/repl/Repl"));
const Image = loadable(() => import("./Features/image/Image"));
const Playground = loadable(() => import("./Features/playground/Playground"));
const Rest = loadable(() => import("./Features/rest/Rest"));
const UnitConverter = loadable(
  () => import("./Features/unitconverter/UnitConverter")
);
const Epoch = loadable(() => import("./Features/epoch/Epoch"));
const Stateless = loadable(() => import("./Features/password"));
const Base64Image = loadable(() => import("./Features/base64/Base64Image"));
const Base64Text = loadable(() => import("./Features/base64/Base64Text"));
const Quicktpe = loadable(() => import("./Features/quicktype/Quicktype"));
const Ping = loadable(() => import("./Features/ping/Ping"));
const Minify = loadable(() => import("./Features/minifiers/Minify"));
const UrlParser = loadable(() => import("./Features/url/UrlParser"));

function App() {
  const location = useLocation();
  const nav = useNavigate();
  // const { classes } = useStyles();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");
  const [settingsOpened, setSettingsOpened] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname)
      setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  useEffect(() => {
    // monaco loader setup
    if (process.env.NODE_ENV === "production") {
      loader.config({ paths: { vs: "/vs" } });
    }
  }, []);

  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.navbar}>
          <Navbar openSettings={(t: boolean) => setSettingsOpened(t)} />
        </Box>
        <Group
          className={`${transitionStage} ${classes.body}`}
          grow
          align="start"
          onAnimationEnd={() => {
            if (transitionStage === "fadeOut") {
              setTransistionStage("fadeIn");
              setDisplayLocation(location);
            }
          }}
        >
          <Routes location={displayLocation}>
            <Route path="/" element={<Welcome />}></Route>
            <Route path="/json-formatter" element={<JsonFormatter />}></Route>
            <Route path="/hash-text" element={<Hash />}></Route>
            <Route path="/hash-file" element={<FileHash />}></Route>
            <Route path="/random" element={<Random />}></Route>
            <Route path="/jwt" element={<JWT />}></Route>
            <Route path="/nums" element={<Nums />}></Route>
            <Route path="/sql" element={<Sql />}></Route>
            <Route path="/colors" element={<Colors />}></Route>
            <Route path="/regex" element={<RegexTester />}></Route>
            <Route path="/text" element={<TextDiff />}></Route>
            <Route path="/markdown" element={<Markdown />}></Route>
            <Route path="/yamljson" element={<YamlJson />}></Route>
            {/* <Route path="/pastebin" element={<Pastebin />}></Route> */}
            <Route path="/repl" element={<Repl />}></Route>
            <Route path="/image" element={<Image />}></Route>
            <Route path="/units" element={<UnitConverter />}></Route>
            <Route path="/playground" element={<Playground />}></Route>
            <Route path="/rest" element={<Rest />}></Route>
            <Route path="/epoch" element={<Epoch />}></Route>
            <Route path="/stateless" element={<Stateless />}></Route>
            <Route path="/base64-image" element={<Base64Image />}></Route>
            <Route path="/base64-text" element={<Base64Text />}></Route>
            <Route path="/quicktype" element={<Quicktpe />}></Route>
            <Route path="/ping" element={<Ping />}></Route>
            <Route path="/minify" element={<Minify />}></Route>
            <Route path="/url-parser" element={<UrlParser />}></Route>
          </Routes>
        </Group>
      </Box>
      <Drawer
        position="right"
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        title="Settings"
        padding="xl"
        size="xl"
      >
        <Settings />
      </Drawer>
      <Spotlight
        shortcut={["mod + k", "/"]}
        searchProps={{
          leftSection: <FaSearch />,
          placeholder: "Jump to",
        }}
        actions={data.map((a) => ({
          id: a.to,
          label: a.text,
          onClick: () => nav(a.to),
          icon: a.icon,
        }))}
      ></Spotlight>
    </>
    // </ColorSchemeProvider>
  );
}

export default App;
