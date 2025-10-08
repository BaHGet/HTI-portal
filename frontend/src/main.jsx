import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./Context/theme-context.jsx";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")).render(
  <ThemeProvider storageKey="theme">
    <MantineProvider>
      <App />
    </MantineProvider>
  </ThemeProvider>
);
