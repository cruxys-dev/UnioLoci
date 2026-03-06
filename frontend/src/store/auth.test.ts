import { describe, it, expect, vi, beforeEach } from "vitest";

// Limpiar localStorage antes de que el store se cargue (por si el persist middleware se dispara)
localStorage.clear();

const { mockBackend } = vi.hoisted(() => ({
  mockBackend: {
    getData: vi.fn(),
    postData: vi.fn(),
    setAuthHandlers: vi.fn(),
  },
}));

vi.mock("../utils/backendClient", () => ({
  backend: mockBackend,
  default: mockBackend,
}));

// Importar el store después de configurar los mocks y limpiar localStorage
import { useAuthStore } from "./auth.store";

describe("AuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      sessionId: null,
      user: null,
    });
    localStorage.clear();
    vi.clearAllMocks();

    // Configurar un retorno por defecto para evitar problemas durante la inicialización
    mockBackend.getData.mockResolvedValue({ success: false });
  });

  it("debería inicializarse con valores nulos", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.sessionId).toBeNull();
    expect(state.user).toBeNull();
  });

  it("debería establecer el token y extraer el usuario/sesión", async () => {
    const payloadContent = JSON.stringify({
      sessionId: "123",
      user: { id: "1", name: "Test", email: "test@example.com" },
    });
    const base64Payload = btoa(payloadContent);
    const token = `header.${base64Payload}.signature`;

    // Espiamos fetchUser para evitar la llamada real al backend durante este test
    const fetchUserSpy = vi
      .spyOn(useAuthStore.getState(), "fetchUser")
      .mockResolvedValue();

    await useAuthStore.getState().setToken(token);

    const state = useAuthStore.getState();
    expect(state.token).toBe(token);
    expect(state.sessionId).toBe("123");
    expect(state.user).toEqual({
      id: "1",
      name: "Test",
      email: "test@example.com",
    });
    expect(localStorage.getItem("jwt")).toBe(token);
    expect(fetchUserSpy).toHaveBeenCalled();
  });

  it("debería limpiar el estado al hacer logout", () => {
    useAuthStore.setState({
      token: "some-token",
      sessionId: "123",
      user: { id: "1", name: "Test", email: "test@example.com" },
    });
    localStorage.setItem("jwt", "some-token");

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(localStorage.getItem("jwt")).toBeNull();
  });

  /*
  it("debería obtener el usuario desde el backend", async () => {
    const mockUser = {
      id: "1",
      name: "Backend User",
      email: "backend@example.com",
    };

    mockBackend.getData.mockImplementation(async () => ({
      success: true,
      entries: mockUser,
    }));

    await useAuthStore.getState().fetchUser();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(mockBackend.getData).toHaveBeenCalledWith("/users/me");
  });
  */
});
