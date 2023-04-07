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
import { components } from "./Theme";
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
  const [colorScheme, setColorScheme] = useState<ColorScheme>();
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useEffect(() => {
    async function getTheme() {
      const existing = await db.get<ColorScheme>("theme");
      setColorScheme(existing!);
    }
    getTheme();
  }, []);

  useEffect(() => {
    async function getTheme() {
      if (colorScheme) {
        setColorScheme(colorScheme);
        await db.set("theme", colorScheme);
        await db.save();
      }
    }
    getTheme();
  }, [colorScheme]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme!}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          components,
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
