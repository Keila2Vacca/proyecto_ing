import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Pasajeros = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [passenger, setPassenger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

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
    const fetchPassenger = async () => {
      const { data, error } = await supabase
        .from("passenger")
        .select("*")
        .order("name_1", { ascending: true });

      if (error) {
        toast.error("Error al cargar pasajeros");
        console.error(error);
      } else {
        setPassenger(data);
      }

      setLoading(false);
    };

    fetchPassenger();
  }, []);

  const filteredPassenger = passenger.filter((p) => {
    const fullName = `${p.name_1} ${p.name_2 || ""} ${p.last_name_1} ${p.last_name_2 || ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      p.document_passenger.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard">
              <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
            </Link>
            <div className="flex items-center gap-2">
              <AccessibilityControls  />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Gestión de Pasajeros</CardTitle>
                <CardDescription>Administre la información de los pasajeros</CardDescription>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="brand" onClick={() => navigate("/pasajeros/nuevo")}>
                <Users className="mr-2 h-4 w-4" />
                Nuevo Pasajero
              </Button>
            </div>

            {/* Lista de Pasajeros */}
            <div className="space-y-3">
              {loading ? (
                <p className="text-muted-foreground">Cargando pasajeros...</p>
              ) : filteredPassenger.length === 0 ? (
                <p className="text-muted-foreground">No hay pasajeros registrados.</p>
              ) : (
                filteredPassenger.map((pasajero) => (
                  <Card key={pasajero.document_passenger} className="hover:shadow-md transition-smooth">
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">
                            {pasajero.name_1} {pasajero.name_2} {pasajero.last_name_1} {pasajero.last_name_2}
                          </h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Doc: {pasajero.document_passenger}</span>
                            <span>Tel: {pasajero.phone}</span>
                            <span>Fecha Nac: {pasajero.birthdate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setExpandedDoc(
                                expandedDoc === pasajero.document_passenger ? null : pasajero.document_passenger
                              )
                            }
                          >
                            {expandedDoc === pasajero.document_passenger ? "Ocultar" : "Ver Detalles"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/pasajeros/editar/${pasajero.document_passenger}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              const confirm = window.confirm("¿Está seguro de que desea eliminar este pasajero?");
                              if (!confirm) return;

                              const { error } = await supabase
                                .from("passenger")
                                .delete()
                                .eq("document_passenger", pasajero.document_passenger);

                              if (error) {
                                toast.error("Error al eliminar pasajero");
                                console.error(error);
                              } else {
                                toast.success("Pasajero eliminado");
                                setPassenger((prev) =>
                                  prev.filter((p) => p.document_passenger !== pasajero.document_passenger)
                                );
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>

                      {/* Detalles desplegables */}
                      {expandedDoc === pasajero.document_passenger && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>Género: {pasajero.gender === "M" ? "Masculino" : pasajero.gender === "F" ? "Femenino" : "No especificado"}</p>
                          <p>Creado: {new Date(pasajero.created_at).toLocaleDateString("es-CO")}</p>
                          <p>Actualizado: {new Date(pasajero.updated_at).toLocaleDateString("es-CO")}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pasajeros;
