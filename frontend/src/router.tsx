import { createBrowserRouter } from "react-router";
// import App from "./App";
import Home from "./modules/home/pages/Home";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Login from "./modules/auth/pages/Login";
import Callback from "./modules/auth/pages/Callback";
import CompleteProfile from "./modules/auth/pages/CompleteProfile";
import AppLayout from "./components/layout/AppLayout";

import Terms from "./modules/legal/pages/Terms";
import Privacy from "./modules/legal/pages/Privacy";

import PublicLayout from "./components/layout/PublicLayout";
import {
  AuthGuard,
  GuestGuard,
  OnboardingGuard,
  VerifiedGuard,
} from "./modules/auth/components/AuthGuards";

export const routes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        element: <VerifiedGuard />,
        children: [{ index: true, element: <Home /> }],
      },
      {
        element: <GuestGuard />,
        children: [
          { path: "login", element: <Login /> },
          { path: "callback", element: <Callback /> },
        ],
      },
      { path: "terms", element: <Terms /> },
      { path: "privacy", element: <Privacy /> },
    ],
  },
  {
    path: "/app",
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: <VerifiedGuard />,
            children: [{ path: "dashboard", element: <Dashboard /> }],
          },
          {
            element: <OnboardingGuard />,
            children: [
              { path: "profile/complete", element: <CompleteProfile /> },
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
