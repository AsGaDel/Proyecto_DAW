import LocationViewer from "./LocationViewer";

const priorityStyles = {
  Leve:     "bg-green-700  text-green-50  bg-opacity-70",
  Moderado: "bg-yellow-700 text-yellow-50 opacity-70",
  Crítico:  "bg-red-700    text-red-50    bg-opacity-70",
};

export default function IncidentInfo({ name, location, description, priority, status, category, date, author, assignedTo }) {
  const badgeClass = priorityStyles[priority] ?? "bg-black text-white bg-opacity-70";

  return (
    <div className="flex flex-col gap-4">

      {/* Título + badge */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
          {name}
        </h1>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${badgeClass}`}>
          {priority}
        </span>
        {status === "Pendiente"
          ? <span className="text-slate-500 inline-block text-sm font-semibold px-4 lg:px-12 py-1">{status}</span>
          : status === "En proceso"
          ? <span className="text-orange-500 inline-block text-sm font-semibold px-4 lg:px-12 py-1">{status}</span>
          : status === "Finalizado"
          ? <span className="text-teal-500 inline-block text-sm font-semibold px-4 lg:px-12 py-1">{status}</span>
          : <span className="text-black inline-block text-sm font-semibold px-4 lg:px-12 py-1">{status}</span>
        }
        <span className="text-gray-500 inline-block text-sm font-bold px-4 lg:px-12 py-1">
          {category}
        </span>
      </div>

      {/* Localización */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <LocationViewer location={location} />
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>

      {/* Autor + fecha */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-200">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {author?.username?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700">{author?.username ?? "Usuario"}</p>
          <p className="text-xs text-gray-400">
            {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date)}
          </p>
        </div>
      </div>

      {assignedTo && (
        <div className="flex items-center gap-3 pt-1 border-t border-gray-200">
          <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {assignedTo.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">{assignedTo}</p>
            <p className="text-xs text-gray-400">Trabajador asignado</p>
          </div>
        </div>
      )}

    </div>
  );
}