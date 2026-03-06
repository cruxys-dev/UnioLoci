import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter, Outlet } from "react-router";
import { useAuthStore } from "./store/auth.store";
import { routes } from "./router";

// Mock de los módulos que causan problemas o peticiones
vi.mock("./utils/backendClient", () => ({
  default: { postData: vi.fn(), getData: vi.fn(), patchData: vi.fn() },
  backend: { postData: vi.fn(), getData: vi.fn(), patchData: vi.fn() },
}));

vi.mock("./store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

// Mock de layouts para simplificar el árbol DOM y asegurar que renderizan el Outlet
vi.mock("./components/layout/PublicLayout", () => ({
  default: () => (
    <div data-testid="public-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("./components/layout/AppLayout", () => ({
  default: () => (
    <div data-testid="app-layout">
      <Outlet />
    </div>
  ),
}));

describe("Router Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería navegar a la Home por defecto", async () => {
    // Simulamos usuario verificado
    vi.mocked(useAuthStore).mockReturnValue({
      token: "valid",
      user: { name: "John" },
    } as any);

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("public-layout")).toBeInTheDocument();
    expect(screen.getByText(/Shared Calendar/i)).toBeInTheDocument();
  });

  it("debería navegar a la página de Login", async () => {
    vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);

    const router = createMemoryRouter(routes, { initialEntries: ["/login"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it("debería redirigir a /login si intenta entrar en /app sin token", async () => {
    vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);

    const router = createMemoryRouter(routes, {
      initialEntries: ["/app/dashboard"],
    });
    render(<RouterProvider router={router} />);

    // Debería ser redirigido a /login por el AuthGuard
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });
});
