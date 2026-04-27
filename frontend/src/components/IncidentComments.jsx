import { useState } from "react";

const sampleComments = [
  { id: 1, username: "laura_g",  avatar: null, text: "Llevo semanas viendo este problema, es urgente que lo arreglen.",        date: new Date("2026-04-13T09:15:00") },
  { id: 2, username: "pedro_r",  avatar: null, text: "Ya avisé al ayuntamiento pero no han respondido todavía.",               date: new Date("2026-04-13T11:42:00") },
  { id: 3, username: "carlos_m", avatar: null, text: "Pasé por ahí esta mañana y sigue igual, alguien debería actuar ya.",     date: new Date("2026-04-14T08:05:00") },
];

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

export default function IncidentComments({ incidentId }) {
  const [comments, setComments] = useState(sampleComments);
  const [text,     setText]     = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    const newComment = {
      id:       comments.length + 1,
      username: "yo",
      avatar:   null,
      text:     text.trim(),
      date:     new Date(),
    };
    setComments((prev) => [...prev, newComment]);
    setText("");
    // TODO: await commentService.add(incidentId, text);
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Comentarios <span className="text-gray-400 font-normal">({comments.length})</span>
      </h2>

      {/* Lista de comentarios */}
      <div className="mb-6">
        {comments.map((c) => (
          <Comment key={c.id} {...c} />
        ))}
      </div>

      {/* Nuevo comentario */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          Y
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Escribe un comentario..."
            className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}