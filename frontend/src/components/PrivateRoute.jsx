import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── PrivateRoute ─────────────────────────────────────────────────────────────
// Protege rutas que requieren autenticación.
// Si el usuario no está autenticado redirige al login.
// Si está autenticado pero no tiene el rol requerido redirige al dashboard.

export default function PrivateRoute({ children, roles = [] }) {
  const { user } = useAuth();

  // No autenticado → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rol no permitido → dashboard
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}