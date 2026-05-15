import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mediaUrl } from "../utils/mediaUrl";

import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";

import Navbar           from "../components/Navbar";
import Footer           from "../components/Footer";
import IncidentPhoto    from "../components/IncidentPhoto";
import IncidentInfo     from "../components/IncidentInfo";
import IncidentActions  from "../components/IncidentActions";
import IncidentComments from "../components/IncidentComments";
import AssignPanel      from "../components/AssignPanel";

import incidentService from "../services/incidentService";

export default function IncidentDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [incident, setIncident] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  usePageTitle(incident?.title);

  const fetchIncident = useCallback(async () => {
    try {
      setLoading(true);
      const data = await incidentService.getById(id);
      const location = (data.latitude && data.longitude)
        ? { latlng: { lat: data.latitude, lng: data.longitude }, address: data.address ?? "" }
        : null;
      setIncident({
        ...data,
        date:   new Date(data.date ?? data.created_at),
        location,
        author: { username: data.reporter_username ?? 'Usuario', avatar: null },
      });
    } catch (err) {
      setError("No se pudo cargar el incidente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchIncident(); }, [fetchIncident]);

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
            <IncidentPhoto photo={mediaUrl(incident.photos?.[0]?.image)} name={incident.title} />
          </div>

          {/* Info + acciones */}
          <div className="flex-1 flex flex-col gap-6">
            <IncidentInfo
              name={incident.title}
              location={incident.location}
              description={incident.description}
              priority={incident.priority}
              status={incident.status}
              category={incident.category}
              date={incident.date}
              author={incident.author}
              assignedTo={incident.assigned_to ?? null}
            />
            <IncidentActions
              incidentId={incident.id}
              initialVoted={incident.is_voted ?? false}
              initialSubscribed={incident.is_subscribed ?? false}
              initialVotes={incident.vote_count ?? 0}
            />
            {user?.role === 'admin' && (
              <AssignPanel
                incidentId={incident.id}
                workOrder={incident.work_order ?? null}
                onAssigned={fetchIncident}
              />
            )}
          </div>

        </div>

        <div className="w-full h-px bg-gray-200 mb-0" />

        <IncidentComments incidentId={incident.id} />

      </main>

      <Footer />
    </div>
  );
}