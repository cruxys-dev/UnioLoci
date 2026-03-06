import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";
import "./index.css";
import { useThemeStore } from "./store/theme.store.ts";
import { GlobalModal } from "./components/GlobalModal.tsx";

// Synchronize theme with DOM
const syncTheme = (theme: "light" | "dark") => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Initial sync
syncTheme(useThemeStore.getState().theme);

// Subscribe to changes
useThemeStore.subscribe((state) => syncTheme(state.theme));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalModal />
    <RouterProvider router={router} />
  </StrictMode>,
);
