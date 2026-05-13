import { useState } from "react";
import { Dropdown, DropdownItem } from "./Dropdown";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContainer";
import ShareModal from "./ShareModal";

import incidentService from "../services/incidentService";

export default function IncidentCard({ id, name, photo, priority, status, category, date, author, userVoted = false, userSubscribed = false, onVote, onSubscribe }) {
  const [voted,      setVoted]      = useState(userVoted);
  const [subscribed, setSubscribed] = useState(userSubscribed);
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
    <div  onClick={() => navigate(`/incident/${id}`)} className="bg-white border border-gray-100 shadow-sm 
      rounded-lg overflow-hidden lg:hover:shadow-md lg:hover:border-gray-300 duration-200 active:scale-[0.99] lg:active:border-blue-400 transition-all 
      cursor-pointer group">

      {/* Cabecera: autor + opciones */}
      <div className="bg-white px-3 py-2 flex items-center justify-between border-b border-gray-100">
        <div onClick={(e) => { e.stopPropagation(); navigate(`/profile/${username}`); }} className="flex items-center gap-2">
          {avatar
            ? <img src={avatar} alt={username} className="w-7 h-7 rounded-full object-cover" />
            : (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
            )
          }
          <span className="text-xs font-medium text-gray-600 hover:text-blue-600 hover:underline cursor-pointer transition-colors">
            {username}
          </span>
        </div>

        <Dropdown trigger={trigger} align="right">
          <ul>
          <DropdownItem
            label={voted ? "Quitar voto" : "Votar"}
            onClick={async () => {
              try {
                await incidentService.vote(id);
                setVoted((prev) => !prev);
                onVote?.(id, !voted);
                toast({ message: voted ? "Voto eliminado." : "Has votado este incidente.", type: "info" });
              } catch (err) {
                toast({ message: "Error al votar.", type: "error" });
              }
            }}
          />
          <DropdownItem
            label={subscribed ? "Desuscribirse" : "Suscribirse"}
            onClick={async () => {
              try {
                await incidentService.subscribe(id);
                setSubscribed((prev) => !prev);
                onSubscribe?.(id, !subscribed);
                toast({ message: subscribed ? "Te has desuscrito." : "Te has suscrito.", type: "success" });
              } catch (err) {
                toast({ message: "Error al suscribirse.", type: "error" });
              }
            }}
          />
            <DropdownItem label="Compartir" onClick={() => setShareOpen(true)} />
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
            ? <span className="bg-green-700  text-green-50  bg-opacity-80 inline-block text-sm font-bold px-1 rounded-md mb-2 mr-1">{priority}</span>
            : priority === "Moderado"
            ? <span className="bg-yellow-600 text-yellow-50 opacity-80     inline-block text-sm font-bold px-1 rounded-md mb-2 mr-1">{priority}</span>
            : priority === "Crítico"
            ? <span className="bg-red-700    text-red-50    bg-opacity-80 inline-block text-sm font-bold px-1 rounded-md mb-2 mr-1">{priority}</span>
            : <span className="bg-black      text-red-50    bg-opacity-80 inline-block text-sm font-bold px-1 rounded-md mb-2 mr-1">{priority}</span>
          }
          <span className="text-gray-500 inline-block text-sm font-bold  mb-2">{category}</span>

        </div>
        
        <div>
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">{name}</span>
          <span> - </span>
          {status === "Pendiente"
            ? <span className="text-slate-500 inline-block text-xs  mb-2 ml-1">{status}</span>
            : status === "En proceso"
            ? <span className="text-orange-500 inline-block text-xs  mb-2 ml-1">{status}</span>
            : status === "Finalizado"
            ? <span className="text-teal-500 inline-block text-xs mb-2 ml-1">{status}</span>
            : <span className="text-black inline-block text-xs  mb-2 ml-1">{status}</span>
          }
          </div>
        <div className="text-xs font-medium text-gray-700 tracking-wide">{new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date)}</div>
      </div>

          {shareOpen && (
            <ShareModal
              url={`${window.location.origin}/incident/${id}`}
              onClose={(e) => { e?.stopPropagation(); setShareOpen(false); }}
            />
          )}

    </div>
  );
}