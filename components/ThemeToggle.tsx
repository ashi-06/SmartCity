"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("system");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") || "dark";
    setTheme(stored);
  }, []);

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const isLight = theme === "light";
    root.classList.toggle("dark", !isLight);
    root.classList.toggle("light", isLight);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-md border px-3 py-1 text-sm hover:bg-black/[.03] dark:hover:bg-white/[.06]"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "Dark" : "Light"} mode
    </button>
  );
}


