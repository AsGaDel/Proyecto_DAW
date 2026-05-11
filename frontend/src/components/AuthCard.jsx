import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../api/authService";

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

// Iconos para ver/ocultar contraseña
function IconEye() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconEyeSlash() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

// ─── Estilos base de input ────────────────────────────────────────────────────

const baseInputStyle = "w-full bg-gray-50 rounded-md px-4 py-3 text-sm font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition border";

function inputStyle(isValid, isInvalid, showSuccess) {
  if (isInvalid) return `${baseInputStyle} border-red-500 focus:ring-red-400`;
  if (isValid && showSuccess) return `${baseInputStyle} border-green-500 focus:ring-green-400`;
  return `${baseInputStyle} border-gray-200 focus:ring-blue-600`;
}

// ─── Componente base reutilizable ────────────────────────────────────────────

function ARITAuthCard({ title, fields, submitLabel, footerText, footerLinkText, footerLinkHref, onSubmit, serverErrors, showIcons = false }) {
  const initialState = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const initialTouched = Object.fromEntries(fields.map((f) => [f.name, false]));
  const initialErrors = Object.fromEntries(fields.map((f) => [f.name, ""]));

  const [form, setForm] = useState(initialState);
  const [touched, setTouched] = useState(initialTouched);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar la visibilidad de los campos tipo password
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const validateField = (field, value) => {
    if (field.validate) return field.validate(value, form);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    const allTouched = Object.fromEntries(fields.map((f) => [f.name, true]));
    const allErrors = Object.fromEntries(fields.map((f) => [f.name, validateField(f, form[f.name])]));
    setTouched(allTouched);
    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some((e) => e !== "");
    if (hasErrors) return;

    setLoading(true);
    // Nota: El redireccionamiento debería ocurrir dentro de la respuesta exitosa en onSubmit
    onSubmit?.(form, () => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-sm">

        {/* Header */}
        <div className="bg-gray-50 border border-gray-100 rounded-md px-6 py-4 text-center mb-8 shadow-sm">
          <h1 className="text-2xl font-black tracking-widest text-blue-600">ARIT</h1>
          <p className="text-gray-600 text-sm mt-1">{title}</p>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {fields.map((field) => {
            const { name, label, type, placeholder } = field;
            const isTouched = touched[name];
            const error = errors[name] || serverErrors?.[name];
            const isValid = isTouched && !error;
            const isInvalid = isTouched && !!error;
            
            // Lógica de visibilidad
            const isPasswordField = type === "password";
            const isVisible = showPasswords[name];
            const inputType = isPasswordField ? (isVisible ? "text" : "password") : type;

            return (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                  {showIcons && (isInvalid ? <IconX /> : isValid ? <IconCheck /> : null)}
                </label>

                <div className="relative">
                  <input
                    type={inputType}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`${inputStyle(isValid, isInvalid, showIcons)} ${isPasswordField ? "pr-11" : ""}`}
                  />
                  
                  {isPasswordField && form[name].length > 0 && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(name)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {isVisible ? <IconEyeSlash /> : <IconEye />}
                    </button>
                  )}
                </div>

                {isInvalid && (
                  <p className="mt-1 text-xs text-red-500">{error}</p>
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
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold text-lg py-3 rounded-md transition-colors duration-300 cursor-pointer"
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
    placeholder: "Introduce tu contraseña",
    validate: (value) => (!value ? "La contraseña no puede estar vacía." : ""),
  },
];

export function ARITLogin() {
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate();

  return (
    <ARITAuthCard
      title="Iniciar sesión"
      fields={loginFields}
      submitLabel="Acceder"
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate aquí"
      footerLinkHref="/register"
      serverErrors={serverErrors}
      showIcons={false}
      onSubmit={(data, done) => {
        authService.login(data)
          .then(() => navigate("/dashboard"))
          .catch(() => setServerErrors({ password: "Correo o contraseña incorrectos." }))
          .finally(done);
      }}
    />
  );
}

// ─── Register ────────────────────────────────────────────────────────────────

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
    validate: (value, form) => {
      if (!value) return "Por favor repite la contraseña.";
      if (value !== form.password) return "Las contraseñas no coinciden.";
      return "";
    },
  },
];

export function ARITRegister() {
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate();

  return (
    <ARITAuthCard
      title="Registrarse"
      fields={registerFields}
      submitLabel="Registrarse"
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión aquí"
      footerLinkHref="/login"
      serverErrors={serverErrors}
      showIcons={true}
      onSubmit={(data, done) => {
        authService.register(data)
          .then(() => navigate("/login"))
          .catch((err) => {
            const detail = err.response?.data;
            setServerErrors({
              email:    detail?.email?.[0]    ?? "",
              username: detail?.username?.[0] ?? "",
            });
          })
          .finally(done);
      }}
    />
  );
}