import { useState } from "react";
 
// ─── Componente base reutilizable ───────────────────────────────────────────
 
function ARITAuthCard({ title, fields, submitLabel, footerText, footerLinkText, footerLinkHref, onSubmit }) {
  const initialState = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = () => {
    setLoading(true);
    onSubmit?.(form, () => setLoading(false));
  };
 
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm">
 
        {/* Header */}
        <div className="bg-white rounded-md px-6 py-4 text-center mb-8 shadow-sm">
          <h1 className="text-2xl font-black tracking-widest text-blue-600">ARIT</h1>
          <p className="text-gray-600 text-sm mt-1">{title}</p>
        </div>
 
        {/* Fields */}
        <div className="space-y-5">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>
          ))}
 
          {/* Footer link */}
          <p className="text-center text-sm text-gray-600">
            {footerText}{" "}
            <a href={footerLinkHref} className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
              {footerLinkText}
            </a>
          </p>
 
          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold text-lg py-3 rounded-md transition-colors duration-200 cursor-pointer"
          >
            {loading ? "Cargando..." : submitLabel}
          </button>
        </div>
 
      </div>
    </div>
  );
}
 
// ─── Login ──────────────────────────────────────────────────────────────────
 
const loginFields = [
  { name: "username", label: "Nombre de usuario", type: "text",     placeholder: "Introduce tu nombre de usuario" },
  { name: "password", label: "Contraseña",         type: "password", placeholder: "Introduce tu contraseña" },
];
 
export function ARITLogin() {
  return (
    <ARITAuthCard
      title="Iniciar sesión"
      fields={loginFields}
      submitLabel="Acceder"
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate aquí"
      footerLinkHref="/register"
      onSubmit={(data, done) => {
        console.log("Login:", data);
        setTimeout(done, 1000);
      }}
    />
  );
}
 
// ─── Register ───────────────────────────────────────────────────────────────
 
const registerFields = [
  { name: "fullName",        label: "Nombre y apellidos",   type: "text",     placeholder: "Introduce tu nombre y apellidos" },
  { name: "username",        label: "Nombre de usuario",    type: "text",     placeholder: "Crea tu nombre de usuario" },
  { name: "email",           label: "Correo electrónico",   type: "email",    placeholder: "Introduce tu correo" },
  { name: "password",        label: "Contraseña",           type: "password", placeholder: "Crea tu contraseña" },
  { name: "confirmPassword", label: "Repite la contraseña", type: "password", placeholder: "Repite tu contraseña" },
];
 
export function ARITRegister() {
  return (
    <ARITAuthCard
      title="Registrarse"
      fields={registerFields}
      submitLabel="Acceder"
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión aquí"
      footerLinkHref="/login"
      onSubmit={(data, done) => {
        console.log("Register:", data);
        setTimeout(done, 1000);
      }}
    />
  );
}