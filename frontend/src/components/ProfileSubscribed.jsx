import CardGrid from "./CardGrid";

export default function ProfileSubscribed({ incidents }) {
  return (
    <div className="bg-white p-0 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">
        Incidentes a los que estoy suscrito
        <span className="ml-2 text-gray-400 font-normal normal-case">({incidents.length})</span>
      </h2>

      {incidents.length === 0
        ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm text-gray-400">Todavía no te has suscrito a ningún incidente.</p>
          </div>
        )
        : <CardGrid incidents={incidents}  isCompact />
      }
    </div>
  );
}