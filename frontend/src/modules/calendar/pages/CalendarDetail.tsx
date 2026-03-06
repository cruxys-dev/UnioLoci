import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCalendarStore } from "../../../store/calendar.store";

export default function CalendarDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentCalendar,
    fetchCalendar,
    isLoading,
    deleteCalendar,
    leaveCalendar,
  } = useCalendarStore();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCalendar(id);
    }
  }, [id, fetchCalendar]);

  const handleDelete = async () => {
    if (
      !id ||
      !confirm(
        "¿Seguro que deseas eliminar este calendario? Esta acción no se puede deshacer.",
      )
    )
      return;

    setIsDeleting(true);
    const success = await deleteCalendar(id);
    setIsDeleting(false);

    if (success) {
      navigate("/app/calendars");
    }
  };

  const handleLeave = async () => {
    if (!id || !confirm("¿Seguro que deseas abandonar este calendario?"))
      return;

    setIsDeleting(true);
    const success = await leaveCalendar(id);
    setIsDeleting(false);

    if (success) {
      navigate("/app/calendars");
    }
  };

  if (isLoading && !currentCalendar) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentCalendar) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Calendario no encontrado
        </h2>
        <button
          onClick={() => navigate("/app/calendars")}
          className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Volver a mis calendarios
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate("/app/calendars")}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {currentCalendar.name}
            </h1>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-8">
            Visualizando eventos y configuración
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            title="Copiar link de invitación"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/app/calendars/${currentCalendar.id}/join`,
              );
              alert("Enlace de invitación copiado");
            }}
            className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </button>

          <button
            onClick={handleLeave}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 rounded-lg transition-colors border border-transparent"
          >
            Abandonar
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg transition-colors border border-transparent"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-xl p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          Gestión de eventos (Pronto)
        </h3>
        <p className="text-neutral-500 max-w-md mx-auto">
          Próximamente aquí verás el calendario mensual con todos tus eventos y
          podrás la vista compartida en tiempo real con otros miembros.
        </p>
      </div>
    </div>
  );
}
