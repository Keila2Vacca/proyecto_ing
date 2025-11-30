import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import imagotipo from "@/assets/imagotipo.png";

const Factura = () => {
  const { state } = useLocation();
  const data = state?.formData;
  const metodoPago = state?.metodoPago;
  const pseEntidad = state?.pseEntidad;
  const numeroCuenta = state?.numeroCuenta;
  const tipoPersona = state?.tipoPersona;
  const documentoIdentidad = state?.documentoIdentidad;

  const facturaRef = useRef<HTMLDivElement>(null);
{/*
  const handlePrint = useReactToPrint({
    content: () => facturaRef.current,
    documentTitle: `Factura_${data?.documento || "pasaje"}`,
  });
*/}

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      {/* Área imprimible */}
      <div ref={facturaRef} className="bg-white p-6 rounded-md shadow-md">
        {/* Encabezado con logo */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <img src={imagotipo} alt="Logo Cootrans" className="h-12" />
          <div className="text-right text-sm">
            <p><strong>COOTRANS Hacaritama</strong></p>
            <p>Factura de Pasaje</p>
            <p>Fecha de emisión: {new Date().toLocaleDateString("es-CO")}</p>
          </div>
        </div>

        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-xl">Detalles del Pasaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Nombre:</strong> {data?.nombre}</p>
            <p><strong>Documento:</strong> {data?.documento}</p>
            <p><strong>Teléfono:</strong> {data?.telefono}</p>
            <p><strong>Origen:</strong> {data?.origen}</p>
            <p><strong>Destino:</strong> {data?.destino}</p>
            <p><strong>Fecha:</strong> {data?.fecha}</p>
            <p><strong>Hora:</strong> {data?.hora || "No especificada"}</p>
            <p><strong>Total:</strong> $13.000 COP</p>
            <p><strong>Estado:</strong> Pagado</p>
            <p><strong>Pago con:</strong> {metodoPago === "tarjeta" ? "Tarjeta" : `PSE - ${pseEntidad}`}</p>
            {metodoPago === "pse" && (
              <>
                <p><strong>Tipo de Persona:</strong> {tipoPersona}</p>
                <p><strong>Documento Identidad:</strong> {documentoIdentidad}</p>
                <p><strong>Número de Cuenta / Celular:</strong> {numeroCuenta}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Botones */}
      <div className="mt-6 flex gap-4">
       {/* <Button onClick={handlePrint}>Imprimir / Descargar PDF</Button>*/} 
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>Volver al Dashboard</Button>
      </div>
    </div>
  );
};

export default Factura;
