import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/testUtils";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "../../../store/auth.store";

// Mock store
vi.mock("../../../store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

describe("Sidebar Component", () => {
  const defaultProps = {
    isOpen: true,
    isCollapsed: false,
    onToggleMobile: vi.fn(),
  };

  it("debería renderizar los enlaces de navegación", () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: { name: "John" } } as any);
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("UnioLoci")).toBeInTheDocument();
  });

  it("debería mostrar solo la inicial 'U' cuando está colapsado", () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: { name: "John" } } as any);
    render(<Sidebar {...defaultProps} isCollapsed={true} />);

    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.queryByText("UnioLoci")).toBeNull();
  });

  it("debería mostrar el nombre y email del usuario", () => {
    const user = { name: "John Doe", email: "john@example.com" };
    vi.mocked(useAuthStore).mockReturnValue({ user } as any);

    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});
