import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test/testUtils";
import Home from "./Home";
import { useAuthStore } from "../../../store/auth.store";

// Mock store
vi.mock("../../../store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar el botón 'Log In' cuando no hay token", () => {
    vi.mocked(useAuthStore).mockImplementation(
      (selector: (state: any) => any) => selector({ token: null }),
    );

    render(<Home />);

    expect(screen.getByText("Shared Calendar as a")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Log In/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Go to Dashboard/i })).toBeNull();
  });

  it("debería renderizar el botón 'Go to Dashboard' cuando hay token", () => {
    vi.mocked(useAuthStore).mockImplementation(
      (selector: (state: any) => any) => selector({ token: "fake-token" }),
    );

    render(<Home />);

    expect(
      screen.getByRole("link", { name: /Go to Dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Log In/i })).toBeNull();
  });

  it("debería renderizar las características principales", () => {
    vi.mocked(useAuthStore).mockImplementation(
      (selector: (state: any) => any) => selector({ token: null }),
    );

    render(<Home />);

    expect(screen.getByText("Why UnioLoci?")).toBeInTheDocument();
    expect(screen.getByText("Real-Time Collaboration")).toBeInTheDocument();
    expect(screen.getByText("AI-Powered Scheduling")).toBeInTheDocument();
  });
});
