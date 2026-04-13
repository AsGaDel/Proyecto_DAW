import { Dropdown, DropdownItem } from "./Dropdown";

export default function ProfileDropdown() {
  function logout() {
    /* localStorage.removeItem("token"); */
    window.location.href = "/login";
  }

  const trigger = (
    <div className="w-9 h-9 rounded-full flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#E5E7EB" />
        <circle cx="50" cy="38" r="18" fill="#9CA3AF" />
        <path d="M25 80c0-14 10-24 25-24s25 10 25 24" fill="#9CA3AF" />
      </svg>
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="right">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-900">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Edwar G.</p>
        <p className="text-xs text-gray-400">edwargg@arit.com</p>
      </div>
      <ul>
        <DropdownItem label="Ver perfil"    onClick={() => {}} />
        <DropdownItem label="Configuración" onClick={() => {}} />
        <DropdownItem label="Cerrar sesión" onClick={logout} danger />
      </ul>
    </Dropdown>
  );
}