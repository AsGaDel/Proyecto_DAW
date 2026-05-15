import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { usePageTitle } from "../hooks/usePageTitle";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar              from "../components/Navbar";
import ActionButtons       from "../components/ActionButtons";
import Footer              from "../components/Footer";
import AssignedIncidentRow from "../components/AssignedIncidentRow";

import incidentService from "../services/incidentService";
import { useToast }    from "../components/ToastContainer";

export default function AssignedList() {
  usePageTitle("Asignados");
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const toast     = useToast();

  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  // ── Datos ──
  const [incidents, setIncidents] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Carga inicial ──
  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        setLoading(true);
        const data = await incidentService.getAssigned();
        const parsed = data.map((inc) => ({
          ...inc,
          date: new Date(inc.date ?? inc.created_at),
        }));
        setIncidents(parsed);
      } catch (err) {
        setError("No se pudieron cargar los incidentes asignados.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, []);

  // ── Handler de cambio de estado (newStatus es el valor raw) ──
  const handleStatusChange = (id, newStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => inc.id === id ? { ...inc, status: newStatus } : inc)
    );
  };

  // ── Contadores por estado (raw values) ──
  const counts = incidents.reduce((acc, inc) => {
    acc[inc.status] = (acc[inc.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="bg-gray-100 flex-1 px-4 mb-12 sm:px-8 lg:px-12 py-6 order-2 md:order-1">

          {/* Cabecera con contadores */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-bold text-gray-500 uppercase text-md m-2">Incidentes asignados</h2>
            <div className="flex gap-2">
              {[
                { raw: "pending",     label: "Pendiente",  color: "bg-amber-50 text-amber-600 border-amber-200" },
                { raw: "in_progress", label: "En proceso", color: "bg-blue-50  text-blue-600  border-blue-200"  },
                { raw: "resolved",    label: "Resuelto",   color: "bg-green-50 text-green-600 border-green-200" },
              ].map(({ raw, label, color }) => (
                <span key={raw} className={`text-xs font-semibold px-2 py-1 rounded-md border ${color}`}>
                  {label}: {counts[raw] ?? 0}
                </span>
              ))}
            </div>
          </div>

          {/* Estado de carga y error */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-400">Cargando incidentes asignados...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Lista de incidentes */}
          {!loading && !error && (
            incidents.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm text-gray-400">No tienes incidentes asignados.</p>
                </div>
              )
              : (
                <div className="flex flex-col gap-3">
                  {incidents.map((incident) => (
                    <AssignedIncidentRow
                      key={incident.id}
                      incident={incident}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )
          )}

        </section>

        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1
          lg:sticky lg:top-14 lg:self-start lg:h-fit lg:border-t-0 lg:border-l-0 lg:w-56 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last
          xl:w-64 lg:bg-transparent">
          <ActionButtons actions={actions} />
        </aside>

      </main>
      <Footer />
    </div>
  );
}