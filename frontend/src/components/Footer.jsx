export default function Footer() {
  const year = new Date().getFullYear();
 
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
 
        {/* Izquierda: logo */}
        <div className="flex items-center gap-3">
          {/* TODO: sustituye esto por tu logo */}
          <div className="w-32 h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180">
                <rect width="110" height="80" x="30" y="50" fill="#c00" rx="28" ry="28" />
                <rect width="10" height="64" x="80" y="58" fill="#fff" rx="4" />
                <text x="158" y="110" fill="#111" fontFamily="Arial Black, Arial, sans-serif" fontSize="62" fontWeight="900" letterSpacing="-1">mni-Tech</text>
                <rect width="302" height="5" x="158" y="122" fill="#c00" rx="2" />
            </svg>
          </div>
          <span className="text-sm font-black text-blue-700 tracking-wide">ARIT</span>
        </div>
 
        {/* Centro: links */}
        <nav className="flex items-center gap-5">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Aviso legal</a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacidad</a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Contacto</a>
        </nav>
 
        {/* Derecha: copyright */}
        <p className="text-xs text-gray-400">
          © {year} Omni-Tech. Todos los derechos reservados.
        </p>
 
      </div>
    </footer>
  );
}