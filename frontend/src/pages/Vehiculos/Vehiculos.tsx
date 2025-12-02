import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const Vehiculos = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null); 

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  useEffect(() => {
    const fetchVehiculos = async () => {
      const { data, error } = await supabase
        .from("vehicle")
        .select(`
          plate,
          model,
          capacity,
          created_at,
          updated_at,
          state_vehicle (
            id_state_vehicle,
            name
          )
        `);

      if (error) {
        toast.error("Error al cargar vehículos");
        console.error(error);
      } else {
        setVehiculos(data);
      }
      setLoading(false);
    };

    fetchVehiculos();
  }, []);

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
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link to="/dashboard">
            <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
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
              <Button variant="brand" onClick={() => navigate("/vehiculos/nuevov")}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Vehículo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Cargando vehículos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehiculos.map((vehiculo) => (
                  <Card key={vehiculo.plate} className="hover:shadow-lg transition-smooth">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bus className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{vehiculo.plate}</CardTitle>
                        </div>
                        <Badge className={getEstadoColor(vehiculo.state_vehicle?.name)}>
                          {vehiculo.state_vehicle?.name}
                        </Badge>
                      </div>
                      <CardDescription>{vehiculo.model}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Capacidad:</span>
                        <span className="font-medium">{vehiculo.capacity} pasajeros</span>
                      </div>

                      {/* Botones */}
                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            setExpanded(expanded === vehiculo.plate ? null : vehiculo.plate)
                          }
                        >
                          {expanded === vehiculo.plate ? "Ocultar Detalles" : "Ver Detalles"}
                        </Button>
                        <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/vehiculos/editarv/${vehiculo.plate}`)}
                        >
                        Editar
                        </Button>
                        <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            const confirm = window.confirm(
                            `¿Está seguro de que desea eliminar el vehículo con placa ${vehiculo.plate}?`
                            );
                            if (!confirm) return;

                            const { error } = await supabase
                            .from("vehicle")
                            .delete()
                            .eq("plate", vehiculo.plate);

                            if (error) {
                            toast.error("Error al eliminar vehículo");
                            console.error(error);
                            } else {
                            toast.success("Vehículo eliminado");
                            setVehiculos((prev) =>
                                prev.filter((v) => v.plate !== vehiculo.plate)
                            );
                            }
                        }}
                        >
                        Eliminar
                        </Button>

                      </div>

                      {/* Detalles desplegables */}
                      {expanded === vehiculo.plate && (
                        <div className="mt-4 space-y-2 border-t pt-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estado:</span>
                            <span className="font-medium">{vehiculo.state_vehicle?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Creado:</span>
                            <span className="font-medium">{new Date(vehiculo.created_at).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Última actualización:</span>
                            <span className="font-medium">{new Date(vehiculo.updated_at).toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vehiculos;
