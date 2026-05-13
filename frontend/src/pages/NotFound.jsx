import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("No encontrado");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar appName="ARIT" />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">

          {/* Número 404 */}
          <div className="relative mb-6">
            <p className="text-[120px] font-black text-gray-200 leading-none select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Página no encontrada
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <p className="text-sm text-gray-500 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              ← Volver atrás
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Ir al inicio
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}