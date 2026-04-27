import { useState } from "react";

const baseInput = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfileInfo({ user, onSave }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({
    fullName: user.fullName ?? "",
    username: user.username ?? "",
    email:    user.email    ?? "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave?.(form);
    // TODO: await userService.update(form);
    setLoading(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      fullName: user.fullName ?? "",
      username: user.username ?? "",
      email:    user.email    ?? "",
    });
    setEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Información personal
        </h2>
        {!editing
          ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
              </svg>
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          )
        }
      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre y apellidos">
          <input
            type="text" name="fullName" value={form.fullName}
            onChange={handleChange} disabled={!editing}
            placeholder="Tu nombre completo"
            className={baseInput}
          />
        </Field>

        <Field label="Nombre de usuario">
          <input
            type="text" name="username" value={form.username}
            onChange={handleChange} disabled={!editing}
            placeholder="Tu username"
            className={baseInput}
          />
        </Field>

        <Field label="Correo electrónico">
          <input
            type="email" name="email" value={form.email}
            onChange={handleChange} disabled={!editing}
            placeholder="Tu correo"
            className={baseInput}
          />
        </Field>

        <Field label="Miembro desde">
          <input
            type="text"
            value={new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(user.createdAt)}
            disabled
            className={baseInput}
          />
        </Field>
      </div>

    </div>
  );
}