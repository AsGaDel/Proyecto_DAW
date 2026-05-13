import { useState, useEffect } from "react";

import { usePageTitle } from "../hooks/usePageTitle";

import Navbar            from "../components/Navbar";
import Footer            from "../components/Footer";
import ProfileAvatar     from "../components/ProfileAvatar";
import ProfileStats      from "../components/ProfileStats";
import ProfileInfo       from "../components/ProfileInfo";
import ProfileIncidents  from "../components/ProfileIncidents";
import ProfileSubscribed from "../components/ProfileSubscribed";

import userService     from "../services/userService";
import incidentService from "../services/incidentService";
import { useToast }    from "../components/ToastContainer";
import { useAuth } from "../context/AuthContext";

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

export default function UserProfile() {
  usePageTitle("Mi perfil");
  const toast = useToast();

  const [user,        setUser]        = useState(null);
  const [avatar,      setAvatar]      = useState(null);
  const [myIncidents, setMyIncidents] = useState([]);
  const [subscribed,  setSubscribed]  = useState([]);
  const [statsData,   setStatsData]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [activeTab,   setActiveTab]   = useState("reportados");
  const { setUser: setAuthUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, myIncidentsData, subscribedData] = await Promise.all([
          userService.getMe(),
          incidentService.getMine(),
          incidentService.getSubscribed(),
        ])

        setUser({
          ...userData,
          createdAt: new Date(userData.created_at ?? userData.createdAt),
        });

        setAvatar(userData.avatar ?? null);

        setMyIncidents(myIncidentsData.map((inc) => ({
          ...inc,
          date: new Date(inc.date ?? inc.created_at),
        })));

        setSubscribed(subscribedData.map((inc) => ({
          ...inc,
          date: new Date(inc.date ?? inc.created_at),
        })));

        setStatsData([
          { label: "Reportados",      value: myIncidentsData.length, icon: statIcons.reportados },
          { label: "Votos recibidos", value: myIncidentsData.reduce((acc, inc) => acc + (inc.votes ?? 0), 0), icon: statIcons.votos },
          { label: "Suscritos",       value: subscribedData.length,  icon: statIcons.suscritos  },
        ]);
      } catch (err) {
        setError("No se pudo cargar el perfil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAvatarChange = async (file) => {
    try {
      const updated = await userService.uploadAvatar(file);
      setAvatar(updated.avatar ?? URL.createObjectURL(file));
      setAuthUser((prev) => ({ ...prev, avatar: updated.avatar }));
      toast({ message: "Foto de perfil actualizada.", type: "success" });
    } catch (err) {
      toast({ message: "Error al actualizar la foto.", type: "error" });
    }
  };

  const handleSave = async (form) => {
    try {
      const updated = await userService.update({
        full_name: form.fullName,
        username:  form.username,
        email:     form.email,
      });
      setUser((prev) => ({ ...prev, ...updated }));
      toast({ message: "Perfil actualizado correctamente.", type: "success" });
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data)[0]?.[0]
        : "Error al guardar los cambios.";
      toast({ message: msg ?? "Error al guardar los cambios.", type: "error" });
      throw err; // para que ProfileInfo mantenga el modo edición
    }
  };

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
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">{error ?? "No se pudo cargar el perfil."}</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-4xl lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">

        {/* Cabecera: avatar + nombre + stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <ProfileAvatar
            username={user.username}
            avatar={avatar}
            onAvatarChange={handleAvatarChange}
          />
          <div className="flex-1 w-full flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-black text-gray-900">{user.full_name ?? user.fullName}</h1>
              <p className="text-sm text-gray-400">@{user.username}</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md mt-1 inline-block
                ${user.role === "admin"  ? "bg-red-50  text-red-600  border border-red-200"  :
                  user.role === "worker" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                                          "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                {user.role === "admin"  ? "Administrador" :
                user.role === "worker" ? "Trabajador"    : "Usuario"}
              </span>
            </div>
            <ProfileStats stats={statsData} />
          </div>
        </div>

        {/* Información personal editable */}
        <ProfileInfo
          user={{
            fullName:  user.full_name  ?? user.fullName,
            username:  user.username,
            email:     user.email,
            createdAt: user.createdAt,
          }}
          onSave={handleSave}
        />

        {/* Tabs incidentes */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("reportados")}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors
                ${activeTab === "reportados"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              Mis reportados
            </button>
            <button
              onClick={() => setActiveTab("suscritos")}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors
                ${activeTab === "suscritos"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              Suscritos
            </button>
          </div>
          <div className="p-6">
            {activeTab === "reportados"
              ? <ProfileIncidents incidents={myIncidents} />
              : <ProfileSubscribed incidents={subscribed} />
            }
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}