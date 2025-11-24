import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Página para gestionar rutas
 * Accesible para: administrador y secretaria
 */
const Rutas = () => {
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
  const rutas = [
    {
      id: 1,
      origen: "Ábrego",
      destino: "Ocaña",
      distancia: "45 km",
      duracion: "1h 15min",
      precio: "$25.000",
      frecuencia: "Cada 2 horas"
    },
    {
      id: 2,
      origen: "Ocaña",
      destino: "Cúcuta",
      distancia: "120 km",
      duracion: "2h 30min",
      precio: "$45.000",
      frecuencia: "Cada 3 horas"
    },
    {
      id: 3,
      origen: "Ábrego",
      destino: "Bucaramanga",
      distancia: "180 km",
      duracion: "3h 45min",
      precio: "$65.000",
      frecuencia: "Cada 4 horas"
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
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gestión de Rutas</CardTitle>
                  <CardDescription>Administre las rutas intermunicipales</CardDescription>
                </div>
              </div>
              <Button variant="brand">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Ruta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rutas.map((ruta) => (
                <Card key={ruta.id} className="hover:shadow-md transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Origen y Destino */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <p className="font-semibold">{ruta.origen}</p>
                        </div>
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        <div className="text-center">
                          <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <p className="font-semibold">{ruta.destino}</p>
                        </div>
                      </div>

                      {/* Información de la Ruta */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Distancia</p>
                          <p className="font-medium">{ruta.distancia}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duración</p>
                          <p className="font-medium">{ruta.duracion}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Precio</p>
                          <p className="font-medium text-primary">{ruta.precio}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frecuencia</p>
                          <p className="font-medium">{ruta.frecuencia}</p>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Ver Horarios
                        </Button>
                        <Button size="sm" variant="ghost">
                          Editar
                        </Button>
                      </div>
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

export default Rutas;
