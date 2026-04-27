import { useState } from "react";

export default function IncidentActions({ incidentId }) {
  const [voted,      setVoted]      = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [votes,      setVotes]      = useState(0);

  const handleVote = () => {
    setVoted((prev) => !prev);
    setVotes((prev) => (voted ? prev - 1 : prev + 1));
    // TODO: await incidentService.vote(incidentId);
  };

  const handleSubscribe = () => {
    setSubscribed((prev) => !prev);
    // TODO: await incidentService.subscribe(incidentId);
  };

  return (
    <div className="flex items-center gap-3 pt-2">

      {/* Votar */}
      <button
        onClick={handleVote}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150
          ${voted
            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            : "bg-gray-200 text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
          }`}
      >
        <svg className="w-4 h-4" fill={voted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        Votar {votes > 0 && <span className="ml-0.5 text-xs font-bold">({votes})</span>}
      </button>

      {/* Suscribirse */}
      <button
        onClick={handleSubscribe}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150
          ${subscribed
            ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
            : "bg-gray-200 text-gray-700 border-gray-300 hover:border-yellow-400 hover:text-yellow-600"
          }`}
      >

        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d={subscribed
            ? "M5 13l4 4L19 7"
            : "M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.5l7.1-.6L12 2z"
          }/>
        </svg> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={subscribed
              ? "M5 13l4 4L19 7"
              : "M11.245 4.174c.232-.666.347-.999.518-1.091a.5.5 0 0 1 .475 0c.171.092.287.425.518 1.091l1.53 4.402c.066.19.1.285.159.355a.5.5 0 0 0 .195.142c.085.034.185.036.386.04l4.66.096c.705.014 1.057.021 1.198.155a.5.5 0 0 1 .146.452c-.035.191-.315.404-.877.83l-3.714 2.816c-.16.12-.24.181-.289.26a.5.5 0 0 0-.074.229c-.007.092.022.188.08.38l1.35 4.46c.204.676.306 1.013.222 1.188a.5.5 0 0 1-.384.28c-.193.025-.482-.176-1.06-.579l-3.826-2.662c-.165-.114-.247-.172-.337-.194a.5.5 0 0 0-.24 0c-.09.022-.173.08-.337.194L7.718 19.68c-.579.403-.868.604-1.06.578a.5.5 0 0 1-.385-.279c-.084-.175.018-.512.222-1.187l1.35-4.461c.058-.192.087-.288.08-.38a.5.5 0 0 0-.074-.23c-.049-.078-.128-.138-.288-.26l-3.714-2.815c-.562-.426-.843-.639-.878-.83a.5.5 0 0 1 .147-.452c.14-.134.493-.141 1.198-.155l4.66-.095c.2-.005.3-.007.386-.041a.5.5 0 0 0 .195-.142c.059-.07.092-.165.158-.355z"} />
        </svg>
        {/* <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={subscribed
            ? "M5 13l4 4L19 7"
            : "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0"
          } />
        </svg> */}
        {subscribed ? "Suscrito" : "Suscribirse"}
      </button>

    </div>
  );
}