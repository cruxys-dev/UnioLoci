import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { BackgroundDecor } from "./PublicLayout/BackgroundDecor";
import { Navbar } from "./PublicLayout/Navbar";
import { Footer } from "./PublicLayout/Footer";

export default function PublicLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-indigo-500/30 transition-colors duration-500 flex flex-col relative overflow-hidden">
      <BackgroundDecor />

      <Navbar scrolled={scrolled} isLoginPage={isLoginPage} />

      <main className="flex-1 z-10 pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
