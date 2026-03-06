import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/testUtils";
import AppLayout from "./AppLayout";

// Mock sub-components
vi.mock("./AppLayout/Sidebar", () => ({
  Sidebar: ({
    isOpen,
    isCollapsed,
  }: {
    isOpen: boolean;
    isCollapsed: boolean;
  }) => (
    <div data-testid="sidebar" data-open={isOpen} data-collapsed={isCollapsed}>
      Sidebar
    </div>
  ),
}));

vi.mock("./AppLayout/Topbar", () => ({
  Topbar: ({
    isCollapsed,
    isMobileOpen,
  }: {
    isCollapsed: boolean;
    isMobileOpen: boolean;
  }) => (
    <div
      data-testid="topbar"
      data-collapsed={isCollapsed}
      data-mobile-open={isMobileOpen}
    >
      Topbar
    </div>
  ),
}));

describe("AppLayout Component", () => {
  it("debería renderizar Sidebar y Topbar con estados iniciales", () => {
    render(<AppLayout />);

    const sidebar = screen.getByTestId("sidebar");
    const topbar = screen.getByTestId("topbar");

    expect(sidebar).toBeInTheDocument();
    expect(topbar).toBeInTheDocument();

    // Estados iniciales esperados: open=true, collapsed=false
    expect(sidebar.getAttribute("data-open")).toBe("true");
    expect(sidebar.getAttribute("data-collapsed")).toBe("false");
  });
});
