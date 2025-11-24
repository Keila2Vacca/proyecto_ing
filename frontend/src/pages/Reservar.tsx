import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Página para reservar pasajes
 * Accesible para: todos los usuarios autenticados
 */
const Reservar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    origen: '',
    destino: '',
    fecha: '',
    hora: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.documento || !formData.origen || !formData.destino || !formData.fecha) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    // Aquí iría la lógica para guardar la reserva en la base de datos
    toast.success("Reserva creada exitosamente");
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Ticket className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Reservar Pasaje</CardTitle>
                <CardDescription>Complete el formulario para reservar un nuevo pasaje</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Pasajero */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información del Pasajero</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      id="nombre"
                      placeholder="Ej: Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="documento">Documento *</Label>
                    <Input
                      id="documento"
                      placeholder="Ej: 1234567890"
                      value={formData.documento}
                      onChange={(e) => handleInputChange('documento', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="Ej: 3001234567"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                  />
                </div>
              </div>

              {/* Información del Viaje */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información del Viaje</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origen">Origen *</Label>
                    <Select value={formData.origen} onValueChange={(value) => handleInputChange('origen', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione origen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abrego">Ábrego</SelectItem>
                        <SelectItem value="ocana">Ocaña</SelectItem>
                        <SelectItem value="cucuta">Cúcuta</SelectItem>
                        <SelectItem value="bucaramanga">Bucaramanga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destino">Destino *</Label>
                    <Select value={formData.destino} onValueChange={(value) => handleInputChange('destino', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abrego">Ábrego</SelectItem>
                        <SelectItem value="ocana">Ocaña</SelectItem>
                        <SelectItem value="cucuta">Cúcuta</SelectItem>
                        <SelectItem value="bucaramanga">Bucaramanga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha de Viaje *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => handleInputChange('fecha', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={formData.hora}
                      onChange={(e) => handleInputChange('hora', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  <Ticket className="mr-2 h-4 w-4" />
                  Confirmar Reserva
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reservar;
