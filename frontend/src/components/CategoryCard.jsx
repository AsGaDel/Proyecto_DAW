import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CategoryCard({ category, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">

      {/* Icono + nombre */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{category.name}</p>
          <p className="text-xs text-gray-400">{category.incidentCount ?? 0} incidentes</p>
        </div>
      </div>

      {/* Acciones */}
      {!confirmDelete
        ? (
          <div className="flex gap-2">
            {(category.incidentCount ?? 0) > 0 && (
              <button
                onClick={() => navigate("/incident-list", { state: { category: category.name } })}
                className="flex-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                Ver incidentes
              </button>
            )}
            <button
              onClick={() => onEdit(category)}
              className="flex-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition-colors"
            >
              Editar
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
            <p className="text-xs text-red-500 font-medium text-center">¿Eliminar esta categoría?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { onDelete(category.id); setConfirmDelete(false); }}
                className="flex-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
}