import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import ProfileStats     from "../components/ProfileStats";
import ProfileIncidents from "../components/ProfileIncidents";

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────

export const sampleUsers = [
  {
    username: "carlos_m",
    fullName: "Carlos Martínez",
    avatar:   null,
    stats:    { reportados: 3, votos: 24, suscritos: 8 },
  },
  {
    username: "laura_g",
    fullName: "Laura García",
    avatar:   null,
    stats:    { reportados: 5, votos: 41, suscritos: 3 },
  },
  {
    username: "pedro_r",
    fullName: "Pedro Rodríguez",
    avatar:   null,
    stats:    { reportados: 2, votos: 10, suscritos: 6 },
  },
  {
    username: "ana_s",
    fullName: "Ana Sánchez",
    avatar:   null,
    stats:    { reportados: 7, votos: 58, suscritos: 12 },
  },
];

const sampleIncidents = [
  { id: 1,  name: "Bache en la calle",      photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",                                                                                                          priority: "Moderado", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m", avatar: null } },
  { id: 3,  name: "Acera en mal estado",    photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp",                                                                                   priority: "Moderado", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m", avatar: null } },
  { id: 12, name: "Alcantarilla sin tapa",  photo: null,                                                                                                                                                                    priority: "Crítico",  date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m", avatar: null } },
];

const statIcons = {
  reportados:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>,
  votos:        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>,
  suscritos:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
                </svg>
};

// ─── Página ───────────────────────────────────────────────────────────────────

export default function PublicProfile() {
  const { username } = useParams();
  const navigate     = useNavigate();

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
  const found = sampleUsers.find((u) => u.username === username);
  if (found) {
    setUser(found);
  } else {
    setError("Usuario no encontrado.");
  }
  setLoading(false);
}, [username]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Cargando perfil...</p>
      </div>
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">{error ?? "Usuario no encontrado."}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-blue-600 hover:underline">
          Volver atrás
        </button>
      </div>
    </div>
  );

    const statsData = [
        { label: "Reportados",      value: user.stats.reportados, icon: statIcons.reportados },
        { label: "Votos recibidos", value: user.stats.votos,      icon: statIcons.votos      },
        { label: "Suscritos",       value: user.stats.suscritos,  icon: statIcons.suscritos  },
    ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-4xl lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">

        {/* Cabecera: avatar + nombre + stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar — solo lectura, sin hover de cambio */}
          <div className="w-24 h-24 rounded-full shrink-0 overflow-hidden">
            {user.avatar
              ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )
            }
          </div>

          <div className="flex-1 w-full flex flex-col gap-4">
            {/* Nombre + username */}
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-black text-gray-900">{user.fullName}</h1>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>

            {/* Estadísticas */}
            <ProfileStats stats={statsData} />
          </div>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                {/* Incidentes reportados */}
                <ProfileIncidents incidents={sampleIncidents} otherUser/>
            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

/* import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import ProfileStats     from "../components/ProfileStats";
import ProfileIncidents from "../components/ProfileIncidents";

import userService     from "../services/userService";
import incidentService from "../services/incidentService";
import statsService    from "../services/statsService";

// ─── Iconos para estadísticas ─────────────────────────────────────────────────

const statIcons = {
  reportados: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  votos: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ),
  suscritos: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
    </svg>
  ),
};

// ─── Página ───────────────────────────────────────────────────────────────────

export default function PublicProfile() {
  const { username } = useParams();
  const navigate     = useNavigate();

  const [user,      setUser]      = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, incidentsData, stats] = await Promise.all([
          userService.getByUsername(username),
          incidentService.getAll({ author: username }),
          statsService.getByUser(username),
        ]);

        setUser(userData);

        setIncidents(incidentsData.map((inc) => ({
          ...inc,
          date: new Date(inc.date ?? inc.created_at),
        })));

        setStatsData([
          { label: "Reportados",      value: stats.reportados ?? incidentsData.length, icon: statIcons.reportados },
          { label: "Votos recibidos", value: stats.votos      ?? 0,                    icon: statIcons.votos      },
          { label: "Suscritos",       value: stats.suscritos  ?? 0,                    icon: statIcons.suscritos  },
        ]);
      } catch (err) {
        setError("Usuario no encontrado.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Cargando perfil...</p>
      </div>
      <Footer />
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">{error ?? "Usuario no encontrado."}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-blue-600 hover:underline"
        >
          Volver atrás
        </button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-4xl lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">

        {/* Cabecera: avatar + nombre + stats *//*}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar — solo lectura *//*}
          <div className="w-24 h-24 rounded-full shrink-0 overflow-hidden">
            {user.avatar
              ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )
            }
          </div>

          <div className="flex-1 w-full flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-black text-gray-900">
                {user.full_name ?? user.fullName}
              </h1>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
            <ProfileStats stats={statsData} />
          </div>

        </div>

        {/* Incidentes reportados *//*}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <ProfileIncidents incidents={incidents} otherUser />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
} */