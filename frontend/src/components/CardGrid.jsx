import IncidentCard from "../components/IncidentCard";
 
export default function CardGrid({ incidents }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="font-bold text-gray-500  dark:text-gray-400 uppercase text-md m-2">Incidentes destacados</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} name={incident.name} photo={incident.photo} priority={incident.priority} date={incident.date} />
        ))}
      </div>
    </div>
  );
}