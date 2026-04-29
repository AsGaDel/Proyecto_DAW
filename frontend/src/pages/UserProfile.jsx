import { useState } from "react";

import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import ProfileAvatar    from "../components/ProfileAvatar";
import ProfileStats     from "../components/ProfileStats";
import ProfileInfo      from "../components/ProfileInfo";
import ProfileIncidents from "../components/ProfileIncidents";
import ProfileSubscribed from "../components/ProfileSubscribed";

// ─── Datos de ejemplo - Borrar al conectar el backend ─────────────────────────────────────────────────────────

const sampleUser = {
  fullName:  "Edwar González",
  username:  "edwar_g",
  email:     "edwar@arit.com",
  avatar:    null,
  createdAt: new Date("2025-09-01"),
};

// ─── Incidentes de ejemplo - Borrar al conectar el backend  ─────────────────────────────────────────────────────────
const sampleMyIncidents = [
  { id: 1,  name: "Bache en la calle",      photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",                                                                                                          priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "edwar_g", avatar: null } },
  { id: 2,  name: "Farola en mal estado",   photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura",  date: new Date("2026-04-10T14:00:00"), author: { username: "edwar_g", avatar: null } },
  { id: 3,  name: "Banco roto",             photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg",                                                                                        priority: "Leve", category: "Infraestructura",     date: new Date("2026-04-06T09:00:00"), author: { username: "edwar_g", avatar: null } },
  { id: 4,  name: "Bache en la calle",      photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",                                                                                                          priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "edwar_g", avatar: null } },
  { id: 5,  name: "Farola en mal estado",   photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura",  date: new Date("2026-04-10T14:00:00"), author: { username: "edwar_g", avatar: null } },
  { id: 6,  name: "Banco roto",             photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg",                                                                                        priority: "Leve", category: "Infraestructura",     date: new Date("2026-04-06T09:00:00"), author: { username: "edwar_g", avatar: null } },
];

const sampleMySubscribed = [
  { id: 1,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 2,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 3,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 4,  name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 5,  name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 6,  name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } }
];

// ─── Iconos para estadísticas ─────────────────────────────────────────────────

const statsData = [
  {
    label: "Reportados",
    value: 3,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  {
    label: "Votos recibidos",
    value: 24,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    ),
  },
  {
    label: "Suscritos",
    value: 8,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
      </svg>
    ),
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function UserProfile() {
  const [user,   setUser]   = useState(sampleUser);
  const [avatar, setAvatar] = useState(null);
  // Añade el estado en UserProfile:
  const [activeTab, setActiveTab] = useState("reportados");

  const handleAvatarChange = (file) => {
    setAvatar(URL.createObjectURL(file));
    // TODO: await userService.uploadAvatar(file);
  };

  const handleSave = async (form) => {
    setUser((prev) => ({ ...prev, ...form }));
    // TODO: await userService.update(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">

        {/* Cabecera: avatar + nombre + stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <ProfileAvatar
            username={user.username}
            avatar={avatar}
            onAvatarChange={handleAvatarChange}
          />
          <div className="flex-1 w-full flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-black text-gray-900">{user.fullName}</h1>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>
            <ProfileStats stats={statsData} />
          </div>
        </div>

        {/* Información personal editable */}
        <ProfileInfo user={user} onSave={handleSave} />

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Tabs */}
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

          {/* Contenido del tab activo */}
          <div className="p-6">
            {activeTab === "reportados"
              ? <ProfileIncidents incidents={sampleMyIncidents} />
              : <ProfileSubscribed incidents={sampleMySubscribed} />
            }
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}