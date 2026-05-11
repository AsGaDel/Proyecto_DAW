import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import commentService from "../services/commentService";

// ─── Componente Comment ───────────────────────────────────────────────────────

function Comment({ username, avatar, text, date }) {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-200 last:border-0">
      {avatar
        ? <img src={avatar} alt={username} className="w-8 h-8 rounded-full object-cover shrink-0" />
        : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
        )
      }
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-700">{username}</span>
          <span className="text-xs text-gray-400">
            {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date)}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function IncidentComments({ incidentId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text,     setText]     = useState("");
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const [error,    setError]    = useState(null);

  // ── Carga de comentarios ──
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentService.getByIncident(incidentId);
        const parsed = data.map((c) => ({
          ...c,
          username: c.author?.username ?? c.username,
          avatar:   c.author?.avatar   ?? c.avatar ?? null,
          date:     new Date(c.date ?? c.created_at),
        }));
        setComments(parsed);
      } catch (err) {
        setError("No se pudieron cargar los comentarios.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (incidentId) fetchComments();
  }, [incidentId]);

  // ── Enviar comentario ──
  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const newComment = await commentService.add(incidentId, text.trim());
      setComments((prev) => [...prev, {
        ...newComment,
        username: newComment.author?.username ?? user?.username ?? "yo",
        avatar:   newComment.author?.avatar   ?? user?.avatar   ?? null,
        date:     new Date(newComment.date ?? newComment.created_at ?? Date.now()),
      }]);
      setText("");
    } catch (err) {
      console.error("Error al enviar el comentario:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Comentarios <span className="text-gray-400 font-normal">({comments.length})</span>
      </h2>

      {/* Lista de comentarios */}
      {loading && (
        <p className="text-xs text-gray-400 mb-4">Cargando comentarios...</p>
      )}

      {error && !loading && (
        <p className="text-xs text-red-400 mb-4">{error}</p>
      )}

      {!loading && !error && (
        <div className="mb-6">
          {comments.length === 0
            ? <p className="text-xs text-gray-400 py-4">Sé el primero en comentar.</p>
            : comments.map((c) => <Comment key={c.id} {...c} />)
          }
        </div>
      )}

      {/* Nuevo comentario */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user?.username?.charAt(0).toUpperCase() ?? "Y"}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !sending && handleSubmit()}
            placeholder="Escribe un comentario..."
            className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors cursor-pointer"
          >
            {sending ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}