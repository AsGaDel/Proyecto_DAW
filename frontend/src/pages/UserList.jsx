import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import ActionButtons from "../components/ActionButtons";
import Footer        from "../components/Footer";
import UserCard      from "../components/UserCard";

import userService  from "../services/userService";
import { useToast } from "../components/ToastContainer";

const roleLabels = {
  admin:  "Administrador",
  worker: "Trabajador",
  user:   "Usuario",
};

const USERS_PER_PAGE = 12;

export default function UserList() {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const toast     = useToast();

  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  // ── Datos ──
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Filtros ──
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // ── Paginación ──
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ── Carga inicial ──
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAll();
        const parsed = data.map((u) => ({
          ...u,
          fullName: u.full_name ?? u.fullName,
          stats: u.stats ?? { reportados: 0, votos: 0, suscritos: 0 },
        }));
        setUsers(parsed);
      } catch (err) {
        setError("No se pudieron cargar los usuarios.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ── Handlers ──
  const handleDelete = async (username) => {
    try {
      await userService.delete(username);
      setUsers((prev) => prev.filter((u) => u.username !== username));
      toast({ message: "Usuario eliminado correctamente.", type: "success" });
    } catch (err) {
      toast({ message: "Error al eliminar el usuario.", type: "error" });
    }
  };

  const handleChangeRole = async (username, role) => {
    try {
      await userService.changeRole(username, role);
      setUsers((prev) => prev.map((u) => u.username === username ? { ...u, role } : u));
      toast({ message: "Rol actualizado correctamente.", type: "success" });
    } catch (err) {
      toast({ message: "Error al cambiar el rol.", type: "error" });
    }
  };

  // ── Filtrado local ──
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ── Paginación ──
  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filtered.slice(start, start + USERS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />

      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="flex-1 px-4 mb-12 py-6 order-2 md:order-1">

          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="font-bold text-gray-500 uppercase text-md m-2">Usuarios registrados</h1>
            <p className="text-xs text-gray-400 m-2">{filtered.length} usuarios encontrados</p>
          </div>

          {/* Filtros */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar por nombre o username..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition sm:w-44"
            >
              <option value="">Todos los roles</option>
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {(search || roleFilter) && (
              <button
                onClick={() => { setSearch(""); setRoleFilter(""); setCurrentPage(1); }}
                className="text-xs text-blue-600 hover:underline font-medium whitespace-nowrap"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Estados de carga y error */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-400">Cargando usuarios...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Grid de cards */}
          {!loading && !error && (
            filtered.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2h5" />
                  </svg>
                  <p className="text-sm text-gray-400">No se encontraron usuarios.</p>
                </div>
              )
              : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {paginatedUsers.map((u) => (
                      <UserCard
                        key={u.username}
                        user={u}
                        onDelete={handleDelete}
                        onChangeRole={handleChangeRole}
                      />
                    ))}
                  </div>

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
              )
          )}

        </section>

        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1 lg:sticky lg:top-14 lg:self-start lg:h-fit
          lg:border-t-0 lg:border-l-0 lg:w-56 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last xl:w-64 lg:bg-transparent">
          <ActionButtons actions={totalActions} />
        </aside>

      </main>

      <Footer />
    </div>
  );
}