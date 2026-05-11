import { useState } from "react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  "Pendiente":   "bg-amber-50  text-amber-600  border-amber-200",
  "En proceso":  "bg-blue-50   text-blue-600   border-blue-200",
  "Finalizado":  "bg-green-50  text-green-600  border-green-200",
};

const priorityStyles = {
  "Leve":     "bg-green-700  text-green-50",
  "Moderado": "bg-yellow-600 text-yellow-50",
  "Crítico":  "bg-red-700    text-red-50",
};

export default function AssignedIncidentRow({ incident, onStatusChange }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(incident.status ?? "Pendiente");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onStatusChange?.(incident.id, newStatus);
    // TODO: await incidentService.updateStatus(incident.id, newStatus);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:border-gray-300 transition-all duration-150 flex flex-col sm:flex-row sm:items-center gap-4">

      {/* Foto */}
      <div className="w-full sm:w-20 h-32 sm:h-14 rounded-lg overflow-hidden bg-gray-200 shrink-0 cursor-pointer" onClick={() => navigate(`/incidente/${incident.id}`)}>
        {incident.photo
          ? <img src={incident.photo} alt={incident.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/incidente/${incident.id}`)}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-sm font-bold text-gray-800 truncate">{incident.name}</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${priorityStyles[incident.priority] ?? "bg-gray-200 text-gray-600"}`}>
            {incident.priority}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {incident.category} · @{incident.author.username} · {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(incident.date)}
        </p>
      </div>

      {/* Selector de status */}
      <select
        value={status}
        onChange={handleStatusChange}
        onClick={(e) => e.stopPropagation()}
        className={`text-xs font-semibold border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer
          ${statusStyles[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
      >
        <option value="Pendiente">Pendiente</option>
        <option value="En proceso">En proceso</option>
        <option value="Finalizado">Finalizado</option>
      </select>

    </div>
  );
}


/* import { useState } from "react";
import { useNavigate } from "react-router-dom";

import incidentService from "../services/incidentService";

const statusStyles = {
  "Pendiente":   "bg-amber-50  text-amber-600  border-amber-200",
  "En proceso":  "bg-blue-50   text-blue-600   border-blue-200",
  "Finalizado":  "bg-green-50  text-green-600  border-green-200",
};

const priorityStyles = {
  "Leve":     "bg-green-700  text-green-50",
  "Moderado": "bg-yellow-600 text-yellow-50",
  "Crítico":  "bg-red-700    text-red-50",
};

export default function AssignedIncidentRow({ incident, onStatusChange }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(incident.status ?? "Pendiente");

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await incidentService.updateStatus(incident.id, newStatus);
      setStatus(newStatus);
      onStatusChange?.(incident.id, newStatus);
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
    }
};

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:border-gray-300 transition-all duration-150 flex flex-col sm:flex-row sm:items-center gap-4">

      {/* Foto *//*}
      <div className="w-full sm:w-20 h-32 sm:h-14 rounded-lg overflow-hidden bg-gray-200 shrink-0 cursor-pointer" onClick={() => navigate(`/incidente/${incident.id}`)}>
        {incident.photo
          ? <img src={incident.photo} alt={incident.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
        }
      </div>

      {/* Info *//*}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/incidente/${incident.id}`)}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-sm font-bold text-gray-800 truncate">{incident.name}</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${priorityStyles[incident.priority] ?? "bg-gray-200 text-gray-600"}`}>
            {incident.priority}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {incident.category} · @{incident.author.username} · {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(incident.date)}
        </p>
      </div>

      {/* Selector de status *//*}
      <select
        value={status}
        onChange={handleStatusChange}
        onClick={(e) => e.stopPropagation()}
        className={`text-xs font-semibold border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer
          ${statusStyles[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
      >
        <option value="Pendiente">Pendiente</option>
        <option value="En proceso">En proceso</option>
        <option value="Finalizado">Finalizado</option>
      </select>

    </div>
  );
} */