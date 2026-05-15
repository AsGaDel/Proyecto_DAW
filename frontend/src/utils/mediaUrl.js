/**
 * Convierte una URL absoluta de media del backend (http://backend:8000/media/...)
 * a una ruta relativa (/media/...) para que el proxy de Vite la sirva.
 */
export function mediaUrl(url) {
  if (!url) return null;
  try {
    const { pathname } = new URL(url);
    return pathname;
  } catch {
    return url;
  }
}
