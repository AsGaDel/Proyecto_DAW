import { useState } from "react";
import { createPortal } from "react-dom";

export default function RoleModal({ user, onSave, onClose }) {
  // Inicializamos el estado con el rol actual del usuario
  const [selectedRole, setSelectedRole] = useState(user.role || "user");

  const roles = [
    { id: "user", label: "Usuario", desc: "Permisos estándar de lectura y voto." },
    { id: "worker", label: "Trabajador", desc: "Gestión de contenido y reportes." },
    { id: "admin", label: "Administrador", desc: "Control total del sistema." },
  ];

  const handleSave = () => {
    onSave(user.username, selectedRole);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            Cambiar rol de <span className="text-blue-600">@{user.username}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido: Listado de Roles */}
        <div className="px-5 py-5 flex flex-col gap-3">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                selectedRole === r.id 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-100 hover:border-gray-200 bg-gray-50"
              }`}
            >
              <p className={`text-sm font-bold ${selectedRole === r.id ? "text-blue-700" : "text-gray-700"}`}>
                {r.label}
              </p>
              <p className="text-xs text-gray-500">{r.desc}</p>
            </button>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2.5 rounded-lg shadow-sm shadow-blue-200 transition-colors"
          >
            Confirmar Cambio
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
