import "./App.css";

import loadable from "@loadable/component";
import { Box, Group, Modal, Select } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { loader } from "@monaco-editor/react";
// import { Select } from "chakra-react-select";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// NOTE: keep Num converter here, do not lazy load. there's a rare crashing bug.
import Nums from "./Features/number-tools/Nums";
import { data, Navbar } from "./Layout/Navbar";

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

function App() {
  const location = useLocation();
  const nav = useNavigate();
  const [opened, setOpened] = useState(false);
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  const initialRef = useRef(null);

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  useHotkeys([
    [
      "ctrl+k",
      () => {
        setOpened(true);
        console.log(initialRef.current);
      },
    ],
  ]);

  useEffect(() => {
    // monaco loader setup
    if (process.env.NODE_ENV === "production") {
      loader.config({ paths: { vs: "/vs" } });
    }
  }, []);

  return (
    <Box
      sx={() => ({
        height: "100%",
        width: "100%",
        padding: 10,
        display: "flex",
        gap: 10,
      })}
    >
      <Box
        sx={() => ({
          minWidth: "230px",
          height: "100%",
          paddingLeft: 0,
        })}
      >
        <Navbar />
      </Box>
      <Group
        sx={() => ({
          height: "100%",
          width: "100%",
        })}
        className={`${transitionStage}`}
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

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Jump To:"
        withCloseButton={false}
      >
        <Select
          ref={initialRef}
          id="location-select"
          name="location"
          data={data.map((e) => ({
            value: e.to,
            label: e.text,
            group: "Location",
          }))}
          onKeyDown={(e) => {
            if (e.code === "Escape") {
              setOpened(false);
            }
          }}
          placeholder="Type location"
          size="sm"
          searchable
          onChange={(e) => {
            setOpened(false);
            if (e) nav(e);
          }}
        />
      </Modal>
    </Box>
  );
}

export default App;
