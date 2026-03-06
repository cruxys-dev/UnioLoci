import React, { useState } from "react";
import { useCalendarStore } from "../../../store/calendar.store";

interface CreateCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCalendarModal: React.FC<CreateCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const { createCalendar, isLoading } = useCalendarStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const success = await createCalendar(name);
    if (success) {
      setName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Crear nuevo calendario
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Crea un espacio compartido para organizar eventos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="calendarName"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Nombre del Calendario
            </label>
            <input
              type="text"
              id="calendarName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Proyecto Alpha"
              className="mt-1 block w-full rounded-md border-neutral-300 dark:border-white/10 dark:bg-black/20 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border text-neutral-900 dark:text-white"
              maxLength={100}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:border-white/10 dark:hover:bg-neutral-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando..." : "Crear Calendario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
