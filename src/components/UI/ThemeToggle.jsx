import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#273b33] bg-[#1D2B25] text-[#F5F7F5] hover:text-[#8BE0B0] hover:border-[#16A36A]/50 transition ${compact ? "w-9 h-9" : "px-3 h-9 text-xs font-semibold"}`}
    >
      <Icon size={16} aria-hidden="true" />
      {!compact && <span>{theme === "dark" ? "Light" : "Dark"} mode</span>}
    </button>
  );
}
