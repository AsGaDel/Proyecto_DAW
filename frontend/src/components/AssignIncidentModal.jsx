import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import incidentService from "../services/incidentService";

export default function AssignIncidentModal({ user, onClose, onAssign }) {
  const [incidents, setIncidents] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await incidentService.getAll();
        // Muestra solo los incidentes no finalizados y no asignados
        const available = data.filter((inc) => inc.status !== "Finalizado" && !inc.assigned);
        setIncidents(available);
      } catch (err) {
        setError("No se pudieron cargar los incidentes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const handleAssign = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await incidentService.assign(selected, user.username);
      onAssign?.(selected, user.username);
      onClose();
    } catch (err) {
      setError("Error al asignar el incidente.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const priorityStyles = {
    Leve:     "bg-green-700  text-green-50",
    Moderado: "bg-yellow-600 text-yellow-50",
    Crítico:  "bg-red-700    text-red-50",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            Asignar incidente a <span className="text-blue-600">@{user.username}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">Cargando incidentes...</p>
          )}

          {error && !loading && (
            <p className="text-sm text-red-400 text-center py-8">{error}</p>
          )}

          {!loading && !error && incidents.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No hay incidentes disponibles para asignar.</p>
          )}

          {!loading && !error && incidents.length > 0 && (
            <div className="flex flex-col gap-2">
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => setSelected(inc.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    selected === inc.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-bold ${selected === inc.id ? "text-blue-700" : "text-gray-700"}`}>
                      {inc.name}
                    </p>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0 ${priorityStyles[inc.priority] ?? "bg-gray-200 text-gray-600"}`}>
                      {inc.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{inc.category} · @{inc.author?.username}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-2 px-5 pb-5 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={!selected || saving}
            className="flex-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            {saving ? "Asignando..." : "Confirmar asignación"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}