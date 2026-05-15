import { useState } from "react";
import { useNavigate } from "react-router-dom";

import incidentService from "../services/incidentService";
import { mediaUrl }    from "../utils/mediaUrl";
import { useToast }    from "./ToastContainer";

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pendiente'  },
  { value: 'in_progress', label: 'En proceso'  },
  { value: 'resolved',    label: 'Resuelto'    },
];

const statusStyles = {
  pending:     "bg-amber-50  text-amber-600  border-amber-200",
  in_progress: "bg-blue-50   text-blue-600   border-blue-200",
  resolved:    "bg-green-50  text-green-600  border-green-200",
};

const priorityStyles = {
  "Leve":     "bg-green-700  text-green-50",
  "Moderado": "bg-yellow-600 text-yellow-50",
  "Crítico":  "bg-red-700    text-red-50",
};

export default function AssignedIncidentRow({ incident, onStatusChange }) {
  const navigate = useNavigate();
  const toast    = useToast();
  const [status,  setStatus]  = useState(incident.status ?? 'pending');
  const [saving,  setSaving]  = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSaving(true);
    try {
      await incidentService.updateStatus(incident.id, newStatus);
      setStatus(newStatus);
      onStatusChange?.(incident.id, newStatus);
      const label = STATUS_OPTIONS.find((o) => o.value === newStatus)?.label ?? newStatus;
      toast({ message: `Estado actualizado a "${label}".`, type: "success" });
    } catch (err) {
      toast({ message: "Error al actualizar el estado.", type: "error" });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const photo = mediaUrl(incident.photos?.[0]?.image);

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:border-gray-300 transition-all duration-150 flex flex-col sm:flex-row sm:items-center gap-4">

      {/* Foto */}
      <div
        className="w-full sm:w-20 h-32 sm:h-14 rounded-lg overflow-hidden bg-gray-200 shrink-0 cursor-pointer"
        onClick={() => navigate(`/incident/${incident.id}`)}
      >
        {photo
          ? <img src={photo} alt={incident.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/incident/${incident.id}`)}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-sm font-bold text-gray-800 truncate">{incident.title}</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${priorityStyles[incident.priority] ?? "bg-gray-200 text-gray-600"}`}>
            {incident.priority}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {incident.category} · @{incident.reporter_username} · {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(incident.date)}
        </p>
      </div>

      {/* Selector de estado */}
      <select
        value={status}
        onChange={handleStatusChange}
        onClick={(e) => e.stopPropagation()}
        disabled={saving}
        className={`text-xs font-semibold border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer disabled:opacity-60
          ${statusStyles[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

    </div>
  );
}
