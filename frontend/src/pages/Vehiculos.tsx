import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Página para gestionar vehículos
 * Accesible para: administrador y secretaria
 */
const Vehiculos = () => {
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
  const vehiculos = [
    {
      id: 1,
      placa: "ABC-123",
      modelo: "Mercedes-Benz Sprinter",
      capacidad: 19,
      estado: "Disponible",
      conductor: "Pedro Ramírez"
    },
    {
      id: 2,
      placa: "XYZ-789",
      modelo: "Toyota Coaster",
      capacidad: 30,
      estado: "En Ruta",
      conductor: "Ana Martínez"
    },
    {
      id: 3,
      placa: "DEF-456",
      modelo: "Chevrolet NPR",
      capacidad: 25,
      estado: "Mantenimiento",
      conductor: "Luis González"
    },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return "bg-green-500/20 text-green-700 dark:text-green-300";
      case "En Ruta":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
      case "Mantenimiento":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
    }
  };

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
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Bus className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gestión de Vehículos</CardTitle>
                  <CardDescription>Administre la flota de vehículos</CardDescription>
                </div>
              </div>
              <Button variant="brand">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Vehículo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehiculos.map((vehiculo) => (
                <Card key={vehiculo.id} className="hover:shadow-lg transition-smooth">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bus className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{vehiculo.placa}</CardTitle>
                      </div>
                      <Badge className={getEstadoColor(vehiculo.estado)}>
                        {vehiculo.estado}
                      </Badge>
                    </div>
                    <CardDescription>{vehiculo.modelo}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacidad:</span>
                      <span className="font-medium">{vehiculo.capacidad} pasajeros</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conductor:</span>
                      <span className="font-medium">{vehiculo.conductor}</span>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver Detalles
                      </Button>
                      <Button size="sm" variant="ghost">
                        Editar
                      </Button>
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

export default Vehiculos;
