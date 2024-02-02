// import "./index.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppContextProvider } from "./Contexts/AppContextProvider";
import { theme } from "./Theme";
import { db } from "./utils";

const root = createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Main>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Main>
    </BrowserRouter>
  </React.StrictMode>
);

type ColorScheme = "light" | "dark";

function Main({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>();

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
    <MantineProvider theme={theme} defaultColorScheme={"dark"}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
