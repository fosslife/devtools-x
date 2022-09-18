import "./App.css";

import loadable from "@loadable/component";
import { Box, createStyles, Drawer, Group, Text } from "@mantine/core";
import { SpotlightProvider } from "@mantine/spotlight";
import { loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// NOTE: keep Num converter here, do not lazy load. there's a rare crashing bug.
import Nums from "./Features/number-tools/Nums";
import { data, Navbar } from "./Layout/Navbar";
import { Settings } from "./Layout/Settings";

// Lazy load components
const Welcome = loadable(() => import("./Components/Welcome"));
const Hash = loadable(() => import("./Features/hash/Hash"));
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

const useStyles = createStyles((theme) => ({
  settings: {
    position: "fixed",
    bottom: 0,
    left: 0,
    display: "inline-flex",
    alignItems: "center",
    width: "236px",
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
    padding: 10,
    display: "flex",
    gap: 10,
  },
  navbar: {
    minWidth: "230px",
    height: "100%",
    paddingLeft: 0,
  },
  body: {
    height: "100%",
    width: "100%",
  },
}));

function App() {
  const location = useLocation();
  const nav = useNavigate();
  const { classes } = useStyles();

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
    <SpotlightProvider
      searchIcon={<FaSearch />}
      searchPlaceholder="Jump to"
      actions={data.map((a) => ({
        title: a.text,
        onTrigger: () => nav(a.to),
        icon: a.icon,
      }))}
    >
      <Box className={classes.container}>
        <Box className={classes.navbar}>
          <Navbar />
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
            <Route path="/hash" element={<Hash />}></Route>
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
            <Route path="/image" element={<Image />}></Route>
            <Route path="/units" element={<UnitConverter />}></Route>
            <Route path="/playground" element={<Playground />}></Route>
            <Route path="/rest" element={<Rest />}></Route>
          </Routes>
        </Group>
        <Box
          className={classes.settings}
          onClick={() => setSettingsOpened(true)}
        >
          <FiSettings />
          <Text>Settings</Text>
        </Box>
      </Box>
      <Drawer
        position="right"
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        title="Settings"
        padding="xl"
        size="xl"
      >
        <Settings />
      </Drawer>
    </SpotlightProvider>
    // </ColorSchemeProvider>
  );
}

export default App;
