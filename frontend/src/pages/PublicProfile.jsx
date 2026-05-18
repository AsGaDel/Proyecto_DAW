import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { usePageTitle } from "../hooks/usePageTitle";

import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import ProfileStats     from "../components/ProfileStats";
import ProfileIncidents from "../components/ProfileIncidents";

import userService     from "../services/userService";
import incidentService from "../services/incidentService";
import { mediaUrl }    from "../utils/mediaUrl";

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
  usePageTitle("Usuario: " + user?.username);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, incidentsData] = await Promise.all([
          userService.getByUsername(username),
          incidentService.getAll({ reporter: username }),
        ]);

        setUser(userData);

        setIncidents(incidentsData.map((inc) => ({
          ...inc,
          date: new Date(inc.date ?? inc.created_at),
        })));

        setStatsData([
          { label: "Reportados",      value: incidentsData.length, icon: statIcons.reportados },
          { label: "Votos recibidos", value: incidentsData.reduce((acc, inc) => acc + (inc.vote_count ?? 0), 0), icon: statIcons.votos },
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
      <Navbar appName="ARIT" showNavLinks />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Cargando perfil...</p>
      </div>
      <Footer />
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" showNavLinks />
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
      <Navbar appName="ARIT" showNavLinks />

      <main className="flex-1 max-w-4xl lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">

        {/* Cabecera: avatar + nombre + stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar — solo lectura */}
          <div className="w-24 h-24 rounded-full shrink-0 overflow-hidden">
            {user.avatar
              ? <img src={mediaUrl(user.avatar) ?? user.avatar} alt={user.username} className="w-full h-full object-cover" />
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
            <ProfileStats stats={statsData} cols={2} />
          </div>

        </div>

        {/* Incidentes reportados */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <ProfileIncidents incidents={incidents} otherUser />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}