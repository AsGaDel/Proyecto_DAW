import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import CardGrid      from "../components/CardGrid";
import ActionButtons from "../components/ActionButtons";
import StatGrid      from "../components/StatGrid";
import Footer        from "../components/Footer";

import incidentService from "../services/incidentService";

import { usePageTitle } from "../hooks/usePageTitle";

export default function Dashboard() {
  usePageTitle("Inicio");
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  const [incidents,   setIncidents]   = useState([]);
  const [statsValues, setStatsValues] = useState([
    { id: 1, label: "Incidentes activos",     value: 0 },
    { id: 2, label: "Pendientes de revisión", value: 0 },
    { id: 3, label: "Resueltos este mes",     value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const incidentsData = await incidentService.getAll();

        const parsed = incidentsData
          .map((inc) => ({ ...inc, date: new Date(inc.date ?? inc.created_at ?? Date.now()) }))
          .filter((inc) => inc.status !== "resolved")
          .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
          .slice(0, 12);

        setIncidents(parsed);

        setStatsValues([
          { id: 1, label: "Incidentes activos",    value: incidentsData.filter((i) => i.status !== "resolved").length,    onClick: () => navigate("/incident-list", { state: { statuses: ["Pendiente", "En proceso"] } }) },
          { id: 2, label: "Incidentes pendientes", value: incidentsData.filter((i) => i.status === "pending").length,     onClick: () => navigate("/incident-list", { state: { statuses: ["Pendiente"] } }) },
          { id: 3, label: "Incidentes resueltos",  value: incidentsData.filter((i) => i.status === "resolved").length,    onClick: () => navigate("/incident-list", { state: { statuses: ["Resuelto"] } }) },
        ]);
      } catch (err) {
        setError("No se pudieron cargar los datos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="bg-gray-100 flex-1 px-4 mb-12 sm:px-8 lg:px-12 py-6 order-2 md:order-1">
          <StatGrid stats={statsValues} />

          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-400">Cargando incidentes...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <CardGrid incidents={incidents} title="Incidentes destacados" />
          )}
        </section>

        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1
          lg:sticky lg:top-14 lg:self-start lg:h-fit lg:border-t-0 lg:border-l-0 lg:w-56
          lg:shrink-0 lg:px-0 lg:py-6 lg:order-last xl:w-64 lg:bg-transparent">
          <ActionButtons actions={actions} />
        </aside>

      </main>
      <Footer />
    </div>
  );
}