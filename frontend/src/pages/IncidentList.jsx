import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import CardGrid from "../components/CardGrid";
import FilterPanel from "../components/FilterPanel";
import StatGrid from "../components/StatGrid";
import Footer from "../components/Footer";
import ActionButtons from "../components/ActionButtons";

const sampleIncidents = [
  { id: 1,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 2,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 3,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 4,  name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 5,  name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 6,  name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 7,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 8,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 9,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 10, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 11, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 12, name: "Alcantarilla sin tapa",    photo: null, priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 13, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-11T08:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 14, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", category: "Infraestructura",  date: new Date("2026-04-09T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 15, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-08T11:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 16, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-07T22:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 17, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", category: "Infraestructura", date: new Date("2026-04-05T09:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 18, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-04T14:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 19, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 20, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 21, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 22, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 23, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 24, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 25, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 26, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 27, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 28, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 29, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 30, name: "Alcantarilla sin tapa",    photo: null, priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 31, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-11T08:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 32, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", category: "Infraestructura",  date: new Date("2026-04-09T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 33, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-08T11:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 34, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-07T22:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 35, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", category: "Infraestructura", date: new Date("2026-04-05T09:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 36, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-04T14:00:00"), author: { username: "laura_g",   avatar: null } }
];

const statsValues = [
  { id: 1, label: "Incidentes activos",     value: 6 },
  { id: 2, label: "Pendientes de revisión", value: 2 },
  { id: 3, label: "Resueltos este mes",     value: 9 },
];



export default function IncidentList() {
  const navigate = useNavigate();

    const userActions = [
    { 
    label: "Página principal",
    href: "/dashboard",     
    svg: 
      (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M4 11L12 5L20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 10V19H18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>),   
    onClick: () => navigate("/dashboard") 
  },
  { 
    label: "Ver todos",
    href: "/incident-list",     
    svg: 
      (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="20" y2="6"/>
        <line x1="8" y1="12" x2="20" y2="12"/>
        <line x1="8" y1="18" x2="20" y2="18"/>
        <circle cx="4" cy="6" r="1"/>
        <circle cx="4" cy="12" r="1"/>
        <circle cx="4" cy="18" r="1"/>
      </svg>),   
    onClick: () => navigate("/incident-list") 
  },
  { 
    label: "Nuevo incidente",
    href: "/create-incident",         
    svg: 
      (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>),
    onClick: () => navigate("/create-incident") 
},
  { 
    label: "Suscritos",
    href: "/subscribed",
    svg: 
    (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6L12 2z"/>
    </svg>),       
    onClick: () => navigate("/subscribed") 
  },
  { 
    label: "Mis incidentes",
    href: "/my-incidents",      
    svg: 
      (<svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none">
        <path d="M6 2h9l5 5v15H6z" strokeWidth="2"/>
        <line x1="9" y1="13" x2="15" y2="13" strokeWidth="2"/>
        <line x1="9" y1="17" x2="15" y2="17" strokeWidth="2"/>
      </svg>),
    onClick: () => navigate("/my-incidents") 
  }
];

const adminActions = [
  { 
    label: "Ver usuarios",     
    svg: 
      (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 7q-.425 0-.712-.288T14 6t.288-.712T15 5h6q.425 0 .713.288T22 6t-.288.713T21 7zm0 4q-.425 0-.712-.288T14 10t.288-.712T15 9h6q.425 0 .713.288T22 10t-.288.713T21 11zm0 4q-.425 0-.712-.288T14 14t.288-.712T15 13h6q.425 0 .713.288T22 14t-.288.713T21 15zm-9.125-1.875Q5 12.25 5 11t.875-2.125T8 8t2.125.875T11 11t-.875 2.125T8 14t-2.125-.875M2 19v-.9q0-.525.25-1t.7-.75q1.125-.675 2.388-1.012T8 15t2.663.338t2.387 1.012q.45.275.7.75t.25 1v.9q0 .425-.288.713T13 20H3q-.425 0-.712-.288T2 19m2.15-1h7.7q-.875-.5-1.85-.75T8 17t-2 .25t-1.85.75m4.563-6.288Q9 11.425 9 11t-.288-.712T8 10t-.712.288T7 11t.288.713T8 12t.713-.288M8 18"/>
      </svg>),   
    onClick: () => console.log("Usuarios") 
  },
  { 
    label: "Ver trabajadores",         
    svg: 
      (<svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="24" height="24">
        <path fill="currentColor" d="M4.757 13.43v-1.781H14.1v1.78zm0-5.343v-1.78H14.1v1.78Zm0-5.342V.965H14.1v1.78ZM1.643 14.32q-.643 0-1.1-.523T.086 12.54t.457-1.257 1.1-.524 1.1.524.457 1.257-.457 1.258-1.1.523m0-5.342q-.643 0-1.1-.523T.086 7.197.543 5.94t1.1-.524 1.1.524.457 1.257-.457 1.258-1.1.523m-1.1-5.865Q.086 2.59.086 1.855T.543.598t1.1-.524q.641 0 1.1.524.458.524.457 1.257t-.457 1.258-1.1.523-1.1-.523" style={{ strokeWidth: '.832598' }} />
        <path fill="currentColor" d="M14.9 17.62h2.525q.168 0 .295-.13.126-.131.126-.305t-.126-.305-.295-.13h-2.524q-.169 0-.295.13t-.126.305.126.304.295.131m0-1.45h2.524q.168 0 .295-.131t.126-.305-.126-.305q-.127-.13-.295-.13h-2.524q-.169 0-.295.13t-.126.305.126.305.295.13m5.75 2.031v-3.482h.56q.464 0 .793.342.33.34.33.819h1.122q.238 0 .4.167.161.167.16.413 0 .246-.16.414-.162.168-.4.167h-1.122q0 .478-.33.82-.329.34-.792.34zm-2.805 2.612H14.48V19.36q-.926 0-1.585-.682t-.659-1.64v-1.16q0-.958.66-1.64.658-.681 1.584-.681h4.488q.463 0 .793.34.33.342.329.82V18.2q0 .48-.33.82-.329.342-.792.341h-1.122ZM14.2 24.004q-.351 0-.596-.254-.245-.253-.246-.617v-.87q0-.363.246-.617.245-.253.596-.254h3.926q.351 0 .597.254.245.255.245.617v.87q0 .363-.245.617t-.597.254z" style={{ strokeWidth: '.57058' }} />
      </svg>),
    onClick: () => console.log("Trabajadores") 
},
  { 
    label: "Ver categorías",
    svg: 
    (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path fill="currentColor" d="M5.23 14.089v-1.877h10.168v1.877zm0-5.63V6.583h10.168v1.876zm0-5.63V.954h10.168V2.83ZM1.84 15.028q-.7 0-1.197-.55-.497-.552-.498-1.327 0-.775.498-1.324.5-.55 1.197-.552t1.197.552.497 1.324q-.002.772-.497 1.326-.495.555-1.197.55m0-5.629q-.7 0-1.197-.55Q.146 8.296.145 7.52q0-.775.498-1.325.5-.55 1.197-.552.697-.001 1.197.552.5.554.497 1.325-.002.771-.497 1.326-.495.554-1.197.55M.643 3.217Q.145 2.665.145 1.891T.643.567 1.84.015t1.197.552.497 1.324-.497 1.326-1.197.55-1.197-.55" style={{ strokeWidth: '.891659' }}/>
      <text xmlSpace="preserve" x="11.885" y="25.348" style={{ fontSize: '21.5241px', textAlign: 'start', writingMode: 'lr-tb', direction: 'ltr', textAnchor: 'start', fill: '#000', strokeWidth: '1.79368',}} transform="scale(1.06349 .9403)">
        <tspan x="11.885" y="25.348" style={{ strokeWidth: '1.79368', fill: 'currentColor'}}>c</tspan>
      </text>
    </svg>),       
    onClick: () => console.log("Categorías") 
  }
];

const workerActions = [
  { 
    label: "Asignados",     
    svg: 
      (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M6 19h6v-1H6zm.75-9h4.5q.3 0 .525-.225T12 9.25t-.225-.525t-.525-.225h-4.5q-.3 0-.525.225T6 9.25t.225.525t.525.225m0-2.5h4.5q.3 0 .525-.225T12 6.75t-.225-.525T11.25 6h-4.5q-.3 0-.525.225T6 6.75t.225.525t.525.225M16 11V9h2V7h-2V5h2q.825 0 1.413.588T20 7h2q.425 0 .713.288T23 8t-.288.713T22 9h-2q0 .825-.587 1.413T18 11zm-4 5h-2v-5h4V5H6q-.825 0-1.412.588T4 7v2q0 .825.588 1.413T6 11h2v5H6v-3q-1.65 0-2.825-1.175T2 9V7q0-1.65 1.175-2.825T6 3h8q.825 0 1.413.588T16 5v6q0 .825-.587 1.413T14 13h-2zm-6.5 5q-.625 0-1.062-.437T4 19.5v-2q0-.625.438-1.062T5.5 16h7q.625 0 1.063.438T14 17.5v2q0 .625-.437 1.063T12.5 21zm6.5-2H6z"/>
      </svg>),   
    onClick: () => console.log("Incidentes asignados") 
  }
];

const totalWorkerActions = [...userActions, ...workerActions];
const totalAdminActions = [...userActions, ...adminActions];


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
    <div className="min-h-screen bg-gray-100 flex flex-col pb-20 lg:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col lg:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">
        <section className="bg-gray-100 flex-1 px-4 sm:px-8 lg:px-12 py-6 pb-24 md:pb-6 order-2 md:order-1">

          <div className="hidden lg:block">
            <FilterPanel filters={filters} onChange={setFilters} authors={authors} horizontal />
          </div>

          <button onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 text-md font-semibold text-blue-600 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4" />
            </svg>
            Filtros {hasActiveFilters && <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeCount}</span>}
          </button>
          
          <CardGrid incidents={filteredIncidents} title={"Todos los incidentes"} />
        </section>

        <div onClick={() => setFiltersOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden
            ${filtersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

        <aside className={`fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto bg-white rounded-t-2xl px-5 py-4 transition-transform 
          duration-300  ${filtersOpen ? "translate-y-0" : "translate-y-full"}  lg:sticky lg:translate-y-0 lg:max-h-none lg:overflow-visible lg:rounded-none  lg:top-14 
          lg:self-start lg:h-fit lg:border-l-0 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last  lg:w-64 lg:bg-transparent`}>
          {/* Handle visual solo en móvil */}
          <div className="lg:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

          <div className="lg:hidden">
            <FilterPanel filters={filters} onChange={setFilters} authors={authors} />
          </div>

          <div className="hidden lg:block">
            <ActionButtons actions={userActions} />
          </div>

        </aside>
        
        {/*Aside solo visible para dispositivos móviles*/}
        <aside className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-3">
          <ActionButtons actions={userActions}/>
        </aside>
      </main>
      <Footer />
    </div>
  );
}