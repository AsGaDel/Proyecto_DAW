import { useState } from "react";

// ─── Iconos ──────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg className="inline w-4 h-4 text-green-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="inline w-4 h-4 text-red-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Componente base reutilizable ────────────────────────────────────────────

function ARITAuthCard({ title, fields, submitLabel, footerText, footerLinkText, footerLinkHref, onSubmit, serverErrors }) {
  const initialState  = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const initialTouched = Object.fromEntries(fields.map((f) => [f.name, false]));
  const initialErrors  = Object.fromEntries(fields.map((f) => [f.name, ""]));

  const [form,    setForm]    = useState(initialState);
  const [touched, setTouched] = useState(initialTouched);
  const [errors,  setErrors]  = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  // Valida un campo individual y devuelve el mensaje de error (o "")
  const validateField = (field, value) => {
    if (field.validate) return field.validate(value, form);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Si ya fue tocado, revalida en tiempo real mientras escribe
    if (touched[name]) {
      const field = fields.find((f) => f.name === name);
      setErrors((prev) => ({ ...prev, [name]: validateField(field, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const field = fields.find((f) => f.name === name);
    setErrors((prev) => ({ ...prev, [name]: validateField(field, value) }));
  };

  const handleSubmit = () => {
    // Marca todos como tocados y valida todos antes de enviar
    const allTouched = Object.fromEntries(fields.map((f) => [f.name, true]));
    const allErrors  = Object.fromEntries(
      fields.map((f) => [f.name, validateField(f, form[f.name])])
    );
    setTouched(allTouched);
    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some((e) => e !== "");
    if (hasErrors) return;

    setLoading(true);
    onSubmit?.(form, () => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm">

        {/* Header */}
        <div className="bg-white rounded-md px-6 py-4 text-center mb-8 shadow-sm">
          <h1 className="text-2xl font-black tracking-widest text-black uppercase">ARIT</h1>
          <p className="text-gray-600 text-sm mt-1">{title}</p>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {fields.map(({ name, label, type, placeholder }) => {
            const isTouched = touched[name];
            const error     = errors[name] || serverErrors?.[name];
            const isValid   = isTouched && !error;
            const isInvalid = isTouched && !!error;

            return (
              <div key={name}>
                {/* Label + icono de estado */}
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
                  className={`w-full bg-gray-50 rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition border ${
                    isInvalid
                      ? "border-red-500 focus:ring-red-400"
                      : isValid
                      ? "border-green-500 focus:ring-green-400"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />

                {/* Mensaje de error */}
                {isInvalid && (
                  <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
              </div>
            );
          })}

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500">
            {footerText}{" "}
            <a href={footerLinkHref} className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
              {footerLinkText}
            </a>
          </p>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-70 text-white font-semibold text-lg py-3 rounded-md transition-colors duration-150 cursor-pointer"
          >
            {loading ? "Cargando..." : submitLabel}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Validaciones de Login ────────────────────────────────────────────────────

const loginFields = [
  {
    name: "username",
    label: "Nombre de usuario",
    type: "text",
    placeholder: "Introduce tu nombre de usuario",
    validate: (value) => {
      if (!value.trim()) return "El nombre de usuario no puede estar vacío.";
      // TODO: cuando el backend esté listo, aquí llegará el error del servidor
      // a través de la prop serverErrors, no hace falta tocar este archivo.
      return "";
    },
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "Introduce tu contraseña",
    validate: (value) => {
      if (!value) return "La contraseña no puede estar vacía.";
      // TODO: el backend devolverá "Credenciales incorrectas" vía serverErrors.
      return "";
    },
  },
];

export function ARITLogin() {
  // serverErrors se rellenará desde pages/Login.jsx cuando el backend responda
  // Ejemplo: { username: "", password: "Usuario o contraseña incorrectos." }
  const [serverErrors, setServerErrors] = useState({});

  return (
    <ARITAuthCard
      title="Iniciar sesión"
      fields={loginFields}
      submitLabel="Acceder"
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate aquí"
      footerLinkHref="/register"
      serverErrors={serverErrors}
      onSubmit={(data, done) => {
        // TODO: sustituir por llamada real al backend
        // authService.login(data)
        //   .then(() => navigate("/dashboard"))
        //   .catch((err) => setServerErrors({ password: err.message }))
        //   .finally(done);
        console.log("Login:", data);
        setTimeout(done, 1500);
      }}
    />
  );
}

// ─── Validaciones de Register ─────────────────────────────────────────────────

const registerFields = [
  {
    name: "fullName",
    label: "Nombre y apellidos",
    type: "text",
    placeholder: "Introduce tu nombre y apellidos",
    validate: (value) => {
      if (!value.trim()) return "El nombre no puede estar vacío.";
      if (value.trim().split(" ").length < 2) return "Introduce nombre y al menos un apellido.";
      return "";
    },
  },
  {
    name: "username",
    label: "Nombre de usuario",
    type: "text",
    placeholder: "Crea tu nombre de usuario",
    validate: (value) => {
      if (!value.trim()) return "El nombre de usuario no puede estar vacío.";
      if (value.length < 3) return "Debe tener al menos 3 caracteres.";
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Solo letras, números y guión bajo.";
      return "";
    },
  },
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    placeholder: "Introduce tu correo",
    validate: (value) => {
      if (!value.trim()) return "El correo no puede estar vacío.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Introduce un correo válido.";
      return "";
    },
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "Crea tu contraseña",
    validate: (value) => {
      if (!value) return "La contraseña no puede estar vacía.";
      if (value.length < 8) return "Debe tener al menos 8 caracteres.";
      if (!/[A-Z]/.test(value)) return "Debe contener al menos una mayúscula.";
      if (!/[0-9]/.test(value)) return "Debe contener al menos un número.";
      return "";
    },
  },
  {
    name: "confirmPassword",
    label: "Repite la contraseña",
    type: "password",
    placeholder: "Repite tu contraseña",
    // El segundo argumento es el estado completo del formulario
    validate: (value, form) => {
      if (!value) return "Por favor repite la contraseña.";
      if (value !== form.password) return "Las contraseñas no coinciden.";
      return "";
    },
  },
];

export function ARITRegister() {
  const [serverErrors, setServerErrors] = useState({});

  return (
    <ARITAuthCard
      title="Registrarse"
      fields={registerFields}
      submitLabel="Registrarse"
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión aquí"
      footerLinkHref="/login"
      serverErrors={serverErrors}
      onSubmit={(data, done) => {
        // TODO: sustituir por llamada real al backend
        // authService.register(data)
        //   .then(() => navigate("/login"))
        //   .catch((err) => setServerErrors({ username: err.message }))
        //   .finally(done);
        console.log("Register:", data);
        setTimeout(done, 1500);
      }}
    />
  );
}