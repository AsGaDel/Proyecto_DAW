import { useState, useEffect } from "react";
import userService     from "../services/userService";
import workOrderService from "../services/workOrderService";
import { useToast }    from "./ToastContainer";

const PRIORITIES = [
  { value: 'low',    label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high',   label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

export default function AssignPanel({ incidentId, workOrder, onAssigned }) {
  const toast = useToast();

  const [workers,      setWorkers]      = useState([]);
  const [workerId,     setWorkerId]     = useState("");
  const [priority,     setPriority]     = useState("medium");
  const [instructions, setInstructions] = useState("");
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    userService.getAll({ role: 'worker' })
      .then(setWorkers)
      .catch(() => {});
  }, []);

  if (workOrder) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-blue-800 mb-1">Orden de trabajo asignada</p>
        <p className="text-blue-700">Trabajador: <span className="font-medium">@{workOrder.assigned_worker_username}</span></p>
        <p className="text-blue-700">Estado: <span className="font-medium">{workOrder.status_display}</span></p>
        <p className="text-blue-700">Prioridad: <span className="font-medium">{workOrder.priority}</span></p>
        {workOrder.admin_instructions && (
          <p className="text-blue-600 mt-1 text-xs">{workOrder.admin_instructions}</p>
        )}
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workerId) { toast({ message: "Selecciona un trabajador.", type: "error" }); return; }
    setLoading(true);
    try {
      await workOrderService.create({ incidentId, workerId: Number(workerId), priority, adminInstructions: instructions });
      toast({ message: "Incidente asignado correctamente.", type: "success" });
      onAssigned?.();
    } catch (err) {
      const msg = err.response?.data?.detail ?? "Error al asignar el incidente.";
      toast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-700">Asignar a trabajador</p>

      <select
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Selecciona un trabajador…</option>
        {workers.map((w) => (
          <option key={w.id} value={w.id}>{w.full_name ?? w.username} (@{w.username})</option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Instrucciones para el trabajador (opcional)"
        rows={3}
        className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
      >
        {loading ? "Asignando…" : "Asignar incidente"}
      </button>
    </form>
  );
}
