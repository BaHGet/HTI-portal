import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./Context/theme-context.jsx";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import theme from "./Context/Mantine-Theme.jsx";
import { MantineProvider } from "@mantine/core";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 30, // 30 دقيقة
      gcTime: 1000 * 60 * 60, // ساعة
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider storageKey="theme">
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
