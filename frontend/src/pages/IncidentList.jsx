import { useState, useMemo } from "react";

import Navbar from "../components/Navbar";
import CardGrid from "../components/CardGrid";
import FilterPanel from "../components/FilterPanel";
import StatGrid from "../components/StatGrid";
import Footer from "../components/Footer";

const sampleIncidents = [
  { id: 1,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 2,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 3,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 4,  name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 5,  name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 6,  name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 7,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 8,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 9,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 10, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 11, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 12, name: "Alcantarilla sin tapa",    photo: null, priority: "Crítico", date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 13, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", date: new Date("2026-04-11T08:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 14, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve",  date: new Date("2026-04-09T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 15, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", date: new Date("2026-04-08T11:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 16, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", date: new Date("2026-04-07T22:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 17, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", date: new Date("2026-04-05T09:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 18, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", date: new Date("2026-04-04T14:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 19,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 20,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 21,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 22,  name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 23,  name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 24,  name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 25,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 26,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 27,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 28, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 29, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 30, name: "Alcantarilla sin tapa",    photo: null, priority: "Crítico", date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 31, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", date: new Date("2026-04-11T08:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 32, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve",  date: new Date("2026-04-09T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 33, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", date: new Date("2026-04-08T11:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 34, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", date: new Date("2026-04-07T22:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 35, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", date: new Date("2026-04-05T09:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 36, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", date: new Date("2026-04-04T14:00:00"), author: { username: "laura_g",   avatar: null } }
];

const statsValues = [
  { id: 1, label: "Incidentes activos",     value: 6 },
  { id: 2, label: "Pendientes de revisión", value: 2 },
  { id: 3, label: "Resueltos este mes",     value: 9 },
];


export default function IncidentList() {
    const [filters, setFilters] = useState({
        search: "", priorities: [], author: "", dateFrom: "", dateTo: ""
    });
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Extrae los autores únicos del array para el select
    const authors = [...new Set(sampleIncidents.map((i) => i.author.username))];

    const filteredIncidents = useMemo(() => {
    return sampleIncidents.filter((incident) => {
        const matchesSearch = incident.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

        const matchesPriority =
        filters.priorities.length === 0 ||
        filters.priorities.includes(incident.priority);

        const matchesAuthor =
        filters.author === "" ||
        incident.author.username === filters.author;

        const incidentDate = incident.date;
        const matchesDateFrom =
        filters.dateFrom === "" ||
        incidentDate >= new Date(filters.dateFrom);
        const matchesDateTo =
        filters.dateTo === "" ||
        incidentDate <= new Date(filters.dateTo + "T23:59:59");

        return matchesSearch && matchesPriority && matchesAuthor && matchesDateFrom && matchesDateTo;
    });
    }, [filters]);

    const hasActiveFilters =
        filters.search.trim() !== "" ||
        filters.priorities.length > 0 ||
        filters.author !== "" ||
        filters.dateFrom !== "" ||
        filters.dateTo !== "";

    const activeCount =
        (filters.search ? 1 : 0) +
        (filters.priorities.length > 0 ? 1 : 0) +
        (filters.author ? 1 : 0) +
        (filters.dateFrom ? 1 : 0) +
        (filters.dateTo ? 1 : 0);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 md:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">
        <section className="bg-white flex-1 px-4 sm:px-8 lg:px-12 py-6 pb-24 md:pb-6 order-2 md:order-1">
          <StatGrid stats={statsValues} />
          <button onClick={() => setFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4" />
            </svg>
            Filtros {hasActiveFilters && <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeCount}</span>}
          </button>
          <CardGrid incidents={filteredIncidents} title={"Todos los incidentes"} />
        </section>

        <div onClick={() => setFiltersOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden
            ${filtersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

        <aside className={`fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto
            bg-white dark:bg-gray-700 rounded-t-2xl px-5 py-4 transition-transform duration-300
            ${filtersOpen ? "translate-y-0" : "translate-y-full"}
            md:sticky md:translate-y-0 md:max-h-none md:overflow-visible md:rounded-none
            md:top-14 md:self-start md:h-fit md:border-l-0 md:w-56 md:shrink-0 md:px-6 md:py-6 md:order-last
            lg:w-64 md:bg-transparent md:dark:bg-transparent`}>
        {/* Handle visual solo en móvil */}
        <div className="md:hidden w-10 h-1 bg-gray-300 dark:bg-gray-500 rounded-full mx-auto mb-4" />
        
        <FilterPanel filters={filters} onChange={setFilters} authors={authors} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}