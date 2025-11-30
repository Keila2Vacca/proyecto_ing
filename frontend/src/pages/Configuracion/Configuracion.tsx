import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, User, Bell, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Página de configuración del sistema
 * Accesible para: todos los usuarios autenticados
 */
const Configuracion = () => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

    const configSections = [
    {
        icon: User,
        title: "Perfil de Usuario",
        description: "Actualice su información personal y contraseña",
        path: "/configuracion/editarperfil",
    },
    {
        icon: Bell,
        title: "Notificaciones",
        description: "Configure las notificaciones del sistema",
        path: "/configuracion/notificaciones",
    },
    {
        icon: Shield,
        title: "Seguridad",
        description: "Gestione la seguridad de su cuenta",
        path: "/configuracion/seguridad",
    },

  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card className="shadow-md mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Configuración</CardTitle>
                <CardDescription>Administre las preferencias del sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Información del Usuario */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user?.email}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      Rol: {userRole || 'Cliente'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secciones de Configuración */}
            <div className="space-y-3">
             {configSections.map((section, index) => (
                <Card
                    key={index}
                    className="hover:shadow-md transition-smooth cursor-pointer"
                    onClick={() => navigate(section.path)}
                >
                    <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div>
                        <h4 className="font-semibold">{section.title}</h4>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        Configurar
                    </Button>
                    </CardContent>
                </Card>
                ))}

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracion;
