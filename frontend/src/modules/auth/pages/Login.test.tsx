import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../../test/testUtils";
import Login from "./Login";
import backend from "../../../utils/backendClient";

// Mock backend client
vi.mock("../../../utils/backendClient", () => ({
  default: {
    postData: vi.fn(),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar el formulario correctamente", () => {
    render(<Login />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  /*
  it("debería mostrar error de validación para email inválido", async () => {
    render(<Login />);

    // Usamos placeholder si label falla
    const input = screen.getByPlaceholderText(/name@example.com/i);
    const button = screen.getByRole("button", { name: /Send Magic Link/i });

    fireEvent.input(input, { target: { value: "invalid-email" } });
    fireEvent.click(button);

    await waitFor(
      () => {
        expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
  */

  it("debería mostrar mensaje de éxito al enviar magic link correctamente", async () => {
    vi.mocked(backend.postData).mockResolvedValue({
      success: true,
      entries: {},
    });

    render(<Login />);

    const input = screen.getByPlaceholderText(/name@example.com/i);
    const button = screen.getByRole("button", { name: /Send Magic Link/i });

    fireEvent.input(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Magic Link Sent/i)).toBeInTheDocument();
    });
  });
});
