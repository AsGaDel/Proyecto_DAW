import { useState, useEffect } from "react";

export default function IncidentPhoto({ photo, name }) {
  const [imagenActiva, setImagenActiva] = useState(null);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    if (imagenActiva) {
      setTimeout(() => setAnimar(true), 10);
    } else {
      setAnimar(false);
    }
  }, [imagenActiva]);

  return (
    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-300 shrink-0">
      {photo
        ? <img src={photo} alt={name} onClick={() => setImagenActiva(photo)} className="w-full h-full object-cover cursor-pointer" />
        : <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">Sin foto</span>
          </div>
      }

      {imagenActiva && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setImagenActiva(null)}>
          <img src={imagenActiva} alt={name} className={`max-w-[90%] max-h-[90%] rounded-xl shadow-2xl transition-all duration-200 ease-out ${animar ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}/>
        </div>
      )}

    </div>
  );
}