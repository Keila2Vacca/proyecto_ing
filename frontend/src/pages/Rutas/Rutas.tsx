import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const Rutas = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [rutas, setRutas] = useState<any[]>([]);
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
    const fetchRutas = async () => {
      const { data, error } = await supabase.rpc("get_rutas");

      if (error) {
        toast.error("Error al cargar rutas");
        console.error(error);
      } else {
        const rutasConExtras = data.map((ruta) => ({
          ...ruta,
          distancia: "32 km",
          duracion: "53 min",
          frecuencia: "Cada 1-2 horas",
        }));
        setRutas(rutasConExtras);
      }
    };

    fetchRutas();
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
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
              <Button variant="brand" onClick={() => navigate("/rutas/nuevor")}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Ruta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rutas.map((ruta) => (
                <Card key={ruta.id_rute} className="hover:shadow-md transition-smooth">
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
                          <p className="font-medium text-primary">${ruta.price}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frecuencia</p>
                          <p className="font-medium">{ruta.frecuencia}</p>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setExpanded(expanded === ruta.id_rute ? null : ruta.id_rute)
                          }
                        >
                          {expanded === ruta.id_rute ? "Ocultar Detalles" : "Ver Detalles"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/rutas/editarr/${ruta.id_rute}`)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            const confirm = window.confirm(
                              `¿Eliminar la ruta ${ruta.origen} → ${ruta.destino}?`
                            );
                            if (!confirm) return;

                            const { error } = await supabase
                              .from("rute")
                              .delete()
                              .eq("id_rute", ruta.id_rute);

                            if (error) {
                              toast.error("Error al eliminar ruta");
                              console.error(error);
                            } else {
                              toast.success("Ruta eliminada");
                              setRutas((prev) =>
                                prev.filter((r) => r.id_rute !== ruta.id_rute)
                              );
                            }
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>

                    {/* Detalles desplegables */}
                    {expanded === ruta.id_rute && (
                      <div className="mt-4 space-y-2 border-t pt-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Creado:</span>
                          <span className="font-medium">
                            {new Date(ruta.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Última actualización:</span>
                          <span className="font-medium">
                            {new Date(ruta.updated_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
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
