import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { useCalendarStore } from "../../../store/calendar.store";

export default function CalendarJoin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { joinCalendar } = useCalendarStore();
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const doJoin = async () => {
      if (id && !hasJoined) {
        setHasJoined(true);
        const success = await joinCalendar(id);
        if (success) {
          navigate(`/app/calendars/${id}`, { replace: true });
        } else {
          navigate(`/app/calendars`, { replace: true });
        }
      }
    };

    doJoin();
  }, [id, joinCalendar, navigate, hasJoined]);

  if (!id) {
    return <Navigate to="/app/calendars" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
        Uniéndote al calendario...
      </h2>
      <p className="text-neutral-500 mt-2">
        Espera un momento mientras configuramos tu acceso.
      </p>
    </div>
  );
}
