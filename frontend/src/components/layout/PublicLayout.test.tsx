import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/testUtils";
import PublicLayout from "./PublicLayout";

// Mock children components to focus on layout logic
vi.mock("./PublicLayout/BackgroundDecor", () => ({
  BackgroundDecor: () => <div data-testid="bg-decor" />,
}));
vi.mock("./PublicLayout/Navbar", () => ({
  Navbar: ({
    scrolled,
    isLoginPage,
  }: {
    scrolled: boolean;
    isLoginPage: boolean;
  }) => (
    <nav data-testid="navbar" data-scrolled={scrolled} data-login={isLoginPage}>
      Navbar
    </nav>
  ),
}));
vi.mock("./PublicLayout/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe("PublicLayout Component", () => {
  it("debería renderizar Navbar, Footer y BackgroundDecor", () => {
    render(<PublicLayout />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("bg-decor")).toBeInTheDocument();
  });

  it("debería pasar isLoginPage=true a la Navbar cuando estamos en /login", () => {
    render(<PublicLayout />, { initialEntries: ["/login"] });

    const navbar = screen.getByTestId("navbar");
    expect(navbar.getAttribute("data-login")).toBe("true");
  });

  it("debería pasar isLoginPage=false a la Navbar cuando estamos en /", () => {
    render(<PublicLayout />, { initialEntries: ["/"] });

    const navbar = screen.getByTestId("navbar");
    expect(navbar.getAttribute("data-login")).toBe("false");
  });
});
