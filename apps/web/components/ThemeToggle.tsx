"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const saved = localStorage.getItem("theme");
    const active = saved ? saved === "dark" : isDark;
    document.documentElement.classList.toggle("dark", active);
    setDark(active);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm backdrop-blur bg-background/90 shadow"
      aria-label="Tema Değiştir"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden md:inline">Tema</span>
    </button>
  );
}
