import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../../test/testUtils";
import { Topbar } from "./Topbar";
import { useThemeStore } from "../../../store/theme.store";
import { useAuthStore } from "../../../store/auth.store";

// Mock stores
vi.mock("../../../store/theme.store", () => ({
  useThemeStore: vi.fn(),
}));

vi.mock("../../../store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

describe("Topbar Component", () => {
  const mockToggleTheme = vi.fn();
  const mockToggleMobile = vi.fn();
  const mockToggleCollapse = vi.fn();
  const mockLogoutBackend = vi.fn();

  const defaultProps = {
    onToggleMobile: mockToggleMobile,
    onToggleCollapse: mockToggleCollapse,
    isCollapsed: false,
    isMobileOpen: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useThemeStore).mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    } as any);

    vi.mocked(useAuthStore).mockReturnValue({
      logoutBackend: mockLogoutBackend,
    } as any);
  });

  it("debería mostrar el título de la sección actual", () => {
    render(<Topbar {...defaultProps} />, {
      initialEntries: ["/app/dashboard"],
    });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("debería llamar a toggleTheme al hacer clic", () => {
    render(<Topbar {...defaultProps} />);
    const themeButton = screen.getByLabelText("Toggle theme");
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it("debería llamar a logoutBackend al hacer clic", () => {
    render(<Topbar {...defaultProps} />);
    const logoutButton = screen.queryByTitle("Log out");
    if (!logoutButton) throw new Error("Logout button not found");
    fireEvent.click(logoutButton);
    expect(mockLogoutBackend).toHaveBeenCalled();
  });

  it("debería llamar a onToggleCollapse al hacer clic en el botón de colapsar", () => {
    render(<Topbar {...defaultProps} />);
    const collapseButton = screen.queryByTitle("Collapse");
    if (!collapseButton) throw new Error("Collapse button not found");
    fireEvent.click(collapseButton);
    expect(mockToggleCollapse).toHaveBeenCalled();
  });
});
