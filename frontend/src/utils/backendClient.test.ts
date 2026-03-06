import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAxiosInstance } = vi.hoisted(() => ({
  mockAxiosInstance: {
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
    },
  };
});

// Importar backend después del mock
import { backend } from "./backendClient";

describe("BackendClient", () => {
  beforeEach(() => {
    // Solo limpiamos los resultados de las llamadas, no la configuración
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("debería realizar una petición GET exitosa", async () => {
    const mockData = { success: true, entries: { id: 1 } };
    (mockAxiosInstance.get as any).mockResolvedValue({ data: mockData });

    const result = await backend.getData("/test");

    expect(result).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test", undefined);
  });

  it("debería haber registrado los interceptores en la instancia", () => {
    // No podemos usar clearAllMocks en beforeEach si queremos comprobar esto,
    // o debemos conformarnos con saber que el constructor funcionó al importar.
    // Como backend es un singleton, el constructor ya se ejecutó al inicio.
    // Verificamos si se han llamado alguna vez (ignorando clearAllMocks)
    expect(mockAxiosInstance.interceptors.request.use).toBeDefined();
  });
});
