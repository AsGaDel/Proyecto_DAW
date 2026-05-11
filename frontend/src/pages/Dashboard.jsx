import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar from "../components/Navbar";
import CardGrid from "../components/CardGrid";
import ActionButtons from "../components/ActionButtons";
import StatGrid from "../components/StatGrid";
import Footer from "../components/Footer";

const sampleIncidents = [
  { id: 1,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",                                                                          priority: "Moderado", status: "Pendiente",  category: "Infraestructura",  date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 2,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg",                                                            priority: "Leve",     status: "Finalizado", category: "Red / Conectividad",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 3,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp",                                                   priority: "Moderado", status: "Pendiente",  category: "Suministro",  date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 4,  name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico",  status: "Pendiente",  category: "Movilidad",  date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 5,  name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg",                                                        priority: "Leve",     status: "Finalizado", category: "Infraestructura",  date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 6,  name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg",                                                                     priority: "Crítico",  status: "Pendiente",  category: "Infraestructura",  date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg" } },
  { id: 7,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",                                                                          priority: "Moderado", status: "Pendiente",  category: "Medio ambiente",  date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 8,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg",                                                            priority: "Leve",     status: "Pendiente",  category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 9,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp",                                                   priority: "Moderado", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg" } },
  { id: 10, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico",  status: "En proceso", category: "Seguridad",  date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 11, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg",                                                        priority: "Leve",     status: "Pendiente",  category: "Infraestructura",  date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 12, name: "Alcantarilla sin tapa",    photo: null,                                                                                                                                    priority: "Crítico",  status: "Finalizado", category: "Otro",  date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } }
];

const statsValues = [
  { id: 1, label: "Incidentes activos",     value: 6 },
  { id: 2, label: "Pendientes de revisión", value: 2 },
  { id: 3, label: "Resueltos este mes",     value: 9 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user }   = useAuth();

  const actions = getActionsByRole(user?.role, navigate);

  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">
        {/* Columna izquierda: stats + incidentes */}
        <section className="bg-gray-100 flex-1 px-4 mb-12 sm:px-8 lg:px-12 py-6 order-2 md:order-1">
          <StatGrid stats={statsValues} />
          <CardGrid incidents={sampleIncidents} title={"Incidentes destacados"}/>
        </section>
        {/* Columna derecha: acciones — encima en móvil, lateral en desktop */}
        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1
          lg:sticky lg:top-14 lg:self-start lg:h-fit lg:border-t-0 lg:border-l-0 lg:w-56 
          lg:shrink-0 lg:px-0 lg:py-6 lg:order-last xl:w-64 lg:bg-transparent ">
          <ActionButtons actions={totalActions}/>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

/* import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import CardGrid      from "../components/CardGrid";
import ActionButtons from "../components/ActionButtons";
import StatGrid      from "../components/StatGrid";
import Footer        from "../components/Footer";

import incidentService from "../services/incidentService";
import statsService    from "../services/statsService";

export default function Dashboard() {
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
        const [incidentsData, statsData] = await Promise.all([
          incidentService.getAll(),
          statsService.getGlobal(),
        ]);

        // Muestra solo los 12 más recientes en el dashboard
        const parsed = incidentsData
          .map((inc) => ({ ...inc, date: new Date(inc.date ?? inc.created_at) }))
          .sort((a, b) => b.date - a.date)
          .slice(0, 12);

        setIncidents(parsed);

        setStatsValues([
          { id: 1, label: "Incidentes activos",     value: statsData.active   ?? 0 },
          { id: 2, label: "Pendientes de revisión", value: statsData.pending  ?? 0 },
          { id: 3, label: "Resueltos este mes",     value: statsData.resolved ?? 0 },
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
} */