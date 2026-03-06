import { create } from "zustand";
import backend from "../utils/backendClient";
import { useUIStore } from "./ui.store";

export interface Calendar {
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface CalendarState {
  calendars: Calendar[];
  currentCalendar: Calendar | null;
  isLoading: boolean;
  error: string | null;

  fetchCalendars: () => Promise<void>;
  fetchCalendar: (id: string) => Promise<void>;
  createCalendar: (name: string) => Promise<boolean>;
  joinCalendar: (id: string) => Promise<boolean>;
  leaveCalendar: (id: string) => Promise<boolean>;
  deleteCalendar: (id: string) => Promise<boolean>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendars: [],
  currentCalendar: null,
  isLoading: false,
  error: null,

  fetchCalendars: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await backend.getData<Calendar[]>("/calendars");
      if (response.success) {
        set({ calendars: response.entries });
      } else {
        set({ error: "No se pudieron cargar los calendarios" });
      }
    } catch {
      set({ error: "Error de red al cargar calendarios" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCalendar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await backend.getData<Calendar>(`/calendars/${id}`);
      if (response.success) {
        set({ currentCalendar: response.entries });
      } else {
        set({ error: "No se pudo cargar el calendario" });
      }
    } catch {
      set({ error: "Error de red al cargar el calendario" });
    } finally {
      set({ isLoading: false });
    }
  },

  createCalendar: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await backend.postData<Calendar>("/calendars", { name });
      if (response.success) {
        await get().fetchCalendars();
        useUIStore.getState().showModal({
          title: "¡Éxito!",
          message: "Calendario creado correctamente.",
          type: "success",
        });
        return true;
      } else {
        set({ error: response.error || "No se pudo crear el calendario" });
        useUIStore.getState().showModal({
          title: "Error",
          message: response.error || "Hubo un error al crear el calendario.",
          type: "error",
        });
        return false;
      }
    } catch {
      set({ error: "Error de red" });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  joinCalendar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await backend.postData<Calendar>(
        `/calendars/${id}/join`,
      );
      if (response.success) {
        await get().fetchCalendars();
        useUIStore.getState().showModal({
          title: "¡Éxito!",
          message: "Te has unido al calendario correctamente.",
          type: "success",
        });
        return true;
      } else {
        useUIStore.getState().showModal({
          title: "Error",
          message: response.message || "No se pudo unir al calendario.",
          type: "error",
        });
        return false;
      }
    } catch {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  leaveCalendar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await backend.postData(`/calendars/${id}/leave`);
      if (response.success) {
        await get().fetchCalendars();
        return true;
      } else {
        useUIStore.getState().showModal({
          title: "Atención",
          message: response.message || "No pudiste salir del calendario.",
          type: "error",
        });
        return false;
      }
    } catch {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCalendar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await backend.deleteData(`/calendars/${id}`);
      if (response.success) {
        await get().fetchCalendars();
        return true;
      } else {
        useUIStore.getState().showModal({
          title: "Error",
          message: response.message || "No se pudo eliminar el calendario.",
          type: "error",
        });
        return false;
      }
    } catch {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
