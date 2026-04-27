import Navbar          from "../components/Navbar";
import Footer          from "../components/Footer";
import IncidentPhoto   from "../components/IncidentPhoto";
import IncidentInfo    from "../components/IncidentInfo";
import IncidentActions from "../components/IncidentActions";
import IncidentComments from "../components/IncidentComments";

// Dato de ejemplo — cuando el backend esté listo, obtén el incidente por id
// con useParams() + useEffect: const { id } = useParams();
const sampleIncident = {
  id:          1,
  name:        "Bache en la calle",
  location: {
    address: "Calle Mayor, 12 — Sevilla",
    latlng: { lat: 37.3886, lng: -5.9823 }
  },
  description: "Bache de gran tamaño localizado en el carril derecho de la calzada. Supone un peligro para los vehículos y especialmente para los ciclistas. Ha sido reportado en varias ocasiones sin que se haya tomado ninguna medida hasta la fecha.",
  priority:    "Moderado",
  photo:       "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",
  date:        new Date("2026-04-13T08:00:00"),
  author:      { username: "carlos_m", avatar: null },
};

export default function IncidentDetails() {
  const incident = sampleIncident;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8">

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
              date={incident.date}
              author={incident.author}
            />
            <IncidentActions incidentId={incident.id} />
          </div>

        </div>

        {/* Separador visual con barra roja como en el wireframe */}
        <div className="w-full h-px bg-gray-200 mb-0" />

        {/* Comentarios */}
        <IncidentComments incidentId={incident.id} />

      </main>

      <Footer />
    </div>
  );
}