import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import backend from "../../../utils/backendClient";
import { useAuthStore } from "../../../store/auth.store";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CompleteProfile() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      // Según user-stories.md US-23 se actualiza con PATCH /users/me
      const response = await backend.patchData("/users/me", {
        name: data.name,
      });

      if (!response.success) {
        setStatus("error");
        setErrorMessage(response.message || "Failed to update profile.");
        return;
      }

      // Actualizamos el usuario en el store para reflejar el cambio
      await fetchUser();

      // Redirigimos al dashboard
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      console.error("Profile update error:", error);
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            One last step
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            To continue, please tell us your name. Your colleagues will identify
            you with this name.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={`w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full flex items-center justify-center px-4 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 ${
              status !== "loading" ? "cursor-pointer" : ""
            }`}
          >
            {status === "loading" ? "Saving..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
