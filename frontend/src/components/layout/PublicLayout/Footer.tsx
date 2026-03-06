import React from "react";
import { Link } from "react-router";

export const Footer: React.FC = () => {
  return (
    <footer className="py-20 z-10 border-t border-neutral-200 dark:border-white/5 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent"
            >
              UnioLoci
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              Reimagining real-time collaboration for teams around the globe.
              Build your schedule together, effortlessly.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-widest mb-6">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/login"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-widest mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/terms"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} UnioLoci. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-[0.2em]">
              Powered by
            </span>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tracking-tighter hover:opacity-80 cursor-default transition-opacity">
              CRUXYS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
