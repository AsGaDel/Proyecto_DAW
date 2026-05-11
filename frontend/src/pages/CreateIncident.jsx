import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar             from "../components/Navbar";
import Footer             from "../components/Footer";
import CreateIncidentForm from "../components/CreateIncidentForm";
import ActionButtons      from "../components/ActionButtons";

import incidentService from "../services/incidentService";
import { useToast }    from "../components/ToastContainer";

export default function CreateIncident() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const toast         = useToast();

  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [createdId, setCreatedId] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const incident = await incidentService.create(formData);
      setCreatedId(incident.id);
      setSuccess(true);
    } catch (err) {
      console.error("Error al publicar:", err);
      const msg = err.response?.data?.detail ?? "Error al publicar el incidente.";
      toast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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
            {createdId && (
              <button
                onClick={() => navigate(`/incidente/${createdId}`)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Ver el incidente
              </button>
            )}
            <button
              onClick={() => navigate("/incident-list")}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Ver todos los incidentes
            </button>
            <button
              onClick={() => { setSuccess(false); setCreatedId(null); }}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Publicar otro incidente
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />

      <main className="flex flex-col md:flex-row justify-between flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="bg-white max-w-full flex-1 px-4 mb-12 sm:px-8 lg:px-12 m-2 sm:m-3 md:m-4 lg:m-6 p-0 sm:p-2 md:p-4 xl:p-8 2xl:p-16 border border-gray-100 shadow-sm rounded-lg xl:ml-32 2xl:ml-64 py-6 order-2 md:order-1">
          <div className="mb-8">
            <h1 className="text-md font-bold uppercase tracking-tight text-gray-500 mb-1">
              Crear incidente
            </h1>
            <p className="text-sm text-gray-400">
              Rellena los datos para publicar un nuevo incidente en tu zona.
            </p>
          </div>
          <CreateIncidentForm onSubmit={handleSubmit} loading={loading} />
        </section>

        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1
          lg:sticky lg:top-14 lg:self-start lg:h-fit lg:border-t-0 lg:border-l-0 lg:w-56 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last
          xl:w-64 lg:bg-transparent">
          <ActionButtons actions={totalActions} />
        </aside>
      </main>

      <Footer />
    </div>
  );
}