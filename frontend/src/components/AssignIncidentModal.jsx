import { useState, useEffect } from "react";
import { createPortal }    from "react-dom";
import incidentService     from "../services/incidentService";
import workOrderService    from "../services/workOrderService";
import { useToast }        from "./ToastContainer";

const PRIORITIES = [
  { value: "low",    label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high",   label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

const priorityBadge = {
  Leve:     "bg-green-700  text-green-50",
  Moderado: "bg-yellow-600 text-yellow-50",
  Crítico:  "bg-red-700    text-red-50",
};

export default function AssignIncidentModal({ user, onClose, onAssign }) {
  const toast = useToast();

  const [incidents,     setIncidents]     = useState([]);
  const [selected,      setSelected]      = useState(null);
  const [priority,      setPriority]      = useState("medium");
  const [instructions,  setInstructions]  = useState("");
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    incidentService.getAll()
      .then((data) => {
        // Solo incidentes activos sin orden de trabajo ya asignada
        setIncidents(data.filter((inc) => inc.status !== "resolved" && !inc.work_order));
      })
      .catch(() => setError("No se pudieron cargar los incidentes."))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await workOrderService.create({
        incidentId:         selected,
        workerId:           user.id,
        priority,
        adminInstructions:  instructions,
      });
      toast({ message: `Incidente asignado a @${user.username}.`, type: "success" });
      onAssign?.(selected, user.username);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail
        ?? Object.values(err.response?.data ?? {}).flat().join(" ")
        ?? "Error al asignar el incidente.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-sm font-semibold text-gray-800">
            Asignar a <span className="text-blue-600">@{user.username}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de incidentes */}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          {loading && <p className="text-sm text-gray-400 text-center py-8">Cargando incidentes...</p>}
          {error   && <p className="text-sm text-red-400 text-center py-4">{error}</p>}
          {!loading && !error && incidents.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No hay incidentes disponibles sin asignar.</p>
          )}
          {!loading && incidents.length > 0 && (
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
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-bold truncate ${selected === inc.id ? "text-blue-700" : "text-gray-700"}`}>
                      {inc.title}
                    </p>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0 ${priorityBadge[inc.priority] ?? "bg-gray-200 text-gray-600"}`}>
                      {inc.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{inc.category} · @{inc.reporter_username}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Opciones de la orden */}
        {selected && (
          <div className="px-5 pb-2 flex flex-col gap-3 border-t border-gray-100 pt-4 shrink-0">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Prioridad</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Instrucciones (opcional)</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="Indicaciones para el trabajador…"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={!selected || saving}
            className="flex-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-2.5 rounded-lg transition-colors"
          >
            {saving ? "Asignando…" : "Confirmar asignación"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
