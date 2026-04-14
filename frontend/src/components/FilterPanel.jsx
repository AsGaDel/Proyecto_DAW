const priorities = ["Leve", "Moderado", "Crítico"];

const priorityStyles = {
  Leve:     { active: "bg-green-700  text-green-50",  inactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600" },
  Moderado: { active: "bg-yellow-600 text-yellow-50", inactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600" },
  Crítico:  { active: "bg-red-700    text-red-50",    inactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600" },
};

// ─── Sección colapsable ───────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

export default function FilterPanel({ filters, onChange, authors = [] }) {
  const togglePriority = (priority) => {
    const current = filters.priorities ?? [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onChange({ ...filters, priorities: updated });
  };

  const hasActiveFilters =
    (filters.search     ?? "").trim() !== "" ||
    (filters.priorities ?? []).length  >  0  ||
    (filters.author     ?? "")         !== "" ||
    (filters.dateFrom   ?? "")         !== "" ||
    (filters.dateTo     ?? "")         !== "";

  return (
    <div className="flex flex-col gap-2 w-full min-w-0 md:rounded-xl md:border md:border-gray-200 
        md:dark:border-gray-500 md:bg-gray-100 md:dark:bg-gray-600 md:shadow-sm md:overflow-hidden md:p-2">

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Filtros
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: "", priorities: [], author: "", dateFrom: "", dateTo: "" })}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Búsqueda por texto */}
      <Section title="Buscar">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Nombre del incidente..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </Section>

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
                className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-150 text-left
                  ${isActive ? styles.active : styles.inactive}`}
              >
                {isActive && <span className="mr-1.5">✓</span>}
                {priority}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Filtro por fecha */}
      <Section title="Fecha">
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">Desde</label>
            <input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">Hasta</label>
            <input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </Section>

      {/* Filtro por autor */}
      <Section title="Autor">
        <select
          value={filters.author ?? ""}
          onChange={(e) => onChange({ ...filters, author: e.target.value })}
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="">Todos los autores</option>
          {authors.map((author) => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>
      </Section>

    </div>
  );
}