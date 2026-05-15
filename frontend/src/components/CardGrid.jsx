import IncidentCard from "../components/IncidentCard";
import { mediaUrl } from "../utils/mediaUrl";

export default function CardGrid({ title, incidents, isCompact = false, onVote, onSubscribe }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="font-bold text-gray-500 uppercase text-md m-2">{title}</div>
      <div className={isCompact
        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
        : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"}>
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} id={incident.id} name={incident.title}
            photo={mediaUrl(incident.photos?.[0]?.image)}
            priority={incident.priority} status={incident.status_display ?? incident.status} category={incident.category}
            date={incident.date}
            author={{ username: incident.reporter_username, avatar: incident.reporter_avatar ?? null }}
            userVoted={incident.is_voted ?? incident.user_voted ?? false}
            userSubscribed={incident.is_subscribed ?? incident.user_subscribed ?? false}
            onVote={onVote} onSubscribe={onSubscribe}
          />
        ))}
      </div>
    </div>
  );
}