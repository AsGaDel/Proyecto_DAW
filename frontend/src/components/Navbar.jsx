import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown       from "./ProfileDropdown";
import NotificationsDropdown from "./NotificationsDropdown";

const NAV_LINKS = {
  common: [
    { label: "Inicio",      href: "/dashboard" },
    { label: "Incidentes",  href: "/incident-list" },
    { label: "Reportar",    href: "/create-incident" },
  ],
  worker: [
    { label: "Asignados",   href: "/assigned-list" },
  ],
  admin: [
    { label: "Usuarios",    href: "/user-list" },
    { label: "Categorías",  href: "/category-list" },
  ],
};

export default function Navbar({ appName = "ARIT", showNavLinks = false }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useAuth();
  const [show, setShow]             = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const cur = window.scrollY;
      setShow(cur <= lastScroll);
      setLastScroll(cur);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const role  = user?.role;
  const links = [
    ...NAV_LINKS.common,
    ...(role === "worker" || role === "admin" ? NAV_LINKS.worker : []),
    ...(role === "admin" ? NAV_LINKS.admin : []),
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <header className={`sticky top-0 z-[90] bg-gray-800 text-white shadow-md transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 gap-4">

        {/* Logo */}
        <a href="/dashboard" className="text-xl font-black tracking-widest text-blue-400 shrink-0">
          {appName}
        </a>

        {/* Nav links — escritorio */}
        {showNavLinks && (
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {links.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => navigate(href)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${isActive(href)
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        {/* Acciones derecha */}
        <div className="flex items-center gap-3 shrink-0">
          <NotificationsDropdown />
          <ProfileDropdown />

          {/* Hamburger — móvil */}
          {showNavLinks && (
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Menú"
            >
              {menuOpen
                ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          )}
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {showNavLinks && menuOpen && (
        <nav className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {links.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive(href)
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}