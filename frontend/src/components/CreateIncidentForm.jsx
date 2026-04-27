import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";

// ─── Validadores ──────────────────────────────────────────────────────────────

function validate(form) {
  const errors = {};
  if (!form.title.trim())       errors.title       = "El título no puede estar vacío.";
  if (!form.location)           errors.location    = "Selecciona una ubicación en el mapa.";
  if (!form.description.trim()) errors.description = "La descripción no puede estar vacía.";
  if (!form.category)           errors.category    = "Selecciona una categoría.";
  if (!form.priority)           errors.priority    = "Selecciona un nivel de prioridad.";
  return errors;
}

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const baseInput = "w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition";

function inputClass(touched, error) {
  if (touched && error) return `${baseInput} border-red-400 focus:ring-red-300`;
  return `${baseInput} border-gray-200 focus:ring-blue-500`;
}

function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const categorias = ["Red / Conectividad", "Suministro eléctrico", "Infraestructura", "Otro"];
const prioridades = [
  { value: "Leve",     color: "bg-green-700  text-green-50"  },
  { value: "Moderado", color: "bg-yellow-600 text-yellow-50" },
  { value: "Crítico",  color: "bg-red-700    text-red-50"    },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CreateIncidentForm({ onSubmit, loading }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", location: null, description: "", category: "", priority: "", photo: null,
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };        // ← forma actualizada
    setForm(updatedForm);
    if (touched[name]) {
      setErrors(validate(updatedForm));                     // ← valida con el valor actual
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };        // ← forma actualizada
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(updatedForm));                       // ← valida con el valor actual
  };

  const handleSubmit = () => {
    const allErrors  = validate(form);
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;
    onSubmit?.(form);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">

      {/* Columna izquierda: imagen + campos */}
      <div className="flex-1">
        <ImageUploader
          value={form.photo}
          onChange={(file) => setForm((prev) => ({ ...prev, photo: file }))}
        />

        <Field label="Título" error={touched.title && errors.title}>
          <input
            type="text" name="title" value={form.title}
            onChange={handleChange} onBlur={handleBlur}
            placeholder="Describe brevemente el incidente"
            className={inputClass(touched.title, errors.title)}
          />
        </Field>

        <Field label="Calle / Ubicación" error={touched.location && errors.location}>
          <LocationPicker
            value={form.location}
            onChange={(loc) => {
              setForm((prev) => ({ ...prev, location: loc }));
              if (touched.location) {
                setErrors((prev) => ({ ...prev, location: loc ? undefined : "Selecciona una ubicación." }));
              }
            }}
          />
        </Field>

        <Field label="Descripción" error={touched.description && errors.description}>
          <textarea
            name="description" value={form.description}
            onChange={handleChange} onBlur={handleBlur}
            placeholder="Explica qué ocurrió, cuándo y qué impacto tiene..."
            rows={4}
            className={inputClass(touched.description, errors.description) + " resize-none"}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoría" error={touched.category && errors.category}>
            <select
              name="category" value={form.category}
              onChange={handleChange} onBlur={handleBlur}
              className={inputClass(touched.category, errors.category)}
            >
              <option value="">Selecciona</option>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Prioridad" error={touched.priority && errors.priority}>
            <select
              name="priority" value={form.priority}
              onChange={handleChange} onBlur={handleBlur}
              className={inputClass(touched.priority, errors.priority)}
            >
              <option value="">Selecciona</option>
              {prioridades.map(({ value }) => <option key={value} value={value}>{value}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Columna derecha: botón publicar */}
      <div className="lg:w-48 flex lg:flex-col lg:items-stretch items-start gap-3 lg:pt-[calc(100%/3)]">
        <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 
          text-white font-semibold text-sm py-3 px-6 rounded-lg transition-colors duration-150 cursor-pointer">
          {loading ? "Publicando..." : "Publicar incidente"}
        </button>
        <a onClick={() => navigate(-1)} className="w-full text-center text-sm text-gray-500 hover:text-gray-700 
          font-medium py-3 px-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          Cancelar
        </a>
      </div>

    </div>
  );
}