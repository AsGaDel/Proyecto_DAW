import { useRef } from "react";

export default function ProfileAvatar({ username, avatar, onAvatarChange }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onAvatarChange?.(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-24 h-24 rounded-full cursor-pointer group"
      >
        {avatar
          ? <img src={avatar} alt={username} className="w-full h-full rounded-full object-cover" />
          : (
            <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {username?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )
        }
        {/* Overlay al hacer hover */}
        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg" onChange={handleFile} className="hidden" />

    <p className="text-xs text-gray-400">Haz clic para cambiar la foto</p>
    </div>
  );
}