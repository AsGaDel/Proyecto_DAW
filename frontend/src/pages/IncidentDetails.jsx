import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import IncidentPhoto    from "../components/IncidentPhoto";
import IncidentInfo     from "../components/IncidentInfo";
import IncidentActions  from "../components/IncidentActions";
import IncidentComments from "../components/IncidentComments";

import incidentService from "../services/incidentService";

export default function IncidentDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [incident, setIncident] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true);
        const data = await incidentService.getById(id);

        // Normaliza la ubicación — ajusta los campos según tu backend
        const location = (data.latitude && data.longitude)
          ? { latlng: { lat: data.latitude, lng: data.longitude }, address: data.address ?? "" }
          : null;

        setIncident({
          ...data,
          date:     new Date(data.date ?? data.created_at),
          location,
          author:   data.author ?? { username: data.author_username, avatar: data.author_avatar ?? null },
        });
      } catch (err) {
        setError("No se pudo cargar el incidente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Cargando incidente...</p>
      </div>
      <Footer />
    </div>
  );

  if (error || !incident) return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">{error ?? "Incidente no encontrado."}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-blue-600 hover:underline"
        >
          Volver atrás
        </button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 w-full mx-auto px-4 md:px-16 lg:px-28 xl:px-40 py-8">

        {/* Contenido principal: foto + info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">

          {/* Foto */}
          <div className="w-full md:w-2/5 shrink-0">
            <IncidentPhoto photo={incident.photo} name={incident.name} />
          </div>

          {/* Info + acciones */}
          <div className="flex-1 flex flex-col gap-6">
            <IncidentInfo
              name={incident.name}
              location={incident.location}
              description={incident.description}
              priority={incident.priority}
              status={incident.status}
              category={incident.category}
              date={incident.date}
              author={incident.author}
            />
            <IncidentActions incidentId={incident.id} />
          </div>

        </div>

        <div className="w-full h-px bg-gray-200 mb-0" />

        <IncidentComments incidentId={incident.id} />

      </main>

      <Footer />
    </div>
  );
}