import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // Si no hay sesión → redirigir a login
  if (!user) return <Navigate to="/login" replace />;

  // Rutas exclusivas de admin/secretaria
  if (requireAdmin) {
    if (userRole !== "administrador" && userRole !== "secretaria" && userRole !== "cliente") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};
