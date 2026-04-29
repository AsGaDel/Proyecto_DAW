const priorities = ["Leve", "Moderado", "Crítico"];

const priorityStyles = {
  Leve:     { active: "bg-green-700  text-green-50",  inactive: "bg-white text-gray-500 border border-gray-200" },
  Moderado: { active: "bg-yellow-700 text-yellow-50", inactive: "bg-white text-gray-500 border border-gray-200" },
  Crítico:  { active: "bg-red-700    text-red-50",    inactive: "bg-white text-gray-500 border border-gray-200" }
};

// ─── Sección colapsable ───────────────────────────────────────────────────────

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

// ─── FilterPanel ──────────────────────────────────────────────────────────────

export default function FilterPanel({ filters, onChange, authors = [], horizontal = false  }) {
  const togglePriority = (priority) => {
    const current = filters.priorities ?? [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onChange({ ...filters, priorities: updated });
  };

  const hasActiveFilters =
    (filters.search     ?? "").trim()  !== "" ||
    (filters.priorities ?? []).length   >  0  ||
    (filters.author     ?? "")         !== "" ||
    (filters.dateFrom   ?? "")         !== "" ||
    (filters.dateTo     ?? "")         !== "";

  return (
    <div className={horizontal
      ? "hidden lg:flex lg:flex-wrap lg:items-start lg:gap-3 lg:w-full lg:min-w-0 lg:rounded-lg lg:border lg:border-gray-100 lg:bg-white lg:shadow-sm lg:overflow-hidden lg:p-2"
      : "flex flex-col gap-2 w-full min-w-0" }>

      {/* Búsqueda por texto */}
      <div className="flex flex-col gap-1 min-w-36 flex-1">
        <Section title="Buscar" className="font-semibold" >
          <div className="relative shadow-sm">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={filters.search ?? ""}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Nombre del incidente..."
              className="w-full bg-white border border-gray-100 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-700 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
          </div>
        </Section>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: "", priorities: [], author: "", dateFrom: "", dateTo: "" })}
            className="text-sm font-semibold text-blue-600 hover:font-extrabold transition-colors">
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
                className={`text-xs font-semibold px-3 py-2 rounded-lg border bg-white border-gray-100 shadow-sm transition-all duration-150 text-left
                  ${isActive ? styles.active : styles.inactive}`}>
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
          <div className="shadow-sm">
            <label className="text-xs text-gray-500 mb-1 block">Desde</label>
            <input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
          </div>
          <div className="shadow-sm">
            <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
            <input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
          </div>
        </div>
      </Section>

    </div>
  );
}