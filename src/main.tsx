import "./index.css";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { Global } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppContextProvider } from "./Contexts/AppContextProvider";
import { db } from "./utils";

const root = createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Global
        styles={(theme) => ({
          body: {
            ...theme.fn.fontStyles(),
          },
        })}
      ></Global>
      <Main>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Main>
    </BrowserRouter>
  </React.StrictMode>
);

function Main({ children }: any) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    db.data.theme || "dark"
  );
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useEffect(() => {
    console.log("color changed");
    db.data.theme = colorScheme;
    db.write();
  }, [colorScheme]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
