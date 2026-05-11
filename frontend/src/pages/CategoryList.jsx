import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import ActionButtons from "../components/ActionButtons";
import Footer        from "../components/Footer";
import CategoryCard  from "../components/CategoryCard";
import CategoryModal from "../components/CategoryModal";

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────

const initialCategories = [
  { id: 1, name: "Infraestructura",    incidentCount: 12 },
  { id: 2, name: "Red / Conectividad", incidentCount: 5  },
  { id: 3, name: "Suministro",         incidentCount: 8  },
  { id: 4, name: "Movilidad",          incidentCount: 3  },
  { id: 5, name: "Medio ambiente",     incidentCount: 7  },
  { id: 6, name: "Seguridad",          incidentCount: 2  },
  { id: 7, name: "Otro",               incidentCount: 9  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CategoryList() {
  const navigate = useNavigate();
  const { user }   = useAuth();
  const actions = getActionsByRole(user?.role, navigate);

  const [categories, setCategories] = useState(initialCategories);
  const [search,     setSearch]     = useState("");
  const [modal,      setModal]      = useState(null); // null | "create" | category object

  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const handleSave = (data) => {
    if (data.id) {
      // Editar
      setCategories((prev) => prev.map((c) => c.id === data.id ? { ...c, name: data.name } : c));
      // TODO: await categoryService.update(data.id, data.name);
    } else {
      // Crear
      const newCategory = { id: Date.now(), name: data.name, incidentCount: 0 };
      setCategories((prev) => [...prev, newCategory]);
      // TODO: await categoryService.create(data.name);
    }
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // TODO: await categoryService.delete(id);
  };

  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />

      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="flex-1 px-4 mb-12 py-6 order-2 md:order-1">

          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-bold text-gray-500 uppercase text-md m-2">Categorías</h1>
              <p className="text-xs text-gray-400 m-2">{filtered.length} categorías encontradas</p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button onClick={() => setModal("create")} className="flex items-center gap-2 text-xs font-semibold text-white bg-blue-600
                hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
                Nueva categoría
              </button>
            </div>
          </div>

          {/* Buscador */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-6">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categoría..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-700 placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
            </div>
          </div>

          {/* Grid de cards */}
          {filtered.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>

                <p className="text-sm text-gray-400">No se encontraron categorías.</p>
              </div>
            )
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filtered.map((category) => (
                  <CategoryCard key={category.id} category={category} onEdit={(cat) => setModal(cat)} onDelete={handleDelete}/>
                ))}
              </div>
            )
          }
        </section>

        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1 lg:sticky lg:top-14 lg:self-start lg:h-fit 
          lg:border-t-0 lg:border-l-0 lg:w-56  lg:shrink-0 lg:px-0 lg:py-6 lg:order-last xl:w-64 lg:bg-transparent ">
          <ActionButtons actions={totalActions}/>
        </aside>

      </main>

      <Footer />

      {/* Modal crear / editar */}
      {modal !== null && (
        <CategoryModal category={modal === "create" ? null : modal} onSave={handleSave} onClose={() => setModal(null)}/>
      )}
    </div>
  );
}

/* import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import ActionButtons from "../components/ActionButtons";
import Footer        from "../components/Footer";
import CategoryCard  from "../components/CategoryCard";
import CategoryModal from "../components/CategoryModal";

import categoryService from "../services/categoryService";
import { useToast }    from "../components/ToastContainer";

export default function CategoryList() {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const toast     = useToast();

  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  // ── Datos ──
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // ── Búsqueda y modal ──
  const [search, setSearch] = useState("");
  const [modal,  setModal]  = useState(null);

  // ── Carga inicial ──
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        setError("No se pudieron cargar las categorías.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ── Handlers ──
  const handleSave = async (data) => {
    try {
      if (data.id) {
        const updated = await categoryService.update(data.id, data.name);
        setCategories((prev) => prev.map((c) => c.id === data.id ? { ...c, ...updated } : c));
        toast({ message: "Categoría actualizada correctamente.", type: "success" });
      } else {
        const created = await categoryService.create(data.name);
        setCategories((prev) => [...prev, created]);
        toast({ message: "Categoría creada correctamente.", type: "success" });
      }
    } catch (err) {
      toast({ message: "Error al guardar la categoría.", type: "error" });
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast({ message: "Categoría eliminada correctamente.", type: "success" });
    } catch (err) {
      toast({ message: "Error al eliminar la categoría.", type: "error" });
    }
  };

  // ── Filtrado local ──
  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />

      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="flex-1 px-4 mb-12 py-6 order-2 md:order-1">

          {/* Cabecera *//*}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-bold text-gray-500 uppercase text-md m-2">Categorías</h1>
              <p className="text-xs text-gray-400 m-2">{filtered.length} categorías encontradas</p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                onClick={() => setModal("create")}
                className="flex items-center gap-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
                Nueva categoría
              </button>
            </div>
          </div>

          {/* Buscador *//*}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-6">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar categoría..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Estados de carga y error *//*}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-400">Cargando categorías...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Grid de cards *//*}
          {!loading && !error && (
            filtered.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  <p className="text-sm text-gray-400">No se encontraron categorías.</p>
                </div>
              )
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filtered.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={(cat) => setModal(cat)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )
          )}

        </section>

        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1 lg:sticky lg:top-14 lg:self-start lg:h-fit
          lg:border-t-0 lg:border-l-0 lg:w-56 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last xl:w-64 lg:bg-transparent">
          <ActionButtons actions={totalActions} />
        </aside>

      </main>

      <Footer />

      {modal !== null && (
        <CategoryModal
          category={modal === "create" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
} */