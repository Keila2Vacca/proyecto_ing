import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * @param {ReactNode} children - Contenido a renderizar si está autenticado
 * @param {boolean} requireAdmin - Si requiere acceso administrativo (admin o secretaria)
 */
export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, userRole, loading, hasAdminAccess } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando autenticación...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir a dashboard si requiere admin y no tiene acceso
  if (requireAdmin && !hasAdminAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
