import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const Viajes = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [trips, setTrips] = useState<any[]>([]);
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
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("trip")
        .select(`
          id_trip,
          date,
          departure_time,
          created_at,
          updated_at,
          state_trip (
            name
          ),
          rute (
            id_rute
          ),
          vehicle (
            plate
          ),
          employee (
            epe_code,
            name_1,
            name_2,
            last_name_1,
            last_name_2,
            type_employee
          )
        `);

      if (error) {
        toast.error("Error al cargar viajes");
        console.error(error);
      } else {
        setTrips(data);
      }
      setLoading(false);
    };

    fetchTrips();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Programado":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
      case "En Ruta":
        return "bg-green-500/20 text-green-700 dark:text-green-300";
      case "Finalizado":
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
      default:
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300";
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
            <AccessibilityControls />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
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
                  <CalendarDays className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gestión de Viajes</CardTitle>
                  <CardDescription>Administre los viajes programados</CardDescription>
                </div>
              </div>
              <Button variant="brand" onClick={() => navigate("/viajes/nuevovi")}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Viaje
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Cargando viajes...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <Card key={trip.id_trip} className="hover:shadow-lg transition-smooth">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Viaje {trip.id_trip}</CardTitle>
                        </div>
                        <Badge className={getEstadoColor(trip.state_trip?.name)}>
                          {trip.state_trip?.name}
                        </Badge>
                      </div>
                      <CardDescription>
                        Vehículo: {trip.vehicle?.plate} |  Conductor: {trip.employee?.type_employee === "D"
    ? `${trip.employee?.name_1} ${trip.employee?.name_2 ?? ""} ${trip.employee?.last_name_1} ${trip.employee?.last_name_2 ?? ""}`.trim()
    : "No asignado"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="font-medium">{trip.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hora salida:</span>
                        <span className="font-medium">{trip.departure_time}</span>
                      </div>

                      {/* Botones */}
                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            setExpanded(expanded === trip.id_trip ? null : trip.id_trip)
                          }
                        >
                          {expanded === trip.id_trip ? "Ocultar Detalles" : "Ver Detalles"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/viajes/editarvi/${trip.id_trip}`)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            const confirm = window.confirm(
                              `¿Está seguro de que desea eliminar el viaje ${trip.id_trip}?`
                            );
                            if (!confirm) return;

                            const { error } = await supabase
                              .from("trip")
                              .delete()
                              .eq("id_trip", trip.id_trip);

                            if (error) {
                              toast.error("Error al eliminar viaje");
                              console.error(error);
                            } else {
                              toast.success("Viaje eliminado");
                              setTrips((prev) =>
                                prev.filter((t) => t.id_trip !== trip.id_trip)
                              );
                            }
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>

                      {/* Detalles desplegables */}
                      {expanded === trip.id_trip && (
                        <div className="mt-4 space-y-2 border-t pt-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ruta:</span>
                            <span className="font-medium">{trip.rute?.id_rute}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Creado:</span>
                            <span className="font-medium">
                              {new Date(trip.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Última actualización:</span>
                            <span className="font-medium">
                              {new Date(trip.updated_at).toLocaleString()}
                            </span>
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

export default Viajes;
