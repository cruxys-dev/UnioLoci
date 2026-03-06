import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../../store/auth.store";

export const AuthGuard: React.FC = () => {
  const { token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

/**
 * Solo permite acceso si el usuario NO tiene nombre (onboarding pendiente)
 */
export const OnboardingGuard: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.name) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};

/**
 * Solo permite acceso si el usuario YA tiene nombre (perfil completo)
 */
export const VerifiedGuard: React.FC = () => {
  const { token, user } = useAuthStore();

  // Solo validamos el nombre si el usuario ya está autenticado
  if (token && !user?.name) {
    return <Navigate to="/app/profile/complete" replace />;
  }

  return <Outlet />;
};

export const GuestGuard: React.FC = () => {
  const { token } = useAuthStore();

  if (token) {
    // Si ya está autenticado, redirigir al dashboard
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};
