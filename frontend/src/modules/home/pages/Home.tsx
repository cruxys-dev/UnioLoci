import { Link } from "react-router";
import { useAuthStore } from "../../../store/auth.store";

export default function Home() {
  const token = useAuthStore((state) => state.token);

  return (
    <>
      {/* Hero */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            Beta Version
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Shared Calendar as a <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
              Collaborative Space
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            UnioLoci is a real-time collaborative calendar platform. No more
            conflict resolving—everyone shares and modifies the same calendar
            instantly. Powered by AI for effortless scheduling.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            {token ? (
              <Link
                to="/app/dashboard"
                className="px-8 py-3.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section
        id="features"
        className="py-24 px-6 border-t border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Why UnioLoci?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              We reimagined the calendar from the ground up to be truly
              collaborative and intelligent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Real-Time Collaboration",
                desc: "Events sync in under 3 seconds across all devices. Everyone sees the same schedule, always.",
                icon: (
                  <svg
                    className="w-6 h-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "AI-Powered Scheduling",
                desc: 'Just type "Sprint planning next Thursday at 2 pm" and let our AI handle the details. It even generates descriptions for you.',
                icon: (
                  <svg
                    className="w-6 h-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
              },
              {
                title: "Magic Link Login",
                desc: "Forget passwords. Just enter your email, click the link, and you're in. Secure and frictionless.",
                icon: (
                  <svg
                    className="w-6 h-6 text-cyan-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                ),
              },
              {
                title: "Shared Ownership",
                desc: "No more hierarchy bottlenecks. Grant your group full access to manage the calendar together.",
                icon: (
                  <svg
                    className="w-6 h-6 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 hover:border-indigo-500/50 dark:hover:border-white/10 transition-all shadow-sm dark:shadow-none flex flex-col gap-4"
              >
                <div className="p-3 w-fit rounded-lg bg-neutral-100 dark:bg-white/5">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
