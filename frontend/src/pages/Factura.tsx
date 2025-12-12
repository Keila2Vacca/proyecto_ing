import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Download, Printer, ArrowLeft, CheckCircle } from "lucide-react";
import imagotipo from "@/assets/imagotipo.png";


const Factura = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facturaRef = useRef(null);

  // Obtener datos de location.state O de sessionStorage como respaldo
  const stateData = location.state;
  const fallbackData = JSON.parse(sessionStorage.getItem('facturaData') || '{}');
  
  // Combinar datos (prioridad a location.state)
  const facturaData = stateData?.facturaData || fallbackData;
  const formData = stateData?.formData || {};
  const pagoInfo = facturaData?.pagoInfo || {};

  // Si no hay datos, mostrar mensaje de error
  if (!facturaData || Object.keys(facturaData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error al cargar factura</CardTitle>
            <CardDescription>
              No se encontraron datos de la factura. Por favor, regrese a la página de reservas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Función para imprimir con estilos completos
  const handlePrint = () => {
    const printContent = facturaRef.current;
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Obtener todos los estilos de la página actual
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factura ${facturaData?.passengerData?.documento || "pasaje"}</title>
          <meta charset="UTF-8">
          <style>
            ${styles}
            
            /* Estilos adicionales para impresión */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body {
              margin: 0;
              padding: 20px;
              background: white;
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 10px;
              }
              
              .no-print {
                display: none !important;
              }
              
              @page {
                size: auto;
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Esperar a que se carguen los estilos antes de imprimir
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  // Función para descargar PDF
  const handleDownloadPDF = () => {
    handlePrint();
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con botones */}
        <div className="mb-6 flex flex-wrap gap-3 no-print">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Button>
          
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" />
            Imprimir Factura
          </Button>
          
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
        </div>

        {/* Área imprimible */}
        <div ref={facturaRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Encabezado de la factura */}
          <div className="bg-white p-6 border-b-2 border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-1 rounded-lg flex items-center justify-center">
                    <img src={imagotipo} alt="Hacaritama" className="h-18 w-18" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">COOTRANS Hacaritama</h1>
                    <p className="text-sm text-gray-600">Transporte terrestre de pasajeros</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Tel: 314 2157928</p>
              </div>
              <div className="text-right bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                <h2 className="text-sm font-semibold text-green-800 mb-1">FACTURA DE PASAJE</h2>
                <p className="text-xs text-gray-700">N° {facturaData.venta?.id_sale || "HAE-0002"}</p>
                <p className="text-xs text-gray-600 mt-2">Fecha: {new Date().toLocaleDateString('es-CO')}</p>
                <p className="text-xs text-gray-600">
                  Hora: {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Información del pasajero y pago en dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Información del pasajero */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">
                  Información del Pasajero
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 block text-xs">Nombre completo:</span>
                    <p className="font-medium text-gray-900">
                      {`${facturaData.passengerData?.nombre || 'Jahrol Baruc'} ${facturaData.passengerData?.apellido || 'Gómez Arévalo'}`.trim()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs">Documento:</span>
                    <p className="font-medium text-gray-900">{facturaData.passengerData?.documento || "5-142765"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs">Teléfono:</span>
                    <p className="font-medium text-gray-900">{facturaData.pasaje?.document_passenger || "3456 7889"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs">Consecutivo:</span>
                    <p className="font-medium text-gray-900">{facturaData.pasaje?.consecutivo || "1940"}</p>
                  </div>
                </div>
              </div>

              {/* Información del pago */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">
                  Información del Pago
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 block text-xs">Método de pago:</span>
                    <p className="font-medium text-gray-900">{pagoInfo.metodoPago || "Nequi/Daviplata"}</p>
                  </div>
                  
                  {pagoInfo.metodoPago === "PSE" && (
                    <>
                      <div>
                        <span className="text-gray-600 block text-xs">Entidad:</span>
                        <p className="font-medium text-gray-900">{pagoInfo.pseEntidad || "No especificado"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 block text-xs">Tipo persona:</span>
                        <p className="font-medium text-gray-900">
                          {pagoInfo.tipoPersona === "natural" ? "Persona Natural" : "Persona Jurídica"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 block text-xs">Documento identidad:</span>
                        <p className="font-medium text-gray-900">{pagoInfo.documentoIdentidad || "No especificado"}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <span className="text-gray-600 block text-xs">Fecha de pago:</span>
                    <p className="font-medium text-gray-900">{formatDate(pagoInfo.fechaPago) || "Jueves, 19 de diciembre de 2025"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs">Estado:</span>
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      PAGADO
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles del viaje */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase bg-gray-50 p-2 rounded border border-gray-200">
                Detalles del Viaje
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-4 rounded-lg text-center">
                  <p className="text-xs text-blue-700 font-semibold mb-2">RUTA</p>
                  <p className="font-bold text-lg text-blue-900 mb-1">
                    {facturaData.viajeInfo?.ruta || "Ocaña → Ábrego"}
                  </p>
                  <p className="text-xs text-blue-700">Origen → Destino</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-4 rounded-lg text-center">
                  <p className="text-xs text-purple-700 font-semibold mb-2">FECHA Y HORA</p>
                  <p className="font-semibold text-sm text-purple-900">
                    {formatDate(facturaData.viajeInfo?.fecha) || "Jueves, 19 de diciembre de 2025"}
                  </p>
                  <p className="text-lg font-bold text-purple-900 mt-1">
                    {facturaData.viajeInfo?.hora || "5:15:00"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-4 rounded-lg text-center">
                  <p className="text-xs text-green-700 font-semibold mb-2">ASIENTO</p>
                  <p className="font-bold text-4xl text-green-900">
                    {facturaData.viajeInfo?.asiento || "1"}
                  </p>
                  <p className="text-xs text-green-700 mt-1">Número de asiento</p>
                </div>
              </div>
            </div>

            {/* Resumen de pago */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase bg-gray-50 p-2 rounded border border-gray-200">
                Resumen de Pago
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Precio Unitario</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-t border-gray-200">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">Pasaje de bus</p>
                        <p className="text-xs text-gray-600">{facturaData.viajeInfo?.ruta || "Ocaña → Ábrego"}</p>
                      </td>
                      <td className="text-center py-4 px-4 text-gray-900">1</td>
                      <td className="text-right py-4 px-4 text-gray-900">
                        {formatPrice(facturaData.viajeInfo?.precio || 13000)}
                      </td>
                      <td className="text-right py-4 px-4 font-semibold text-gray-900">
                        {formatPrice(facturaData.viajeInfo?.precio || 13000)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-blue-600 text-white py-4 px-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">TOTAL:</span>
                    <span className="text-2xl font-bold">
                      {formatPrice(facturaData.viajeInfo?.precio || 14000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie de página */}
            <div className="border-t-2 border-gray-200 pt-4 mt-6 text-center">
              <p className="text-sm text-gray-700 font-semibold mb-2">
                COOTRANS Hacaritama - Transporte terrestre de pasajeros
              </p>
              <p className="text-xs text-gray-600 mb-1">
                Teléfono: 314 2157928 | Email: contacto@cootranshacaritama.com
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Esta factura es un comprobante de pago. Consérvela para cualquier reclamo.
              </p>
              <p className="text-xs text-gray-400 italic">
                Factura generada electrónicamente - No requiere firma autógrafa
              </p>
            </div>

            {/* Instrucciones */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 border-t border-dashed border-gray-300 pt-3">
                Documento válido como factura - Conserve este comprobante
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        <div className="mt-6 no-print">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    ¡Reserva confirmada exitosamente!
                  </h3>
                  <p className="text-sm text-green-700">
                    Tu pasaje ha sido reservado y pagado. Puedes imprimir esta factura o descargarla como PDF.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </Button>
                
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Factura;