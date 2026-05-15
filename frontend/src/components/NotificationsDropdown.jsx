import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "./Dropdown";

import notificationService from "../services/notificationService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return "Hace un momento";
  if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

function NotificationTrigger({ unreadCount }) {
  return (
    <div className="relative bg-transparent border border-white/15 text-white/70 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors select-none">
      Notificaciones
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-gray-800">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function NotificationsDropdown() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getAll();
        const parsed = data.map((n) => ({
          ...n,
          date: new Date(n.date ?? n.created_at),
        }));
        setNotifications(parsed);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const preview     = notifications.slice(0, 4);

  const handleClick = async (n) => {
    if (!n.is_read) {
      await notificationService.markRead(n.id).catch(() => {});
      setNotifications((prev) =>
        prev.map((x) => x.id === n.id ? { ...x, is_read: true } : x)
      );
    }
    if (n.incident) navigate(`/incident/${n.incident}`);
  };

  return (
    <Dropdown
      trigger={<NotificationTrigger unreadCount={unreadCount} />}
      align="right"
      width="w-60 md:w-80"
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-800">Notificaciones</p>
        {unreadCount > 0 && (
          <span className="text-xs text-blue-600 font-medium">{unreadCount} nuevas</span>
        )}
      </div>

      {/* Lista */}
      {loading
        ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-gray-400">Cargando...</p>
          </div>
        )
        : preview.length === 0
          ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-gray-400">No tienes notificaciones.</p>
            </div>
          )
          : (
            <ul>
              {preview.map((n) => (
                <li
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors
                    ${!n.is_read ? "bg-blue-50/50" : ""}`}
                >
                  <div className="mt-1.5 shrink-0">
                    {!n.is_read
                      ? <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                      : <span className="w-2 h-2 rounded-full bg-transparent block" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 leading-snug">{n.title}</p>
                    <p className="text-xs text-gray-500 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )
      }

      {/* Ver todas */}
      <div className="px-4 py-3">
        <button
          onClick={() => navigate("/notifications")}
          className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors text-center"
        >
          Ver todas las notificaciones →
        </button>
      </div>
    </Dropdown>
  );
}