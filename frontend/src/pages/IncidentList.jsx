import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { usePageTitle } from "../hooks/usePageTitle";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import CardGrid      from "../components/CardGrid";
import FilterPanel   from "../components/FilterPanel";
import StatGrid      from "../components/StatGrid";
import Footer        from "../components/Footer";
import ActionButtons from "../components/ActionButtons";

import incidentService from "../services/incidentService";

// ─── Constantes ───────────────────────────────────────────────────────────────

const INCIDENTS_PER_PAGE = 36;

// ─── Página ───────────────────────────────────────────────────────────────────

export default function IncidentList() {
  usePageTitle("Incidentes");
  const navigate   = useNavigate();
  const location = useLocation();
  const { user }   = useAuth();

  // ── Acciones según rol ──
  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  // ── Datos ──
  const [incidents,  setIncidents]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Filtros ──
  const [filters, setFilters] = useState({
    search: "", priorities: [], statuses: [], categories: [], dateFrom: "", dateTo: ""
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Paginación ──
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ── Carga inicial ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [incidentsData] = await Promise.all([
          incidentService.getAll(),
        ]);

        // Convierte las fechas de string a Date
        const parsed = incidentsData.map((inc) => ({
          ...inc,
          date: new Date(inc.date ?? inc.created_at),
        }));

        setIncidents(parsed);

      } catch (err) {
        setError("No se pudieron cargar los incidentes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setFilters((prev) => ({ ...prev, categories: [location.state.category] }));
    }
    if (location.state?.statuses) {
      setFilters((prev) => ({ ...prev, statuses: location.state.statuses }));
    }
  }, [location.state]);

  // ── Handlers ──
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // ── Autores únicos para el select ──
  const authors = [...new Set(incidents.map((i) => i.author?.username).filter(Boolean))];

  // ── Filtrado ──
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch = 
        incident.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        incident.author?.username?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPriority =
        filters.priorities.length === 0 ||
        filters.priorities.includes(incident.priority);

      const matchesStatus =
        filters.statuses.length === 0 ||
        filters.statuses.includes(incident.status);

      const matchesCategory =
        (filters.categories ?? []).length === 0 ||
        (filters.categories ?? []).includes(incident.category);

      const incidentDate    = incident.date;
      const matchesDateFrom =
        filters.dateFrom === "" ||
        incidentDate >= new Date(filters.dateFrom);
      const matchesDateTo =
        filters.dateTo === "" ||
        incidentDate <= new Date(filters.dateTo + "T23:59:59");

      return matchesSearch && matchesPriority && matchesStatus && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [filters, incidents]);

  // ── Paginación ──
  const totalPages = Math.ceil(filteredIncidents.length / INCIDENTS_PER_PAGE);

  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * INCIDENTS_PER_PAGE;
    return filteredIncidents.slice(start, start + INCIDENTS_PER_PAGE);
  }, [filteredIncidents, currentPage]);

  // ── Badges filtros ──
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.priorities.length > 0 ||
    filters.statuses.length > 0 ||
    filters.categories.length > 0 ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.priorities.length > 0 ? 1 : 0) +
    (filters.statuses.length > 0 ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">
        <section className="bg-gray-100 flex-1 px-4 mb-12 sm:px-8 lg:px-12 py-6 pb-24 order-2 md:order-1">
    
          <div className="hidden lg:block">
            <FilterPanel filters={filters} onChange={handleFiltersChange} horizontal />
          </div>

          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 text-md font-semibold text-blue-600 mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4" />
            </svg>
            Filtros {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          {/* Estados de carga y error */}
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
            filteredIncidents.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <p className="text-sm text-gray-400">No hay incidentes que coincidan con estos filtros.</p>
                  {hasActiveFilters && (
                    <button
                      onClick={() => handleFiltersChange({ search: "", priorities: [], statuses: [], categories: [], dateFrom: "", dateTo: "" })}
                      className="text-xs text-blue-600 hover:underline font-medium mt-1"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )
              : (
                <>
                  <CardGrid incidents={paginatedIncidents} title="Todos los incidentes" />

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
                        .filter((page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        )
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
              )
          )}

        </section>

        <div
          onClick={() => setFiltersOpen(false)}
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden
            ${filtersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />

        <aside className={`fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto bg-white rounded-t-2xl px-5 py-4 transition-transform 
          duration-300 ${filtersOpen ? "translate-y-0" : "translate-y-full"} lg:sticky lg:translate-y-0 lg:max-h-none lg:overflow-visible lg:rounded-none lg:top-14 
          lg:self-start lg:h-fit lg:border-l-0 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last lg:w-64 lg:bg-transparent`}>
          <div className="lg:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          <div className="lg:hidden">
            <FilterPanel filters={filters} onChange={handleFiltersChange} authors={authors} />
          </div>
          <div className="hidden lg:block">
            <ActionButtons actions={actions} />
          </div>
        </aside>

        <aside className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1">
          <ActionButtons actions={actions} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}