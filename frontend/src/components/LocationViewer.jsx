import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon   from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

export default function LocationViewer({ location }) {
  const [open, setOpen] = useState(false);

  if (!location) return (
    <span className="text-gray-400 text-sm">Sin ubicación</span>
  );

  const { latlng, address } = location;
  const position = [latlng.lat, latlng.lng];

  return (
    <>
      {/* Fila de ubicación clicable */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors group text-left"
      >
        <svg className="w-4 h-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0114 0C19 13.5 12 21 12 21z" />
          <circle cx="12" cy="8.5" r="2.5" fill="currentColor" stroke="none" />
        </svg>
        <span className="group-hover:underline">{address}</span>
        <svg className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>

      {/* Modal con el mapa — solo lectura */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden">

            {/* Cabecera */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Ubicación del incidente</h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{address}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mapa solo lectura */}
            <div className="h-96 w-full">
              <MapContainer
                center={position}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                dragging={true}
                scrollWheelZoom={true}
                zoomControl={true}
                doubleClickZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
              </MapContainer>
            </div>

            {/* Pie con enlace a Google Maps */}
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-400 truncate flex-1 mr-4">{address}</p>
              <a href={`https://www.google.com/maps?q=${latlng.lat},${latlng.lng}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-xs text-blue-600 hover:underline font-medium shrink-0">
                Abrir en Google Maps ↗
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}