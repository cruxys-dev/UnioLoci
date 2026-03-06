import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/testUtils";
import AuthCallback from "./Callback";
import backend from "../../../utils/backendClient";
import { useAuthStore } from "../../../store/auth.store";

// Mock backend y store
vi.mock("../../../utils/backendClient", () => ({
  default: {
    postData: vi.fn(),
  },
}));

vi.mock("../../../store/auth.store", () => {
  let state = {
    token: null,
    user: null,
    setToken: vi.fn(),
  };

  const useAuthStoreMock = vi.fn((selector: any) => selector(state));
  (useAuthStoreMock as any).getState = () => state;
  (useAuthStoreMock as any).setState = (newState: any) => {
    state = { ...state, ...newState };
  };

  return {
    useAuthStore: useAuthStoreMock,
  };
});

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams("token=valid-token")],
  };
});

describe("AuthCallback Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería mostrar mensaje de verificación al cargar", () => {
    vi.mocked(backend.postData).mockReturnValue(new Promise(() => {}));

    render(<AuthCallback />);
    expect(screen.getByText(/Verifying your account/i)).toBeInTheDocument();
  });

  it("debería navegar al dashboard si la autenticación es exitosa y el perfil está completo", async () => {
    const mockToken = "new-jwt-token";
    const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };

    vi.mocked(backend.postData).mockResolvedValue({
      success: true,
      entries: mockToken,
    });

    const { setToken } = useAuthStore.getState();
    vi.mocked(setToken).mockImplementation(async (token) => {
      useAuthStore.setState({ token, user: mockUser });
    });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(
        screen.getByText(/Authentication successful/i),
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/app/dashboard", {
          replace: true,
        });
      },
      { timeout: 2000 },
    );
  });

  it("debería navegar a completar perfil si el usuario no tiene nombre", async () => {
    const mockToken = "new-jwt-token";
    const mockUser = { id: "1", name: "", email: "john@example.com" };

    vi.mocked(backend.postData).mockResolvedValue({
      success: true,
      entries: mockToken,
    });

    const { setToken } = useAuthStore.getState();
    vi.mocked(setToken).mockImplementation(async (token: string) => {
      useAuthStore.setState({ token, user: mockUser });
    });

    render(<AuthCallback />);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/app/profile/complete", {
          replace: true,
        });
      },
      { timeout: 2000 },
    );
  });

  it("debería mostrar error si la autenticación falla", async () => {
    vi.mocked(backend.postData).mockResolvedValue({
      success: false,
      message: "Invalid token",
      error: "UNAUTHORIZED",
      statusCode: 401,
    });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid token/i)).toBeInTheDocument();
    });
  });
});
