import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test/testUtils";
import {
  AuthGuard,
  GuestGuard,
  OnboardingGuard,
  VerifiedGuard,
} from "./AuthGuards";
import { useAuthStore } from "../../../store/auth.store";

// Mock store
vi.mock("../../../store/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

// Mock Navigate para capturar redirecciones
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="redirect" data-to={to} />
    ),
    Outlet: () => <div data-testid="outlet" />,
  };
});

describe("AuthGuards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AuthGuard", () => {
    it("debería redirigir a /login si no hay token", () => {
      vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);
      render(<AuthGuard />);
      const redirect = screen.getByTestId("redirect");
      expect(redirect.getAttribute("data-to")).toBe("/login");
    });

    it("debería renderizar el Outlet si hay token", () => {
      vi.mocked(useAuthStore).mockReturnValue({ token: "valid" } as any);
      render(<AuthGuard />);
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });
  });

  describe("GuestGuard", () => {
    it("debería redirigir a /app/dashboard si YA hay token", () => {
      vi.mocked(useAuthStore).mockReturnValue({ token: "valid" } as any);
      render(<GuestGuard />);
      const redirect = screen.getByTestId("redirect");
      expect(redirect.getAttribute("data-to")).toBe("/app/dashboard");
    });

    it("debería renderizar el Outlet si NO hay token", () => {
      vi.mocked(useAuthStore).mockReturnValue({ token: null } as any);
      render(<GuestGuard />);
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });
  });

  describe("OnboardingGuard", () => {
    it("debería redirigir a /app/dashboard si el usuario YA tiene nombre", () => {
      vi.mocked(useAuthStore).mockReturnValue({
        user: { name: "John" },
      } as any);
      render(<OnboardingGuard />);
      const redirect = screen.getByTestId("redirect");
      expect(redirect.getAttribute("data-to")).toBe("/app/dashboard");
    });

    it("debería renderizar el Outlet si el usuario NO tiene nombre", () => {
      vi.mocked(useAuthStore).mockReturnValue({ user: { name: "" } } as any);
      render(<OnboardingGuard />);
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });
  });

  describe("VerifiedGuard", () => {
    it("debería redirigir a completar perfil si hay token pero no nombre", () => {
      vi.mocked(useAuthStore).mockReturnValue({
        token: "valid",
        user: { name: "" },
      } as any);
      render(<VerifiedGuard />);
      const redirect = screen.getByTestId("redirect");
      expect(redirect.getAttribute("data-to")).toBe("/app/profile/complete");
    });

    it("debería renderizar el Outlet si hay token y nombre", () => {
      vi.mocked(useAuthStore).mockReturnValue({
        token: "valid",
        user: { name: "John" },
      } as any);
      render(<VerifiedGuard />);
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });
  });
});
