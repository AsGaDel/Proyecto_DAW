import { useState, useEffect } from "react";
import categoryService from "../services/categoryService";

const priorities = ["Leve", "Moderado", "Crítico"];
const statuses   = ["Pendiente", "En proceso", "Resuelto"];

const priorityStyles = {
  Leve:     { active: "bg-green-700  text-green-50",  inactive: "bg-white text-gray-500 border border-gray-200" },
  Moderado: { active: "bg-yellow-600 text-yellow-50", inactive: "bg-white text-gray-500 border border-gray-200" },
  Crítico:  { active: "bg-red-700    text-red-50",    inactive: "bg-white text-gray-500 border border-gray-200" },
};

const statusStyles = {
  "Pendiente":  { active: "bg-slate-400  text-slate-50",  inactive: "bg-white text-gray-500 border border-gray-200" },
  "En proceso": { active: "bg-orange-400 text-orange-50", inactive: "bg-white text-gray-500 border border-gray-200" },
  "Resuelto":   { active: "bg-teal-400   text-teal-50",   inactive: "bg-white text-gray-500 border border-gray-200" },
};

function Section({ title, children }) {
  return (
    <div className="min-w-36 flex-1">
      <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1 uppercase tracking-wider">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function FilterPanel({ filters, onChange, horizontal = false }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  const togglePriority = (priority) => {
    const current = filters.priorities ?? [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onChange({ ...filters, priorities: updated });
  };

  const toggleStatus = (status) => {
    const current = filters.statuses ?? [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onChange({ ...filters, statuses: updated });
  };

  const toggleCategory = (categoryName) => {
    const current = filters.categories ?? [];
    const updated = current.includes(categoryName)
      ? current.filter((c) => c !== categoryName)
      : [...current, categoryName];
    onChange({ ...filters, categories: updated });
  };

  const hasActiveFilters =
    (filters.search     ?? "").trim() !== "" ||
    (filters.priorities ?? []).length  >  0  ||
    (filters.statuses   ?? []).length  >  0  ||
    (filters.categories ?? []).length  >  0  ||
    (filters.author     ?? "")        !== "" ||
    (filters.dateFrom   ?? "")        !== "" ||
    (filters.dateTo     ?? "")        !== "";

  return (
    <div className={horizontal
      ? "hidden lg:flex lg:flex-wrap lg:items-start lg:gap-3 lg:w-full lg:min-w-0 lg:rounded-lg lg:border lg:border-gray-100 lg:bg-white lg:shadow-sm lg:overflow-hidden lg:p-2"
      : "flex flex-col gap-2 w-full min-w-0"
    }>

      {/* Búsqueda + limpiar */}
      <div className="flex flex-col gap-1 min-w-36 flex-1">
        <Section title="Buscar">
          <div className="relative shadow-sm">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={filters.search ?? ""}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Incidente o usuario..."
              className="w-full bg-white border border-gray-100 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </Section>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: "", priorities: [], statuses: [], categories: [], dateFrom: "", dateTo: "" })}
            className="text-sm font-semibold text-blue-600 hover:font-extrabold transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filtro por prioridad */}
      <Section title="Prioridad">
        <div className="flex flex-col gap-2">
          {priorities.map((priority) => {
            const isActive = (filters.priorities ?? []).includes(priority);
            const styles   = priorityStyles[priority];
            return (
              <button
                key={priority}
                onClick={() => togglePriority(priority)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border border-gray-100 shadow-sm transition-all duration-150 text-left
                  ${isActive ? styles.active : styles.inactive}`}
              >
                {isActive && <span className="mr-1.5">✓</span>}
                {priority}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Filtro por estado */}
      <Section title="Estado">
        <div className="flex flex-col gap-2">
          {statuses.map((status) => {
            const isActive = (filters.statuses ?? []).includes(status);
            const styles   = statusStyles[status];
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border border-gray-100 shadow-sm transition-all duration-150 text-left
                  ${isActive ? styles.active : styles.inactive}`}
              >
                {isActive && <span className="mr-1.5">✓</span>}
                {status}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Filtro por categoría — solo se muestra si hay categorías */}
      {categories.length > 0 && (
        <Section title="Categoría">
          <div className="flex flex-col gap-2 lg:max-h-[126px] lg:overflow-y-auto lg:pr-1">
            {categories.map((cat) => {
              const isActive = (filters.categories ?? []).includes(cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.name)}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg border border-gray-100 shadow-sm transition-all duration-150 text-left
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-500 border border-gray-200"
                    }`}
                >
                  {isActive && <span className="mr-1.5">✓</span>}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {/* Filtro por fecha */}
      <Section title="Fecha">
        <div className="flex flex-col gap-2">
          <div className="shadow-sm">
            <label className="text-xs text-gray-500 mb-1 block">Desde</label>
            <input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="shadow-sm">
            <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
            <input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </Section>

    </div>
  );
}