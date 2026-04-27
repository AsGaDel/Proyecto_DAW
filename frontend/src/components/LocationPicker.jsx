import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix del icono por defecto de Leaflet que se rompe con Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon   from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

// ─── Componente interno que escucha clicks en el mapa ────────────────────────

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function LocationPicker({ value, onChange }) {
    // Posición inicial del mapa: Santa Cruz de Tenerife por defecto
  const defaultCenter = [28.4636, -16.2518];

  const [open,    setOpen]    = useState(false);
  const [marker,  setMarker]  = useState(value?.latlng ?? null);
  const [address, setAddress] = useState(value?.address ?? "");
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Geocodificación inversa con Nominatim (OpenStreetMap, gratuito, sin API key)
  const reverseGeocode = async (latlng) => {
    setLoading(true);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      const data = await res.json();
      return data.display_name ?? `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
    } catch {
      return `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (latlng) => {
    setMarker(latlng);
    const addr = await reverseGeocode(latlng);
    setAddress(addr);
  };

  const handleConfirm = () => {
    if (!marker) return;
    onChange({ latlng: marker, address });
    setOpen(false);
  };

  const handleClear = () => {
    setMarker(null);
    setAddress("");
    onChange(null);
  };


  const handleOpen = () => {
  setOpen(true);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // Si el usuario deniega el permiso o falla, se queda con defaultCenter
        setMapCenter(defaultCenter);
      }
    );
  }
};




  return (
    <div>
      {/* Campo de ubicación */}
      <div
        onClick={handleOpen}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm cursor-pointer flex items-center gap-2 hover:border-blue-400 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0114 0C19 13.5 12 21 12 21z" />
          <circle cx="12" cy="8.5" r="2.5" fill="currentColor" stroke="none" />
        </svg>
        {address
          ? <span className="text-gray-700 dark:text-gray-200 truncate">{address}</span>
          : <span className="text-gray-400">Haz clic para seleccionar en el mapa</span>
        }
        {address && (
          <button
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Modal con el mapa */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden">

            {/* Cabecera */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Seleccionar ubicación</h3>
                <p className="text-xs text-gray-400 mt-0.5">Haz clic en el mapa para marcar el incidente</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mapa */}
            <div className="h-96 w-full">
              <MapContainer
                center={marker ? [marker.lat, marker.lng] : mapCenter}
                zoom={13}
                key={open ? "open" : "closed"}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {marker && <Marker position={marker} />}
              </MapContainer>
            </div>

            {/* Dirección detectada + botón confirmar */}
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                {loading
                  ? <p className="text-xs text-gray-400">Obteniendo dirección...</p>
                  : address
                    ? <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{address}</p>
                    : <p className="text-xs text-gray-400">Ninguna ubicación seleccionada</p>
                }
              </div>
              <button
                onClick={handleConfirm}
                disabled={!marker || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Confirmar ubicación
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}