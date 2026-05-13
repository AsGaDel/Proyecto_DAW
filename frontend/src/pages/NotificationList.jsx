import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { usePageTitle } from "../hooks/usePageTitle";

import notificationService from "../services/notificationService";

// ─── Iconos y colores ─────────────────────────────────────────────────────────

const typeIcons = {
  comment: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  vote: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ),
  resolved: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  new: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
    </svg>
  ),
  subscribe: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
};

const typeColors = {
  comment:   "bg-blue-50   text-blue-500",
  vote:      "bg-green-50  text-green-500",
  resolved:  "bg-green-50  text-green-500",
  new:       "bg-amber-50  text-amber-500",
  subscribe: "bg-purple-50 text-purple-500",
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return "Hace un momento";
  if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function NotificationList() {
  usePageTitle("Notificaciones");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getAll();
        const parsed = data.map((n) => ({
          ...n,
          date:     new Date(n.date ?? n.created_at),
          incident: n.incident ?? null,
        }));
        setNotifications(parsed);
      } catch (err) {
        setError("No se pudieron cargar las notificaciones.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error al eliminar la notificación:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-8 py-8">

        {/* Cabecera */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-bold text-gray-500 uppercase text-md my-2">Notificaciones</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">{unreadCount} sin leer</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-blue-600 hover:underline font-medium transition-colors"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Estado de carga y error */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">Cargando notificaciones...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Lista */}
        {!loading && !error && (
          notifications.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
                </svg>
                <p className="text-sm text-gray-400">No tienes notificaciones.</p>
              </div>
            )
            : (
              <div className="flex flex-col gap-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-4 bg-white border rounded-xl px-4 py-4 shadow-sm cursor-pointer hover:border-gray-300 transition-all duration-150
                      ${!n.read ? "border-blue-200 bg-blue-50/30" : "border-gray-200"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${typeColors[n.type] ?? "bg-gray-50 text-gray-400"}`}>
                      {typeIcons[n.type]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                        {n.text}
                      </p>
                      {n.incident && (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/incident/${n.incident.id}`); }}
                          className="text-xs text-blue-600 hover:underline font-medium mt-0.5 text-left"
                        >
                          → {n.incident.name}
                        </button>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.date)}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 block" />}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}

      </main>

      <Footer />
    </div>
  );
}