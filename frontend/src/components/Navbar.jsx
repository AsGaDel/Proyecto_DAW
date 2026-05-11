import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsDropdown from "./NotificationsDropdown";
 
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
        <NotificationsDropdown />
        {/* Perfil */}
        <ProfileDropdown />

      </div>
    </header>
  );
}
 