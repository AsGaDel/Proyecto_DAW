import { useState } from "react";
import { Dropdown, DropdownItem } from "./Dropdown";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContainer";
import ShareModal from "./ShareModal";


export default function IncidentCard({ name, photo, priority, category, date, author }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [shareOpen, setShareOpen] = useState(false);

  const { username = "User", avatar = null } = author ?? {};

  const trigger = (
    <div className="p-1 rounded-md hover:bg-gray-300 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12"  cy="5" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
      </svg>
    </div>
  );

  return (
    <div  onClick={() => {navigate("/incident-details")}} className="bg-white border border-gray-100 shadow-sm 
      rounded-lg overflow-hidden lg:hover:border-gray-300 duration-200 active:scale-[0.99] lg:active:border-blue-400 transition-all 
      cursor-pointer group">

      {/* Cabecera: autor + opciones */}
      <div className="bg-white px-3 py-2 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          {avatar
            ? <img src={avatar} alt={username} className="w-7 h-7 rounded-full object-cover" />
            : (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
            )
          }
          <span className="text-xs font-medium text-gray-600">{username}</span>
        </div>

        <Dropdown trigger={trigger} align="right">
          <ul>
            <DropdownItem label="Votar" onClick={() => {toast({ message: "Has votado este incidente", type: "info" });
                                                                // TODO: await incidentService.subscribe(incidentId);
                                                              }} />
            <DropdownItem label="Suscribirse" onClick={() => {toast({ message: "Suscrito a este incidente", type: "success" });
                                                                // TODO: await incidentService.subscribe(incidentId);
                                                              }} />
            <DropdownItem label="Compartir"   onClick={() => setShareOpen(true)} />
            <DropdownItem label="Denunciar"    onClick={() => {}} danger />
          </ul>
        </Dropdown>
      </div>

      {/* Foto */}
      <div className="bg-gray-600 group-hover:bg-gray-700 transition-colors aspect-[4/3] flex items-center justify-center">
        {photo
          ? <img src={photo} alt={name} className="w-full h-full object-cover" />
          : <span className="text-white text-lg font-medium opacity-60">No hay foto</span>
        }
      </div>

      {/* Info */}
      <div className="bg-white px-4 py-4">
        <div className="flex flex-row justify-between">
          {priority === "Leve"
            ? <span className="bg-green-800  text-green-50  bg-opacity-80 inline-block text-sm font-bold px-1 rounded-md mb-2">{priority}</span>
            : priority === "Moderado"
            ? <span className="bg-yellow-800 text-yellow-50 opacity-80     inline-block text-sm font-bold px-1 rounded-md mb-2">{priority}</span>
            : priority === "Crítico"
            ? <span className="bg-red-800    text-red-50    bg-opacity-80 inline-block text-sm font-bold px-1 rounded-md mb-2">{priority}</span>
            : <span className="bg-black      text-red-50    bg-opacity-80 inline-block text-sm font-bold px-1 rounded-md mb-2">{priority}</span>
          }
          <span className="text-gray-500 inline-block text-sm font-bold  mb-2">{category}</span>
        </div>
        
        <div className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">{name}</div>
        <div className="text-xs font-medium text-gray-700 tracking-wide">{new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date)}</div>
      </div>

          {shareOpen && (
            <ShareModal
              url="{`${window.location.origin}/incident-details/${id}`}"
              onClose={(e) => { e?.stopPropagation(); setShareOpen(false); }}
            />
          )}

    </div>
  );
}