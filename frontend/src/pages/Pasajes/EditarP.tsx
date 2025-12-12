import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

type EstadoPassage = {
  id_state_passage: string | number;
  name: string;
};

type Sale = {
  id_sale: string | number;
  sale_date: string | null;
  quantity_passages: number | string | null;
  total_amount: number | string | null;
  payment_method: string | null;
};

type PassageDetail = {
  line_item: string | number;
  seat_number: string | number | null;
  price_paid: number | string | null;
};

type Pasaje = {
  consecutivo: string | number;
  id_trip: string | number;
  purchase_date: string | null;
  document_passenger: string | null;
  id_state_passage: string | number | null;
  id_sale: string | number | null;
  created_at: string | null;
  updated_at: string | null;
  state_passage?: { name: string } | null;
  passenger?: {
    document_passenger: string;
    name_1: string | null;
    name_2: string | null;
    last_name_1: string | null;
    last_name_2: string | null;
  } | null;
  trip?: { id_trip: string | number } | null;
  sale?: Sale | null;
  passage_detail?: PassageDetail[] | null;
};

const EditarPasaje = () => {
  const { consecutivo, id_trip } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [pasaje, setPasaje] = useState<Pasaje | null>(null);
  const [estados, setEstados] = useState<EstadoPassage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  // Función para calcular el total basado en la cantidad de pasajes
  const calculateTotal = (quantity: string | number | null, pricePaid: string | number | null) => {
    if (!quantity || quantity === "" || !pricePaid || pricePaid === "") return null;
    
    const qty = Number(quantity);
    const price = Number(pricePaid);
    
    if (isNaN(qty) || isNaN(price)) return null;
    
    return (qty * price).toFixed(2);
  };

  // Función para manejar el cambio en la cantidad de pasajes
  const handleQuantityChange = (quantity: string | number | null) => {
    if (!pasaje || !pasaje.sale) return;
    
    // Calcular el nuevo total basado en el precio pagado del primer detalle
    const pricePaid = pasaje.passage_detail?.[0]?.price_paid;
    const newTotal = calculateTotal(quantity, pricePaid);
    
    setPasaje({
      ...pasaje,
      sale: {
        ...pasaje.sale,
        quantity_passages: quantity,
        total_amount: newTotal !== null ? newTotal : pasaje.sale.total_amount
      }
    });
  };

  // Función para manejar el cambio en el precio pagado
  const handlePricePaidChange = (idx: number, pricePaid: string | number | null) => {
    if (!pasaje || !pasaje.passage_detail) return;
    
    const updatedDetails = [...pasaje.passage_detail];
    updatedDetails[idx] = { ...updatedDetails[idx], price_paid: pricePaid };
    
    // Recalcular el total si es el primer detalle (o si queremos sumar todos)
    let newTotal = null;
    if (pasaje.sale?.quantity_passages && pricePaid) {
      newTotal = calculateTotal(pasaje.sale.quantity_passages, pricePaid);
    }
    
    setPasaje({
      ...pasaje,
      passage_detail: updatedDetails,
      sale: pasaje.sale ? {
        ...pasaje.sale,
        total_amount: newTotal !== null ? newTotal : pasaje.sale.total_amount
      } : undefined
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Cargar pasaje
        const { data, error } = await supabase
          .from("passage")
          .select(`
            consecutivo,
            id_trip,
            purchase_date,
            document_passenger,
            id_state_passage,
            id_sale,
            created_at,
            updated_at,
            state_passage ( name ),
            passenger ( document_passenger, name_1, name_2, last_name_1, last_name_2 ),
            trip ( id_trip ),
            sale ( id_sale, sale_date, quantity_passages, total_amount, payment_method ),
            passage_detail ( line_item, seat_number, price_paid )
          `)
          .eq("consecutivo", consecutivo)
          .eq("id_trip", id_trip)
          .single();

        if (error) {
          toast.error("Error cargando pasaje");
          console.error(error);
          navigate("/pasajes");
          return;
        }

        setPasaje(data as Pasaje);

        // Cargar estados de pasaje
        const { data: estadosData, error: estadosError } = await supabase
          .from("state_passage")
          .select("id_state_passage, name")
          .order("name", { ascending: true });

        if (estadosError) {
          toast.error("Error cargando estados");
          console.error(estadosError);
        } else {
          setEstados((estadosData || []) as EstadoPassage[]);
        }
      } catch (error) {
        console.error("Error en fetchData:", error);
        toast.error("Error cargando datos del pasaje");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consecutivo, id_trip, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasaje) return;
    setSaving(true);

    console.log("Datos a guardar:", {
      passage: pasaje,
      sale: pasaje.sale,
      details: pasaje.passage_detail
    });

    try {
      // Preparar datos para passage
      const passageData: any = {
        purchase_date: pasaje.purchase_date || null,
        document_passenger: pasaje.document_passenger || null,
        id_state_passage: pasaje.id_state_passage || null,
        updated_at: new Date().toISOString(),
      };

      // NOTA: id_sale NO se puede editar, mantenemos el original
      // passageData.id_sale se mantiene como está en la base de datos

      // Actualizar tabla passage
      const { error: passageError } = await supabase
        .from("passage")
        .update(passageData)
        .eq("consecutivo", consecutivo)
        .eq("id_trip", id_trip);

      if (passageError) {
        console.error("Error al actualizar passage:", passageError);
        throw new Error(passageError.message);
      }

      // Actualizar venta (sale) si existe id_sale
      if (pasaje.sale && pasaje.sale.id_sale) {
        const saleData: any = {
          sale_date: pasaje.sale.sale_date || null,
          payment_method: pasaje.sale.payment_method || null,
        };

        // Convertir valores numéricos manejando casos vacíos
        if (pasaje.sale.quantity_passages !== null && pasaje.sale.quantity_passages !== "") {
          saleData.quantity_passages = Number(pasaje.sale.quantity_passages);
        } else {
          saleData.quantity_passages = null;
        }

        if (pasaje.sale.total_amount !== null && pasaje.sale.total_amount !== "") {
          saleData.total_amount = Number(pasaje.sale.total_amount);
        } else {
          saleData.total_amount = null;
        }

        const { error: saleError } = await supabase
          .from("sale")
          .update(saleData)
          .eq("id_sale", pasaje.sale.id_sale);

        if (saleError) {
          console.error("Error al actualizar sale:", saleError);
          throw new Error(saleError.message);
        }
      }

      // Actualizar detalles del pasaje
      if (pasaje.passage_detail && pasaje.passage_detail.length > 0) {
        for (const d of pasaje.passage_detail) {
          const detailData: any = {};

          // Solo actualizar seat_number si tiene valor
          if (d.seat_number !== null && d.seat_number !== "") {
            detailData.seat_number = d.seat_number;
          } else {
            detailData.seat_number = null;
          }

          // Convertir price_paid manejando casos vacíos
          if (d.price_paid !== null && d.price_paid !== "") {
            detailData.price_paid = Number(d.price_paid);
          } else {
            detailData.price_paid = null;
          }

          const { error: detailError } = await supabase
            .from("passage_detail")
            .update(detailData)
            .eq("line_item", d.line_item)
            .eq("consecutivo", consecutivo)
            .eq("id_trip", id_trip);

          if (detailError) {
            console.error(`Error al actualizar detalle línea ${d.line_item}:`, detailError);
            throw new Error(detailError.message);
          }
        }
      }

      toast.success("Pasaje actualizado correctamente");
      navigate("/pasajes");
    } catch (error: any) {
      console.error("Error completo:", error);
      toast.error(`Error al guardar: ${error.message || "Error desconocido"}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center">Cargando...</p>;
  if (!pasaje) return <p className="text-center">Pasaje no encontrado</p>;

  // Función auxiliar para formatear fechas
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return "";
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
        <Button variant="ghost" onClick={() => navigate("/pasajes")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Pasajes
        </Button>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Editar Pasaje {consecutivo}</CardTitle>
            <CardDescription>Modifique los datos del pasaje</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Identificadores (solo lectura) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Consecutivo</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-muted"
                    value={String(pasaje.consecutivo)}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ID Trip</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-muted"
                    value={String(pasaje.id_trip)}
                    disabled
                  />
                </div>
              </div>

              {/* Datos principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Documento pasajero</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={pasaje.document_passenger || ""}
                    onChange={(e) =>
                      setPasaje({ ...pasaje, document_passenger: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Fecha de compra</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={formatDateForInput(pasaje.purchase_date)}
                    onChange={(e) =>
                      setPasaje({ 
                        ...pasaje, 
                        purchase_date: e.target.value ? e.target.value : null 
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Estado del pasaje</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={pasaje.id_state_passage ?? ""}
                    onChange={(e) =>
                      setPasaje({
                        ...pasaje,
                        id_state_passage: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccione estado</option>
                    {estados.map((estado) => (
                      <option
                        key={String(estado.id_state_passage)}
                        value={String(estado.id_state_passage)}
                      >
                        {estado.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">ID Venta asociada</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-muted"
                    value={pasaje.id_sale ?? ""}
                    disabled
                    title="El ID de venta no se puede editar"
                  />
                </div>
              </div>

              {/* Venta */}
              {pasaje.sale && (
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold mb-3">Venta</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Fecha de venta</label>
                      <input
                        type="date"
                        className="w-full border rounded px-3 py-2"
                        value={formatDateForInput(pasaje.sale.sale_date)}
                        onChange={(e) =>
                          setPasaje({
                            ...pasaje,
                            sale: { 
                              ...(pasaje.sale as Sale), 
                              sale_date: e.target.value ? e.target.value : null 
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Cantidad de pasajes</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full border rounded px-3 py-2"
                        value={pasaje.sale.quantity_passages ?? ""}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Al cambiar la cantidad, se recalcula el total automáticamente
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Total</label>
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2 bg-muted"
                        step="0.01"
                        value={pasaje.sale.total_amount ?? ""}
                        disabled
                        title="El total se calcula automáticamente (Cantidad × Precio pagado)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Método de pago</label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={pasaje.sale.payment_method ?? ""}
                        onChange={(e) =>
                          setPasaje({
                            ...pasaje,
                            sale: {
                              ...(pasaje.sale as Sale),
                              payment_method: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">Seleccione método</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="PSE">PSE</option>
                        <option value="Nequi">Nequi</option>
                        <option value="Daviplata">Daviplata</option>
                        <option value="Efectivo">Efectivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalles del pasaje */}
              {pasaje.passage_detail && pasaje.passage_detail.length > 0 && (
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold mb-3">Detalles del pasaje</h2>
                  {pasaje.passage_detail.map((d, idx) => (
                    <div key={String(d.line_item)} className="border rounded p-3 mb-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium">Línea</label>
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2 bg-muted"
                          value={String(d.line_item)}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Asiento</label>
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2"
                          value={d.seat_number ?? ""}
                          onChange={(e) => {
                            const updated = [...(pasaje.passage_detail as PassageDetail[])];
                            updated[idx] = { ...updated[idx], seat_number: e.target.value };
                            setPasaje({ ...pasaje, passage_detail: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Precio pagado</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full border rounded px-3 py-2"
                          value={d.price_paid ?? ""}
                          onChange={(e) => handlePricePaidChange(idx, e.target.value)}
                        />
                        {idx === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Al cambiar el precio, se recalcula el total automáticamente
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/pasajes")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarPasaje;