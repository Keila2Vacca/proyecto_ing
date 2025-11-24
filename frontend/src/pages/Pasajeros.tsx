import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Página para gestionar pasajeros
 * Accesible para: administrador y secretaria
 */
const Pasajeros = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  // Datos de ejemplo
  const pasajeros = [
    { id: 1, nombre: "Juan Pérez", documento: "1234567890", telefono: "3001234567", viajes: 5 },
    { id: 2, nombre: "María García", documento: "0987654321", telefono: "3109876543", viajes: 3 },
    { id: 3, nombre: "Carlos López", documento: "5647382910", telefono: "3205647382", viajes: 8 },
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

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gestión de Pasajeros</CardTitle>
                  <CardDescription>Administre la información de los pasajeros</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buscador */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o documento..."
                  className="pl-10"
                />
              </div>
              <Button variant="brand">
                <Users className="mr-2 h-4 w-4" />
                Nuevo Pasajero
              </Button>
            </div>

            {/* Lista de Pasajeros */}
            <div className="space-y-3">
              {pasajeros.map((pasajero) => (
                <Card key={pasajero.id} className="hover:shadow-md transition-smooth">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{pasajero.nombre}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Doc: {pasajero.documento}</span>
                        <span>Tel: {pasajero.telefono}</span>
                        <span>Viajes: {pasajero.viajes}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                      <Button size="sm" variant="ghost">Editar</Button>
                    </div>
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

export default Pasajeros;
