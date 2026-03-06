import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "./theme.store";

describe("ThemeStore", () => {
  beforeEach(() => {
    // Resetear el store antes de cada prueba
    useThemeStore.setState({ theme: "dark" });
    localStorage.clear();
  });

  it("debería inicializarse con el tema oscuro por defecto", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("debería alternar el tema de oscuro a claro", () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("debería alternar el tema de claro a oscuro", () => {
    useThemeStore.setState({ theme: "light" });
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe("dark");
  });
});
