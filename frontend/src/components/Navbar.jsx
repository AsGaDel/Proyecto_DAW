import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
 
export default function Navbar({ appName = "ARIT"}) {
  const [hasNotifications] = useState(true);
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll) {
        // Bajando
        setShow(false);
      } else {
        // Subiendo
        setShow(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);


  return (
    <header className={`sticky top-0 z-[90] bg-gray-800 text-white flex items-center justify-between px-8 sm:px-16 lg:px-24 py-4 shadow-md transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"}`}>
      {/* Logo / nombre */}
      <a href="/dashboard" className="text-2xl font-black tracking-widest text-blue-500">
        {appName}
      </a>
 
      {/* Acciones */}
      <div className="flex items-center gap-8">
        {/* Notificaciones */}
        <button className="relative bg-gray-700 md:hover:bg-gray-600 text-xs font-semibold px-3 py-1.5 rounded transition-colors">
          <svg className="w-4 h-4 text-white inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
          )}
        </button>
        {/* Perfil */}
        <ProfileDropdown />

      </div>
    </header>
  );
}
 