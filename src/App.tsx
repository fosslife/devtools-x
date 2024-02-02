import "./App.module.css";
import "@mantine/spotlight/styles.css";

import loadable from "@loadable/component";
import { Box, Drawer, Group } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
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
// const Image = loadable(() => import("./Features/image/Image"));
const Playground = loadable(() => import("./Features/playground/Playground"));
const Rest = loadable(() => import("./Features/rest/Rest"));
const UnitConverter = loadable(
  () => import("./Features/unitconverter/UnitConverter")
);
const Epoch = loadable(() => import("./Features/epoch/Epoch"));
const Stateless = loadable(() => import("./Features/password"));
const Base64 = loadable(() => import("./Features/base64/Base64"));
const Quicktpe = loadable(() => import("./Features/quicktype/Quicktype"));

function createStyles(fn: any) {
  return {};
}

const useStyles = createStyles((theme) => ({
  settings: {
    position: "fixed",
    bottom: 0,
    left: 0,
    display: "inline-flex",
    alignItems: "center",
    width: "200px",
    height: "46px",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[8]
        : theme.colors.gray[3],
    cursor: "pointer",
    userSelect: "none",
    "& svg": {
      marginLeft: 30,
      marginRight: 15,
    },
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.gray[7]
          : theme.colors.gray[4],
    },
  },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    gap: 10,
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
  },
  navbar: {
    height: "100%",
    paddingLeft: 0,
  },
  body: {
    height: "100%",
    width: "100%",

    "& > div": {
      height: "100%",
      width: "100%",
      // paddingInline: 10,
      padding: 10,
      paddingLeft: 5,
    },
  },
}));

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
  console.log("App");

  const classes = {};

  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.navbar}>
          <Navbar openSettings={(t: boolean) => setSettingsOpened(t)} />
        </Box>
        <Group
          className={`${transitionStage} ${classes.body}`}
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
            <Route path="/pastebin" element={<Pastebin />}></Route>
            <Route path="/repl" element={<Repl />}></Route>
            {/* <Route path="/image" element={<Image />}></Route> */}
            <Route path="/units" element={<UnitConverter />}></Route>
            <Route path="/playground" element={<Playground />}></Route>
            <Route path="/rest" element={<Rest />}></Route>
            <Route path="/epoch" element={<Epoch />}></Route>
            <Route path="/stateless" element={<Stateless />}></Route>
            <Route path="base64" element={<Base64 />}></Route>
            <Route path="quicktype" element={<Quicktpe />}></Route>
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
