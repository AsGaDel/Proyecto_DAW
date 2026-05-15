import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleModal from "./RoleModal";
import AssignIncidentModal from "./AssignIncidentModal";
import { useToast }  from "./ToastContainer";
import { mediaUrl }  from "../utils/mediaUrl";

export default function UserCard({ user, onDelete, onChangeRole }) {  
  const navigate = useNavigate();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false); // 3. Estado del modal
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { username, fullName, stats, role } = user;
  const avatar = mediaUrl(user.avatar ?? user.profile?.avatar);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const roleStyles = {
    admin:  "bg-red-50  text-red-600  border border-red-200",
    worker: "bg-blue-50 text-blue-600 border border-blue-200",
    user:   "bg-gray-50 text-gray-500 border border-gray-200",
  };

  const roleLabels = {
    admin:  "Administrador",
    worker: "Trabajador",
    user:   "Usuario",
  };

const handleRoleUpdate = (username, newRole) => {
  onChangeRole?.(username, newRole);
};
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
      
      <div className="flex items-center gap-4 mb-4">
        <div className="shrink-0 cursor-pointer group" onClick={() => navigate(`/profile/${username}`)}>
          {avatar
            ? <img src={avatar} alt={username} className="w-12 h-12 rounded-full object-cover" />
            : (
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold group-hover:bg-blue-500">
                {username.charAt(0).toUpperCase()}
              </div>
            )
          }
        </div>
        <div className="flex-1 min-w-0 cursor-pointer group" onClick={() => navigate(`/profile/${username}`)}>
          <p className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-800">{fullName}</p>
          <p className="text-xs text-gray-400 truncate group-hover:text-blue-400">@{username}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-md shrink-0 ${roleStyles[role] ?? roleStyles.user}`}>
          {roleLabels[role] ?? "Usuario"}
        </span>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-sm font-black text-gray-800">{stats.reportados}</p>
          <p className="text-xs text-gray-400 leading-tight">Reportados</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-sm font-black text-gray-800">{stats.votos}</p>
          <p className="text-xs text-gray-400 leading-tight">Votos</p>
        </div>
      </div>

      {/* Acciones */}
      {!confirmDelete
        ? (
          <div className="flex gap-2">
            {role === "worker" && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="flex-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg transition-colors"
              >
                Asignar
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition-colors"
            >
              Cambiar rol
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
         )
        : (
          // Confirmación de borrado
          <div className="flex flex-col gap-2">
            <p className="text-xs text-red-500 font-medium text-center">¿Eliminar este usuario?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { onDelete?.(username); setConfirmDelete(false); }}
                className="flex-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        )
      }

      {/* 5. Renderizado condicional del modal */}
      {isModalOpen && (
        <RoleModal 
          user={user} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleRoleUpdate} 
        />
      )}

      {/* Añade el modal de asignación junto al RoleModal */}
      {isAssignModalOpen && (
        <AssignIncidentModal
          user={user}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={(incidentId, username) => {
            toast({ message: `Incidente asignado a @${username}.`, type: "success" });
          }}
        />
      )}

    </div>
  );
}