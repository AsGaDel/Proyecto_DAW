import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { usePageTitle } from "../hooks/usePageTitle";

// ─── Validadores ──────────────────────────────────────────────────────────────

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "El nombre es obligatorio.";
  
  if (!form.email.trim()) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "El formato del correo no es válido.";
  }

  if (!form.subject) errors.subject = "Selecciona un asunto.";
  if (!form.message.trim()) errors.message = "El mensaje no puede estar vacío.";
  
  return errors;
}

// ─── Helpers de Estilo ────────────────────────────────────────────────────────

const baseInput = "w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition";

function inputClass(touched, error) {
  if (touched && error) return `${baseInput} border-red-400 focus:ring-red-300`;
  return `${baseInput} border-gray-200 focus:ring-blue-500`;
}

function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Contact() {
  usePageTitle("Contacto");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    if (touched[name]) {
      setErrors(validate(updatedForm));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allErrors = validate(form);
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    
    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) return;

    setLoading(true);
    // Simulación de envío
    setTimeout(() => {
      alert("Mensaje enviado con éxito.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">
          
          {/* Cabecera */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Contacto</h1>
            <p className="text-xs text-gray-400">Estamos aquí para ayudarte a mejorar tu ciudad.</p>
          </div>

          {/* Información Directa */}
          <Section title="Canales de atención">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Email</p>
                  <p className="text-sm font-medium text-gray-700">soporte@arit-app.es</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Teléfono</p>
                  <p className="text-sm font-medium text-gray-700">+34 922 00 00 00</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Formulario con Validación */}
          <Section title="Envíanos un mensaje">
            <form onSubmit={handleSubmit} className="mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field label="Nombre completo" error={touched.name && errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tu nombre"
                    className={inputClass(touched.name, errors.name)}
                  />
                </Field>

                <Field label="Correo electrónico" error={touched.email && errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="usuario@email.com"
                    className={inputClass(touched.email, errors.email)}
                  />
                </Field>
              </div>

              <Field label="Asunto" error={touched.subject && errors.subject}>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass(touched.subject, errors.subject)}
                >
                  <option value="">Selecciona un motivo</option>
                  <option value="Técnico">Incidencia Técnica</option>
                  <option value="Reporte">Consulta sobre mi Reporte</option>
                  <option value="Sugerencia">Sugerencia de Mejora</option>
                  <option value="Otro">Otro motivo</option>
                </select>
              </Field>

              <Field label="Mensaje" error={touched.message && errors.message}>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="4"
                  placeholder="Explícanos en qué podemos ayudarte..."
                  className={inputClass(touched.message, errors.message) + " resize-none"}
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-xs font-bold py-3 rounded-lg transition-all shadow-md active:scale-[0.98] mt-2 cursor-pointer"
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </Section>

          {/* Ubicación */}
          <Section title="Ubicación de nuestras oficinas">
            <p>Omni-Tech S.L. tiene su sede principal en:</p>
            <p className="font-medium text-gray-800 italic">Avenida de La Asunción, 12, 38111 Santa Cruz de Tenerife, España</p>
          </Section>

          {/* Footer Legal */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Omni-Tech S.L. — Todos los derechos reservados.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}