import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar             from "../components/Navbar";
import Footer             from "../components/Footer";
import CreateIncidentForm from "../components/CreateIncidentForm";

export default function CreateIncident() {
  const navigate        = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // TODO: llamar al backend aquí
      // const incident = await incidentService.create(formData);
      // navigate(`/incidente/${incident.id}`);
      console.log("Publicando incidente:", formData);
      await new Promise((r) => setTimeout(r, 1000)); // simulación
      setSuccess(true);
    } catch (err) {
      console.error("Error al publicar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar appName="ARIT" />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-sm w-full shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Incidente publicado</p>
          <p className="text-xs text-gray-400 mb-6">Tu reporte ya es visible para el resto de usuarios.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => navigate("/incident-list")}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              Ver todos los incidentes
            </button>
            <button onClick={() => setSuccess(false)}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">
              Publicar otro incidente
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-md font-bold uppercase tracking-tight text-gray-500 mb-1">
            Crear incidente
          </h1>
          <p className="text-xs text-gray-400">
            Rellena los datos para publicar un nuevo incidente en tu zona.
          </p>
        </div>

        <CreateIncidentForm onSubmit={handleSubmit} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}