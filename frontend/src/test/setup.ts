import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Libera los recursos después de cada prueba
afterEach(() => {
  cleanup();
});

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock de window.location
Object.defineProperty(window, "location", {
  value: {
    pathname: "/",
    href: "http://localhost:3000/",
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});

// Polyfills para atob y btoa si no están definidos (para JSDOM o Node environment)
if (typeof window.atob === "undefined") {
  (window as any).atob = (str: string) =>
    Buffer.from(str, "base64").toString("binary");
}
if (typeof window.btoa === "undefined") {
  (window as any).btoa = (str: string) =>
    Buffer.from(str, "binary").toString("base64");
}
