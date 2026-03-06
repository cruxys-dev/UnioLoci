import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../../test/testUtils";
import { Navbar } from "./Navbar";
import { useThemeStore } from "../../../store/theme.store";
import { useAuthStore } from "../../../store/auth.store";

// Mock stores
vi.mock("../../../store/theme.store", () => ({
  useThemeStore: vi.fn(),
}));

vi.mock("../../../store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

// User Factory
const getMockUser = (overrides = {}) => ({
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  ...overrides,
});

describe("Navbar Component", () => {
  const mockToggleTheme = vi.fn();
  const mockLogoutBackend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default theme store mock
    vi.mocked(useThemeStore).mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    } as any);
  });

  it("debería renderizar el logo UnioLoci", () => {
    vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);
    render(<Navbar scrolled={false} isLoginPage={false} />);
    expect(screen.getByText("UnioLoci")).toBeInTheDocument();
  });

  it("debería llamar a toggleTheme al hacer clic en el botón de tema", () => {
    vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);
    render(<Navbar scrolled={false} isLoginPage={false} />);

    const themeButton = screen.getByLabelText("Toggle theme");
    fireEvent.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it("debería mostrar 'Get Started' cuando no está autenticado y no es la página de login", () => {
    vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);
    render(<Navbar scrolled={false} isLoginPage={false} />);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("no debería mostrar nada de auth cuando es la página de login", () => {
    vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);
    render(<Navbar scrolled={false} isLoginPage={true} />);
    expect(screen.queryByText("Get Started")).toBeNull();
  });

  it("debería mostrar el nombre del usuario y botón de logout cuando está autenticado", () => {
    const user = getMockUser({ name: "Alice Smith" });
    vi.mocked(useAuthStore).mockReturnValue({
      token: "valid-token",
      user,
      logoutBackend: mockLogoutBackend,
    } as any);

    render(<Navbar scrolled={false} isLoginPage={false} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByLabelText("Log out")).toBeInTheDocument();
  });
});
