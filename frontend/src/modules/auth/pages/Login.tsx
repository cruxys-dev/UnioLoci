import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import backend from "../../../utils/backendClient";
import * as z from "zod";

const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .min(1, "Email is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await backend.postData("/auth/magic-link", {
        email: data.email,
      });

      if (!response.success) {
        setStatus("error");
        setErrorMessage(
          response.message || "Failed to send magic link. Please try again.",
        );
        return;
      }

      setStatus("success");
    } catch (error) {
      console.error("Login error:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Enter your email to sign in or create an account. No passwords
            required.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
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
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">
              Magic Link Sent
            </h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Check your email for the link to access your account.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-medium text-green-700 dark:text-green-400 underline hover:no-underline cursor-pointer"
            >
              Use a different email
            </button>
          </div>
        ) : status === "error" ? (
          <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
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
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="w-full px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 dark:hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full flex items-center justify-center px-4 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 ${
                status !== "loading" ? "cursor-pointer" : ""
              }`}
            >
              {status === "loading" ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              ) : null}
              {status === "loading" ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        )}

        <div className="text-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            By continuing, you agree to our{" "}
            <Link
              to="/terms"
              className="underline hover:text-neutral-900 dark:hover:text-neutral-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline hover:text-neutral-900 dark:hover:text-neutral-300"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
