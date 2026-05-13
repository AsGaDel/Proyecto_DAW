import { useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem } from "./Dropdown";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function ProfileDropdown() {
  const navigate                        = useNavigate();
  const { user, logout: contextLogout } = useAuth();

  const logout = () => {
    authService.logout();
    contextLogout();
    navigate("/login");
  };

  // Ajusta los campos según lo que devuelva tu backend en el JWT o en getMe()
  const displayName = user?.full_name ?? user?.fullName ?? user?.username ?? "Usuario";
  const email       = user?.email ?? "";
  const avatar      = user?.avatar ?? null;

  const trigger = (
    <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
      {avatar
        ? <img src={avatar} alt={displayName} className="w-full h-full object-cover rounded-full" />
        : (
          <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#E5E7EB" />
            <circle cx="50" cy="38" r="18" fill="#9CA3AF" />
            <path d="M25 80c0-14 10-24 25-24s25 10 25 24" fill="#9CA3AF" />
          </svg>
        )
      }
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="right">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-800">{displayName}</p>
        {email && <p className="text-xs text-gray-400">{email}</p>}
      </div>
      <ul>
        <DropdownItem label="Ver perfil"    onClick={() => navigate("/profile")} />
        <DropdownItem label="Cerrar sesión" onClick={logout} danger />
      </ul>
    </Dropdown>
  );
}