import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function CategoryModal({ category = null, onSave, onClose }) {
  const [name,  setName]  = useState(category?.name ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(category?.name ?? "");
    setError("");
  }, [category]);

  const handleSave = () => {
    if (!name.trim()) { setError("El nombre no puede estar vacío."); return; }
    onSave({ ...category, name: name.trim() });
    onClose();
  };

  const isEditing = category !== null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">

        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            {isEditing ? "Editar categoría" : "Nueva categoría"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="px-5 py-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="Ej: Infraestructura"
            autoFocus
            className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition
              ${error ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-500"}`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Botones */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2.5 rounded-lg transition-colors"
          >
            {isEditing ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}