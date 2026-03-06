import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import backend from "../../../utils/backendClient";
import { useAuthStore } from "../../../store/auth.store";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setErrorMessage("No token provided");
        return;
      }

      try {
        const response = await backend.postData<string>("/auth/callback", {
          token,
        });

        if (response.success) {
          await setToken(response.entries);

          // Obtenemos el estado actual del user después de setToken
          const user = useAuthStore.getState().user;
          const from = location.state?.from?.pathname || "/app/dashboard";

          setStatus("success");

          // Redirigir según si tiene nombre o no
          setTimeout(() => {
            if (!user?.name) {
              navigate("/app/profile/complete", { replace: true });
            } else {
              navigate(from, { replace: true });
            }
          }, 1000);
        } else {
          setStatus("error");
          setErrorMessage(response.message || "Authentication failed");
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during authentication",
        );
      }
    };

    handleCallback();
  }, [searchParams, navigate, setToken]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <svg
              className="animate-spin w-6 h-6 text-indigo-600 dark:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Verifying your account...
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Authentication successful!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Authentication failed
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {errorMessage}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
