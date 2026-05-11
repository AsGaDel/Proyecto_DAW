import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar from "../components/Navbar";
import CardGrid from "../components/CardGrid";
import ActionButtons from "../components/ActionButtons";
import Footer from "../components/Footer";

const sampleMySubscribed = [
  { id: 1,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 2,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 3,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 4,  name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 5,  name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 6,  name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 7,  name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 8,  name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 9,  name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 10, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 11, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 12, name: "Alcantarilla sin tapa",    photo: null, priority: "Crítico", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 13, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-11T08:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 14, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-09T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 15, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-08T11:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 16, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-07T22:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 17, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-05T09:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 18, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-04T14:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 19, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 20, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "Pendiente", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 21, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 22, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 23, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 24, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 25, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 26, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "Pendiente", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 27, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 28, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 29, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 30, name: "Alcantarilla sin tapa",    photo: null, priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 31, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-11T08:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 32, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-09T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 33, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-08T11:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 34, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-07T22:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 35, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-05T09:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 36, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-04T14:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 37, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 38, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 39, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 40, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 41, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 42, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 43, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 44, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 45, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 46, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 47, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 48, name: "Alcantarilla sin tapa",    photo: null, priority: "Crítico", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 49, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-11T08:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 50, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "En proceso", category: "Infraestructura",  date: new Date("2026-04-09T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 51, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-08T11:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 52, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-07T22:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 53, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-05T09:00:00"), author: { username: "ana_s",     avatar: null } },
  { id: 54, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", status: "En proceso", category: "Infraestructura", date: new Date("2026-04-04T14:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 55, name: "Bache en la calle",        photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",         priority: "Moderado", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-13T08:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 56, name: "Señal de tráfico caída",   photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", priority: "Leve", status: "Pendiente", category: "Infraestructura",  date: new Date("2026-04-12T10:30:00"), author: { username: "laura_g",   avatar: null } },
  { id: 57, name: "Acera en mal estado",      photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", priority: "Moderado", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-13T11:00:00"), author: { username: "carlos_m",  avatar: null } },
  { id: 58, name: "Farola en mal estado",     photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", priority: "Crítico", status: "Finalizado", category: "Infraestructura", date: new Date("2026-04-12T22:00:00"), author: { username: "pedro_r",   avatar: null } },
  { id: 59, name: "Banco roto",               photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", priority: "Leve", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-06T09:00:00"), author: { username: "laura_g",   avatar: null } },
  { id: 60, name: "Alcantarilla sin tapa",    photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", priority: "Crítico", status: "Pendiente", category: "Infraestructura", date: new Date("2026-04-10T14:00:00"), author: { username: "ana_s",     avatar: null } }
];

export default function SubscribedList() {
  const navigate = useNavigate();
  const { user }   = useAuth();
  const actions = getActionsByRole(user?.role, navigate);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  const SUBSCRIBED_PER_PAGE = 36;

  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  const totalPages = Math.ceil(sampleMySubscribed.length / SUBSCRIBED_PER_PAGE);

  const paginatedSubscribed = useMemo(() => {
    const start = (currentPage - 1) * SUBSCRIBED_PER_PAGE;
    return sampleMySubscribed.slice(start, start + SUBSCRIBED_PER_PAGE);
  }, [sampleMySubscribed, currentPage]);


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT"/*  photo={null} */ />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">
              {/* Columna izquierda: incidentes */}
              <section className="bg-gray-100 flex-1 px-4 mb-12 sm:px-8 lg:px-12 py-6 order-2 md:order-1">
                <CardGrid incidents={paginatedSubscribed} title={"Incidentes a los que te has suscrito"}/>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Anterior
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      )
                      .reduce((acc, page, idx, arr) => {
                        if (idx > 0 && page - arr[idx - 1] > 1) {
                          acc.push("...");
                        }
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-xs">...</span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setCurrentPage(item)}
                            className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-colors
                              ${currentPage === item
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                            {item}
                          </button>
                        )
                      )
                    }

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente →
                    </button>
                  </div>
                )}

              </section>
              {/* Columna derecha: acciones — encima en móvil, lateral en desktop */}
              <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1
                lg:sticky lg:top-14 lg:self-start lg:h-fit lg:border-t-0 lg:border-l-0 lg:w-56 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last
                xl:w-64 lg:bg-transparent ">
                <ActionButtons actions={totalActions}/>
              </aside>
            </main>
      <Footer />
    </div>
  );
}


/* import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { userActions, adminActions, workerActions, getActionsByRole } from "../data/actionButtons";

import Navbar        from "../components/Navbar";
import CardGrid      from "../components/CardGrid";
import ActionButtons from "../components/ActionButtons";
import Footer        from "../components/Footer";

import incidentService from "../services/incidentService";

const SUBSCRIBED_PER_PAGE = 36;

export default function SubscribedList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions            = getActionsByRole(user?.role, navigate);
  const totalWorkerActions = [...userActions(navigate), ...workerActions(navigate)];
  const totalAdminActions  = [...userActions(navigate), ...adminActions(navigate)];
  const totalActions       = [...userActions(navigate), ...workerActions(navigate), ...adminActions(navigate)];

  // ── Datos ──
  const [incidents, setIncidents] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Paginación ──
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ── Carga inicial ──
  useEffect(() => {
    const fetchSubscribed = async () => {
      try {
        setLoading(true);
        const data = await incidentService.getSubscribed();
        const parsed = data.map((inc) => ({
          ...inc,
          date:   new Date(inc.date ?? inc.created_at),
          author: inc.author ?? { username: inc.author_username, avatar: inc.author_avatar ?? null },
        }));
        setIncidents(parsed);
      } catch (err) {
        setError("No se pudieron cargar los incidentes suscritos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribed();
  }, []);

  // ── Paginación ──
  const totalPages = Math.ceil(incidents.length / SUBSCRIBED_PER_PAGE);

  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * SUBSCRIBED_PER_PAGE;
    return incidents.slice(start, start + SUBSCRIBED_PER_PAGE);
  }, [incidents, currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 lg:pb-0">
      <Navbar appName="ARIT" />
      <main className="flex flex-col md:flex-row flex-1 md:px-4 lg:px-12 xl:px-24">

        <section className="bg-gray-100 flex-1 px-4 mb-12 sm:px-8 lg:px-12 py-6 order-2 md:order-1">

          {/* Estado de carga y error *//*}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-400">Cargando incidentes suscritos...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {incidents.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0" />
                    </svg>
                    <p className="text-sm text-gray-400">Todavía no te has suscrito a ningún incidente.</p>
                  </div>
                )
                : <CardGrid incidents={paginatedIncidents} title="Incidentes a los que te has suscrito" />
              }

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                    .reduce((acc, page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-xs">...</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setCurrentPage(item)}
                          className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-colors
                            ${currentPage === item
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                          {item}
                        </button>
                      )
                    )
                  }

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}

        </section>

        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-1
          lg:sticky lg:top-14 lg:self-start lg:h-fit lg:border-t-0 lg:border-l-0 lg:w-56 lg:shrink-0 lg:px-0 lg:py-6 lg:order-last
          xl:w-64 lg:bg-transparent">
          <ActionButtons actions={totalActions} />
        </aside>

      </main>
      <Footer />
    </div>
  );
} */