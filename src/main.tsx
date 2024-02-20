import "./index.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppContextProvider } from "./Contexts/AppContextProvider";
import { theme } from "./Theme";

const root = createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme={"dark"}>
        <Notifications
          styles={{
            root: {
              position: "fixed",
              top: 20,
              right: 20,
            },
          }}
        />
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
