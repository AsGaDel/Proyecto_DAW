import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { usePageTitle } from "../hooks/usePageTitle";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import CardGrid      from "../components/CardGrid";
import ActionButtons from "../components/ActionButtons";
import Footer        from "../components/Footer";

import incidentService from "../services/incidentService";

const MY_INCIDENTS_PER_PAGE = 36;

export default function MyIncidentsList() {
  usePageTitle("Mis Incidentes");
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  // ── Datos ──
  const [incidents, setIncidents] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Paginación ──
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  // ── Carga inicial ──
  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        setLoading(true);
        const data = await incidentService.getMine();
        const parsed = data.map((inc) => ({
          ...inc,
          date:   new Date(inc.date ?? inc.created_at),
          author: inc.author ?? { username: inc.author_username, avatar: inc.author_avatar ?? null },
        }));
        setIncidents(parsed);
      } catch (err) {
        setError("No se pudieron cargar tus incidentes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyIncidents();
  }, []);

  // ── Paginación ──
  const totalPages = Math.ceil(incidents.length / MY_INCIDENTS_PER_PAGE);

  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * MY_INCIDENTS_PER_PAGE;
    return incidents.slice(start, start + MY_INCIDENTS_PER_PAGE);
  }, [incidents, currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="bg-gray-100 flex-1 px-4 mb-12 sm:px-8 lg:px-12 py-6 order-2 md:order-1">

          {/* Estado de carga y error */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-400">Cargando tus incidentes...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {incidents.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="text-sm text-gray-400">Todavía no has reportado ningún incidente.</p>
                  </div>
                )
                : <CardGrid incidents={paginatedIncidents} title="Mis incidentes reportados" />
              }

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                    .reduce((acc, page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-xs">...</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setCurrentPage(item)}
                          className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-colors
                            ${currentPage === item
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          {item}
                        </button>
                      )
                    )
                  }

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
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