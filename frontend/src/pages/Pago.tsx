import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { useState } from "react";

;

const Pago = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const formData = state?.formData;

  const [metodoPago, setMetodoPago] = useState("");
  const [pseEntidad, setPseEntidad] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [documentoIdentidad, setDocumentoIdentidad] = useState("");

  const handleGenerarFactura = () => {
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

    toast.success("Factura generada exitosamente");
    navigate("/factura", {
      state: {
        formData,
        metodoPago,
        pseEntidad,
        numeroCuenta,
        tipoPersona,
        documentoIdentidad
      }
    });
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
          {/* Método de pago */}
          <div className="space-y-2">
            <Label>Método de Pago</Label>
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
                <Label htmlFor="tarjeta">Número de Tarjeta</Label>
                <Input id="tarjeta" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha Expiración</Label>
                  <Input id="fecha" placeholder="MM/AA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {/* Datos de PSE */}
          {metodoPago === "pse" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Entidad Bancaria</Label>
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
                <Label htmlFor="cuenta">Número de Cuenta / Celular</Label>
                <Input
                  id="cuenta"
                  placeholder="Ej: 3001234567 o número de cuenta"
                  value={numeroCuenta}
                  onChange={(e) => setNumeroCuenta(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Persona</Label>
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
                <Label htmlFor="documento">Documento de Identidad</Label>
                <Input
                  id="documento"
                  placeholder="Ej: 1234567890"
                  value={documentoIdentidad}
                  onChange={(e) => setDocumentoIdentidad(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button className="w-full" onClick={handleGenerarFactura}>
            Generar Factura
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pago;