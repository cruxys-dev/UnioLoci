import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../../test/testUtils";
import CompleteProfile from "./CompleteProfile";
import backend from "../../../utils/backendClient";
import { useAuthStore } from "../../../store/auth.store";

// Mock backend y store
vi.mock("../../../utils/backendClient", () => ({
  default: {
    patchData: vi.fn(),
  },
}));

// Mock store
vi.mock("../../../store/auth.store", () => ({
  useAuthStore: vi.fn((selector) => selector({ fetchUser: vi.fn() })),
}));

// Mock router navigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CompleteProfile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería mostrar error de validación para nombre corto", async () => {
    render(<CompleteProfile />);

    const input = screen.getByLabelText(/Full Name/i);
    const button = screen.getByRole("button", {
      name: /Continue to Dashboard/i,
    });

    fireEvent.input(input, { target: { value: "a" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/Name must be at least 2 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("debería actualizar el nombre y navegar al dashboard al enviar correctamente", async () => {
    const mockFetchUser = vi.fn();
    // Usamos cast to any para el mock implementation
    (useAuthStore as any).mockImplementation((selector: any) =>
      selector({ fetchUser: mockFetchUser }),
    );
    vi.mocked(backend.patchData).mockResolvedValue({
      success: true,
      entries: {},
    });

    render(<CompleteProfile />);

    const input = screen.getByLabelText(/Full Name/i);
    const button = screen.getByRole("button", {
      name: /Continue to Dashboard/i,
    });

    fireEvent.input(input, { target: { value: "John Doe" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(backend.patchData).toHaveBeenCalledWith("/users/me", {
        name: "John Doe",
      });
      expect(mockFetchUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/app/dashboard", {
        replace: true,
      });
    });
  });
});
