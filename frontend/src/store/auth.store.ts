// src/store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import backend from "../utils/backendClient";
import { useUIStore } from "./ui.store";

interface User {
  // Todo: define correct interface
  id: string;
  name: string;
  email: string;
  [key: string]: string;
}

interface AuthState {
  token: string | null;
  sessionId: string | null;
  user: User | null;
  setToken: (token: string | null) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
  logoutBackend: () => Promise<void>;
}

interface JwtPayload {
  sessionId: string;
  token: string;
  user: User;
}

const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      sessionId: null,
      user: null,
      setToken: async (token) => {
        // Sincronizamos manualmente con localStorage para compatibilidad con el cliente backend
        // si este lee directamente la clave 'jwt'
        if (token) {
          localStorage.setItem("jwt", token);
          const payload = parseJwt(token);
          if (!payload) {
            throw new Error("Invalid token");
          }
          set({
            token,
            sessionId: payload.sessionId,
            user: payload.user,
          });
          // Ejecutar en background
          get().fetchUser();
        } else {
          localStorage.removeItem("jwt");
          set({ token: null, sessionId: null, user: null });
        }
      },
      fetchUser: async () => {
        try {
          const response = await backend.getData<User>("/users/me");
          if (response.success) {
            set({ user: response.entries });
          } else {
            set({ user: null });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          set({ user: null });
        }
      },
      logout: () => {
        localStorage.removeItem("jwt");
        set({ token: null, sessionId: null, user: null });
        // Redirigir al home si no estamos ya allí
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      },
      logoutBackend: async () => {
        try {
          const response = await backend.postData("/auth/logout");
          if (response.success) {
            get().logout();
          } else {
            useUIStore.getState().showModal({
              title: "Error al cerrar sesión",
              message:
                response.message ||
                "No se pudo cerrar la sesión en el servidor. Por favor, inténtalo de nuevo.",
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error logging out from backend:", error);
          useUIStore.getState().showModal({
            title: "Error de conexión",
            message:
              "Hubo un problema al conectar con el servidor. Por favor, revisa tu conexión e inténtalo de nuevo.",
            type: "error",
          });
        }
      },
    }),
    {
      name: "auth-storage", // Nombre para la persistencia de Zustand
      onRehydrateStorage: () => (state) => {
        // Al recargar la página, aseguramos que el token esté en localStorage
        // y actualizamos la información del usuario
        if (state?.token) {
          localStorage.setItem("jwt", state.token);
          state.fetchUser();
        }
      },
    },
  ),
);

// Conectamos el store con el cliente backend
backend.setAuthHandlers({
  tokenGetter: () => useAuthStore.getState().token,
  onUnauthorized: () => {
    useUIStore.getState().showModal({
      title: "Sesión expirada",
      message:
        "Tu sesión ha caducado o no tienes permisos para realizar esta acción. Por favor, vuelve a iniciar sesión.",
      type: "error",
      onConfirm: () => {
        useAuthStore
          .getState()
          .logoutBackend()
          .catch(useAuthStore.getState().logout);
      },
    });
  },
});
