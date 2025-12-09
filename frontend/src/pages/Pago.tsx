import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Pago = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [pseEntidad, setPseEntidad] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [documentoIdentidad, setDocumentoIdentidad] = useState("");

  const obtenerDatosPasaje = () => {
    const pasajeData = sessionStorage.getItem('nuevoPasaje');
    return pasajeData ? JSON.parse(pasajeData) : null;
  };

  const handleGenerarFactura = async () => {
  if (!metodoPago) {
    toast.error("Seleccione un método de pago");
    return;
  }

  if (metodoPago === "pse") {
    if (!pseEntidad || !numeroCuenta || !tipoPersona || !documentoIdentidad) {
      toast.error("Complete todos los campos de PSE");
      return;
    }
  }

  setLoading(true);
  const pasajeData = obtenerDatosPasaje();

  try {
    console.log("Datos del pasaje:", pasajeData);

    // 1. ACTUALIZAR la venta existente con el método de pago 
    const metodoPagoFormateado = metodoPago === "tarjeta" ? "Tarjeta" : "PSE";
    
    const { error: errorActualizarVenta } = await supabase
      .from("sale")
      .update({
        payment_method: metodoPagoFormateado,
        updated_at: new Date().toISOString()
      })
      .eq("id_sale", pasajeData.venta.id_sale); // Usar el id_sale

    if (errorActualizarVenta) {
      console.error("Error actualizando venta:", errorActualizarVenta);
      throw errorActualizarVenta;
    }

    // 2. Actualizar el estado del pasaje a  "Comprado"
    const { data: estadoPagado, error: errorEstado } = await supabase
      .from("state_passage")
      .select("id_state_passage")
      .or(`name.ilike.%Comprado%`)
      .limit(1)
      .single();

    if (errorEstado) {
      console.error("Error buscando estado pagado:", errorEstado);
      // Si no encuentra, usar el estado que ya está en el pasaje
    } else if (estadoPagado) {
      const { error: errorActualizarEstado } = await supabase
        .from("passage")
        .update({
          id_state_passage: estadoPagado.id_state_passage,
          updated_at: new Date().toISOString()
        })
        .eq("consecutivo", pasajeData.pasaje.consecutivo)
        .eq("id_trip", pasajeData.pasaje.id_trip);

      if (errorActualizarEstado) {
        console.error("Error actualizando estado:", errorActualizarEstado);
      }
    }

    // 3. Verificar que el detalle ya existe (se creó en Reservar.tsx)
    // Si no existe, crearlo
    const { data: detalleExistente } = await supabase
      .from("passage_detail")
      .select("*")
      .eq("consecutivo", pasajeData.pasaje.consecutivo)
      .eq("id_trip", pasajeData.pasaje.id_trip)
      .single();

    if (!detalleExistente) {
      // Generar línea única para el detalle
      const { data: ultimoDetalle } = await supabase
        .from("passage_detail")
        .select("line_item")
        .order("line_item", { ascending: false })
        .limit(1)
        .single();

      let nuevaLinea = 1;
      if (ultimoDetalle) {
        nuevaLinea = Number(ultimoDetalle.line_item) + 1;
      }

      const { error: errorDetalle } = await supabase
        .from("passage_detail")
        .insert({
          line_item: nuevaLinea.toString(),
          consecutivo: pasajeData.pasaje.consecutivo,
          id_trip: pasajeData.pasaje.id_trip,
          seat_number: pasajeData.viajeInfo.asiento,
          price_paid: pasajeData.viajeInfo.precio,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (errorDetalle) {
        console.error("Error creando detalle:", errorDetalle);
      }
    }

    // 4. Guardar información para la factura
    const facturaData = {
      pasaje: pasajeData.pasaje,
      venta: {
        ...pasajeData.venta,
        payment_method: metodoPagoFormateado // Actualizado con el método de pago
      },
      detalle: detalleExistente || pasajeData.detalle,
      passengerData: pasajeData.passengerData,
      viajeInfo: pasajeData.viajeInfo,
      pagoInfo: {
        metodoPago: metodoPagoFormateado,
        pseEntidad,
        numeroCuenta,
        tipoPersona,
        documentoIdentidad
      }
    };

    console.log("Datos para factura:", facturaData);
    
    sessionStorage.setItem('facturaData', JSON.stringify(facturaData));

    toast.success("Pago procesado exitosamente");
    navigate("/pasajes");
    
  } catch (error: any) {
    console.error("Error procesando pago:", error);
    toast.error(`Error al procesar pago: ${error.message || "Error desconocido"}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">Formulario de Pago</CardTitle>
              <CardDescription>Seleccione el método de pago y complete los datos</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del monto */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total a pagar:</span>
              <span className="text-2xl font-bold text-green-600">
                ${obtenerDatosPasaje()?.precio?.toLocaleString() || "13,000"} COP
              </span>
            </div>
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label>Método de Pago *</Label>
            <Select value={metodoPago} onValueChange={setMetodoPago}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                <SelectItem value="pse">PSE (Transferencia Bancaria)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Datos de tarjeta */}
          {metodoPago === "tarjeta" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tarjeta">Número de Tarjeta *</Label>
                <Input id="tarjeta" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha Expiración *</Label>
                  <Input id="fecha" placeholder="MM/AA" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input id="cvv" placeholder="123" required />
                </div>
              </div>
            </div>
          )}

          {/* Datos de PSE */}
          {metodoPago === "pse" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Entidad Bancaria *</Label>
                <Select value={pseEntidad} onValueChange={setPseEntidad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione entidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nequi">Nequi</SelectItem>
                    <SelectItem value="daviplata">Daviplata</SelectItem>
                    <SelectItem value="bancolombia">Bancolombia</SelectItem>
                    <SelectItem value="bbva">BBVA</SelectItem>
                    <SelectItem value="otro">Otro Banco</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuenta">Número de Cuenta / Celular *</Label>
                <Input
                  id="cuenta"
                  placeholder="Ej: 3001234567 o número de cuenta"
                  value={numeroCuenta}
                  onChange={(e) => setNumeroCuenta(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Persona *</Label>
                <Select value={tipoPersona} onValueChange={setTipoPersona}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo de persona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Persona Natural</SelectItem>
                    <SelectItem value="juridica">Persona Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento">Documento de Identidad *</Label>
                <Input
                  id="documento"
                  placeholder="Ej: 1234567890"
                  value={documentoIdentidad}
                  onChange={(e) => setDocumentoIdentidad(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleGenerarFactura}
            disabled={loading}
          >
            {loading ? "Procesando pago..." : "Pagar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pago;