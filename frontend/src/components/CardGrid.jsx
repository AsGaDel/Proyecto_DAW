import IncidentCard from "../components/IncidentCard";
 
export default function CardGrid({ title, incidents, isCompact = false }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="font-bold text-gray-500 uppercase text-md m-2">{title}</div>
      <div className={isCompact
        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
        : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"}>
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} name={incident.name} photo={incident.photo} priority={incident.priority} category={incident.category} date={incident.date} author={incident.author}/>
        ))}
      </div>
    </div>
  );
}