import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const Conductores = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [conductores, setConductores] = useState<any[]>([]);
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
    const fetchConductores = async () => {
      const { data, error } = await supabase
        .from("employee")
        .select("epe_code, document_employee, name_1, name_2, last_name_1, last_name_2, phone, dvr_license, date_license, created_at, updated_at")
        .eq("type_employee", "D"); // solo conductores

      if (error) {
        toast.error("Error al cargar conductores");
        console.error(error);
      } else {
        setConductores(data || []);
      }
      setLoading(false);
    };

    fetchConductores();
  }, []);

  const getEstadoColor = (license: string | null) => {
    return license ? "bg-green-500/20 text-green-700 dark:text-green-300" : "bg-red-500/20 text-red-700 dark:text-red-300";
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
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gestión de Conductores</CardTitle>
                  <CardDescription>Administre los conductores registrados</CardDescription>
                </div>
              </div>
              <Button variant="brand" onClick={() => navigate("/conductores/nuevoc")}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Conductor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Cargando conductores...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conductores.map((c) => {
                  const nombreCompleto = `${c.name_1} ${c.name_2 ?? ""} ${c.last_name_1} ${c.last_name_2 ?? ""}`.trim();
                  return (
                    <Card key={c.epe_code} className="hover:shadow-lg transition-smooth">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{nombreCompleto}</CardTitle>
                          </div>
                          <Badge className={getEstadoColor(c.dvr_license)}>
                            {c.dvr_license ? "Licencia válida" : "Sin licencia"}
                          </Badge>
                        </div>
                        <CardDescription>Código: {c.epe_code}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Teléfono:</span>
                          <span className="font-medium">{c.phone}</span>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2 pt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              setExpanded(expanded === c.epe_code ? null : c.epe_code)
                            }
                          >
                            {expanded === c.epe_code ? "Ocultar Detalles" : "Ver Detalles"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/conductores/editarc/${c.epe_code}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              const confirm = window.confirm(
                                `¿Está seguro de que desea eliminar al conductor ${nombreCompleto}?`
                              );
                              if (!confirm) return;

                              const { error } = await supabase
                                .from("employee")
                                .delete()
                                .eq("epe_code", c.epe_code);

                              if (error) {
                                toast.error("Error al eliminar conductor");
                                console.error(error);
                              } else {
                                toast.success("Conductor eliminado");
                                setConductores((prev) =>
                                  prev.filter((d) => d.epe_code !== c.epe_code)
                                );
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>

                        {/* Detalles desplegables */}
                        {expanded === c.epe_code && (
                          <div className="mt-4 space-y-2 border-t pt-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Documento:</span>
                              <span className="font-medium">{c.document_employee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Licencia:</span>
                              <span className="font-medium">{c.dvr_license ?? "No registrada"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fecha licencia:</span>
                              <span className="font-medium">{c.date_license ?? "No registrada"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Creado:</span>
                              <span className="font-medium">{new Date(c.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Última actualización:</span>
                              <span className="font-medium">{new Date(c.updated_at).toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Conductores;
