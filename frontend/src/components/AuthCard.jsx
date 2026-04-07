import { useState } from "react";

// ─── Validadores por campo ───────────────────────────────────────────────────

const validators = {
  // Login
  username: (value) => {
    if (!value.trim()) return "El nombre de usuario no puede estar vacío.";
    return null; // null = válido
  },
  password: (value) => {
    if (!value.trim()) return "La contraseña no puede estar vacía.";
    return null;
  },

  // Register
  fullName: (value) => {
    if (!value.trim()) return "El nombre y apellidos no pueden estar vacíos.";
    return null;
  },
  email: (value) => {
    if (!value.trim()) return "El correo no puede estar vacío.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Introduce un correo válido.";
    return null;
  },
  confirmPassword: (value, form) => {
    if (!value.trim()) return "Repite tu contraseña.";
    if (value !== form.password) return "Las contraseñas no coinciden.";
    return null;
  },
};

// ─── Iconos ──────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg className="w-4 h-4 text-green-500 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="w-4 h-4 text-red-500 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Componente base reutilizable ────────────────────────────────────────────

function ARITAuthCard({ title, fields, submitLabel, footerText, footerLinkText, footerLinkHref, onSubmit }) {
  const initialState = Object.fromEntries(fields.map((f) => [f.name, ""]));

  const [form,    setForm]    = useState(initialState);
  const [errors,  setErrors]  = useState({});   // { fieldName: "mensaje" | null }
  const [touched, setTouched] = useState({});   // { fieldName: true } — se marcó al salir del input
  const [loading, setLoading] = useState(false);

  const validate = (name, value) => {
    const validator = validators[name];
    return validator ? validator(value, form) : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Si el campo ya fue tocado, revalida en tiempo real mientras escribe
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = () => {
    // Validar todos los campos al enviar
    const allTouched = Object.fromEntries(fields.map((f) => [f.name, true]));
    const allErrors  = Object.fromEntries(fields.map((f) => [f.name, validate(f.name, form[f.name])]));

    setTouched(allTouched);
    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some(Boolean);
    if (hasErrors) return;

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
          {fields.map(({ name, label, type, placeholder }) => {
            const isTouched = touched[name];
            const error     = errors[name];
            const isValid   = isTouched && !error;
            const isInvalid = isTouched && !!error;

            return (
              <div key={name}>
                {/* Label + icono */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                  {isValid   && <IconCheck />}
                  {isInvalid && <IconX />}
                </label>

                {/* Input */}
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  className={`w-full bg-gray-50 rounded-md px-4 py-3 text-sm font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition border
                    ${isInvalid
                      ? "border-red-500 focus:ring-red-400"
                      : isValid
                        ? "border-green-500 focus:ring-green-400"
                        : "border-gray-200 focus:ring-blue-600"
                    }`}
                />

                {/* Mensaje de error */}
                {isInvalid && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>
            );
          })}

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

// ─── Login ───────────────────────────────────────────────────────────────────

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
        // TODO: llamar al backend aquí
        // Ejemplo cuando el backend esté listo:
        // const res = await authService.login(data.username, data.password);
        // if (!res.ok) { mostrarError("Usuario o contraseña incorrectos"); done(); return; }
        // navigate("/dashboard");
        console.log("Login:", data);
        setTimeout(done, 1000);
      }}
    />
  );
}

// ─── Register ────────────────────────────────────────────────────────────────

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
        // TODO: llamar al backend aquí
        console.log("Register:", data);
        setTimeout(done, 1000);
      }}
    />
  );
}