import { useState, useRef, useEffect } from "react";

export function Dropdown({ trigger, children, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div className="relative" ref={ref}>
      {/* Trigger: cualquier elemento que se le pase */}
      <div onClick={(e) => { e.stopPropagation(); setOpen((prev) => !prev); }} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menú */}
      {open && (
        <div className={`absolute ${alignClass} mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 overflow-hidden`}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Item reutilizable ────────────────────────────────────────────────────────

export function DropdownItem({ label, onClick, danger = false }) {
  return (
    <li>
      <button
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        className={`w-full text-left px-4 py-2.5 text-sm transition-colors
          ${danger
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-gray-900"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
          }`}
      >
        {label}
      </button>
    </li>
  );
}