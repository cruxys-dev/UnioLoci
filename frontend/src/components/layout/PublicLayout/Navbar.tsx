import React from "react";
import { Link } from "react-router";
import { useThemeStore } from "../../../store/theme.store";
import { useAuthStore } from "../../../store/auth.store";

interface NavbarProps {
  scrolled: boolean;
  isLoginPage: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled, isLoginPage }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { token, user, logoutBackend } = useAuthStore();

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "h-16 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl border-b border-neutral-200 dark:border-white/10 shadow-lg shadow-black/5"
          : "h-20 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          to="/"
          className="group relative flex items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-80">
            UnioLoci
          </span>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all active:scale-90 text-neutral-600 dark:text-neutral-400"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
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
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
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
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </button>

          {!isLoginPage &&
            (token ? (
              <div className="flex items-center gap-4 border-l border-neutral-200 dark:border-white/10 pl-4 md:pl-8">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500 uppercase tracking-widest leading-none mb-1">
                    Account
                  </p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[120px]">
                    {user?.name?.split(" ")[0] || "User"}
                  </p>
                </div>
                <button
                  onClick={() => logoutBackend()}
                  className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 text-neutral-500 hover:text-red-500 transition-all active:scale-95 group"
                  aria-label="Log out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all active:scale-95 shadow-md hover:shadow-indigo-500/25"
              >
                Get Started
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};
