import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const Pasajes = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [pasajes, setPasajes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDetalle, setExpandedDetalle] = useState<string | null>(null);
  const [expandedVenta, setExpandedVenta] = useState<string | null>(null);


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
    const fetchPasajes = async () => {
      const { data, error } = await supabase
      .from("passage")
      .select(`
        consecutivo,
        id_trip,
        purchase_date,
        id_state_passage,
        document_passenger,
        id_sale,
        created_at,
        updated_at,
        state_passage ( name ),
        passenger ( document_passenger, name_1, name_2, last_name_1, last_name_2 ),
        trip ( id_trip ),
        sale ( id_sale, sale_date, quantity_passages, total_amount, payment_method ),
        passage_detail ( line_item, seat_number, price_paid )
      `);


      if (error) {
        toast.error("Error al cargar pasajes");
        console.error(error);
      } else {
        setPasajes(data || []);
      }
      setLoading(false);
    };

    fetchPasajes();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-500/20 text-green-700 dark:text-green-300";
      case "Cancelado":
        return "bg-red-500/20 text-red-700 dark:text-red-300";
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
            <AccessibilityControls/>
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
                  <Ticket className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gestión de Pasajes</CardTitle>
                  <CardDescription>Administre los pasajes registrados</CardDescription>
                </div>
              </div>
              <Button variant="brand" onClick={() => navigate("/reservar")}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Pasaje
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Cargando pasajes...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pasajes.map((p) => {
                  const nombrePasajero = `${p.passenger?.name_1 ?? ""} ${p.passenger?.name_2 ?? ""} ${p.passenger?.last_name_1 ?? ""} ${p.passenger?.last_name_2 ?? ""}`.trim();
                  return (
                    <Card key={`${p.consecutivo}-${p.id_trip}`} className="hover:shadow-lg transition-smooth">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Pasaje {p.consecutivo}</CardTitle>
                          </div>
                          <Badge className={getEstadoColor(p.state_passage?.name)}>
                            {p.state_passage?.name}
                          </Badge>
                        </div>
                        <CardDescription>Pasajero: {nombrePasajero}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Fecha compra:</span>
                          <span className="font-medium">{p.purchase_date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Viaje:</span>
                          <span className="font-medium">{p.trip?.id_trip}</span>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2 pt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              setExpandedDetalle(expandedDetalle === p.consecutivo ? null : p.consecutivo)
                            }
                          >
                            {expandedDetalle === p.consecutivo ? "Ocultar Detalles" : "Ver Detalles"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              setExpandedVenta(expandedVenta === `sale-${p.consecutivo}` ? null : `sale-${p.consecutivo}`)
                            }
                          >
                            {expandedVenta === `sale-${p.consecutivo}` ? "Ocultar Venta" : "Ver Venta"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/pasajes/editarp/${p.consecutivo}/${p.id_trip}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              const confirm = window.confirm(
                                `¿Está seguro de que desea eliminar el pasaje ${p.consecutivo}?`
                              );
                              if (!confirm) return;

                              const { error } = await supabase
                                .from("passage")
                                .delete()
                                .eq("consecutivo", p.consecutivo)
                                .eq("id_trip", p.id_trip);

                              if (error) {
                                toast.error("Error al eliminar pasaje");
                                console.error(error);
                              } else {
                                toast.success("Pasaje eliminado");
                                setPasajes((prev) =>
                                  prev.filter((x) => !(x.consecutivo === p.consecutivo && x.id_trip === p.id_trip))
                                );
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>

                        {/* Detalles desplegables */}
                       {expandedDetalle === p.consecutivo && (
                          <div className="mt-4 space-y-2 border-t pt-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Documento pasajero:</span>
                              <span className="font-medium">{p.document_passenger}</span>
                            </div>

                            {/* Detalles del pasaje */}
                            {p.passage_detail?.map((d: any) => (
                              <div key={d.line_item} className="border rounded p-2 mt-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Línea:</span>
                                  <span className="font-medium">{d.line_item}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Asiento:</span>
                                  <span className="font-medium">{d.seat_number}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Precio pagado:</span>
                                  <span className="font-medium">${d.price_paid}</span>
                                </div>
                              </div>
                            ))}
                            {/* Detalles de la venta */}
                            {expandedVenta === `sale-${p.consecutivo}` && (
                              <div className="mt-4 space-y-2 border-t pt-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">ID Venta:</span>
                                  <span className="font-medium">{p.sale?.id_sale}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Fecha venta:</span>
                                  <span className="font-medium">{p.sale?.sale_date}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Cantidad pasajes:</span>
                                  <span className="font-medium">{p.sale?.quantity_passages}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Total:</span>
                                  <span className="font-medium">${p.sale?.total_amount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Método de pago:</span>
                                  <span className="font-medium">{p.sale?.payment_method}</span>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Creado:</span>
                              <span className="font-medium">{new Date(p.created_at).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Última actualización:</span>
                              <span className="font-medium">{new Date(p.updated_at).toLocaleString()}</span>
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

export default Pasajes;
