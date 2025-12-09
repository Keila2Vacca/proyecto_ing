import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NuevoTrip = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [rutas, setRutas] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generandoId, setGenerandoId] = useState(false);

  const [form, setForm] = useState({
    id_trip: "",
    date: "",
    departure_time: "",
    id_state_trip: "",
    id_rute: "",
    plate: "",
    epe_code: "",
  });

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rutasRes, vehiculosRes, empleadosRes, estadosRes] = await Promise.all([
          supabase.rpc("get_rutas"),
          supabase.from("vehicle").select("plate, model, capacity"),
          supabase
            .from("employee")
            .select("epe_code, name_1, name_2, last_name_1, last_name_2, type_employee")
            .eq("type_employee", "D"),
          supabase.from("state_trip").select("id_state_trip, name"),
        ]);

        if (!rutasRes.error) setRutas(rutasRes.data || []);
        if (!vehiculosRes.error) setVehiculos(vehiculosRes.data || []);
        if (!empleadosRes.error) setEmpleados(empleadosRes.data || []);
        if (!estadosRes.error) setEstados(estadosRes.data || []);

        // Generar ID automáticamente
        generarIdTrip();
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generarIdTrip = async () => {
    setGenerandoId(true);
    try {
      // Obtener el último ID de trip
      const { data: ultimoTrip, error } = await supabase
        .from("trip")
        .select("id_trip")
        .order("id_trip", { ascending: false })
        .limit(1)
        .single();

      let nuevoNumero = 1;
      
      if (!error && ultimoTrip) {
        // Extraer número del último ID (ej: "TRP-001" -> 1)
        const match = ultimoTrip.id_trip.match(/TRP-(\d+)/);
        if (match) {
          nuevoNumero = parseInt(match[1]) + 1;
        } else {
          // Si no sigue el formato, buscar el mayor número
          const { data: todosTrips } = await supabase
            .from("trip")
            .select("id_trip")
            .order("id_trip", { ascending: false });

          const numeros = todosTrips?.map(t => {
            const match = t.id_trip.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          }).filter(n => !isNaN(n));

          nuevoNumero = numeros && numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
        }
      }

      const nuevoId = `TRP-${nuevoNumero.toString().padStart(3, '0')}`;
      setForm(prev => ({ ...prev, id_trip: nuevoId }));
      
    } catch (error) {
      console.error("Error generando ID:", error);
      // Fallback: usar timestamp
      const timestampId = `TRP-${Date.now().toString().slice(-6)}`;
      setForm(prev => ({ ...prev, id_trip: timestampId }));
    } finally {
      setGenerandoId(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { id_trip, date, departure_time, id_state_trip, id_rute, plate, epe_code } = form;

    if (!id_trip || !date || !departure_time || !id_state_trip || !id_rute || !plate || !epe_code) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    // Validar que la fecha sea futura
    const fechaSeleccionada = new Date(date);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      toast.error("La fecha del viaje debe ser hoy o en el futuro");
      return;
    }

    setLoading(true);

    try {
      const tripData = {
        id_trip,
        date,
        departure_time: departure_time + ":00", // Asegurar formato HH:MM:SS
        id_state_trip,
        id_rute,
        plate,
        epe_code,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Insertando viaje:", tripData);

      const { error } = await supabase.from("trip").insert(tripData);

      if (error) {
        console.error("Error detallado:", error);
        
        if (error.code === '23505') { // Violación de clave única
          toast.error("Error: Ya existe un viaje con este ID");
          // Generar nuevo ID
          generarIdTrip();
          setLoading(false);
          return;
        }
        
        if (error.code === '23503') { // Violación de clave foránea
          toast.error("Error: Uno de los datos seleccionados no existe");
          setLoading(false);
          return;
        }
        
        throw error;
      }

      toast.success("Viaje creado exitosamente");
      navigate("/viajes");
      
    } catch (error: any) {
      console.error("Error completo:", error);
      toast.error(`Error al crear viaje: ${error.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
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
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Button variant="ghost" onClick={() => navigate("/viajes")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Viajes
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo Viaje</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete los datos para crear un nuevo viaje
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ID del Viaje (automático, solo lectura) */}
            <div>
              <Label>ID Viaje</Label>
              <div className="flex gap-2">
                <Input 
                  value={form.id_trip} 
                  readOnly 
                  className="bg-muted"
                  placeholder={generandoId ? "Generando ID..." : "ID automático"}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={generarIdTrip}
                  disabled={generandoId}
                >
                  {generandoId ? "..." : "Regenerar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ID generado automáticamente
              </p>
            </div>

            {/* Fecha */}
            <div>
              <Label>Fecha *</Label>
              <Input 
                type="date" 
                value={form.date} 
                onChange={(e) => handleChange("date", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Hora de salida */}
            <div>
              <Label>Hora de salida *</Label>
              <Input 
                type="time" 
                value={form.departure_time} 
                onChange={(e) => handleChange("departure_time", e.target.value)}
                required
              />
            </div>

            {/* Estado del viaje */}
            <div>
              <Label>Estado del viaje *</Label>
              <Select 
                value={form.id_state_trip} 
                onValueChange={(value) => handleChange("id_state_trip", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((e) => (
                    <SelectItem key={e.id_state_trip} value={e.id_state_trip}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ruta */}
            <div>
              <Label>Ruta *</Label>
              <Select 
                value={form.id_rute} 
                onValueChange={(value) => handleChange("id_rute", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione ruta" />
                </SelectTrigger>
                <SelectContent>
                  {rutas.map((r) => (
                    <SelectItem key={r.id_rute} value={r.id_rute}>
                      <div className="flex flex-col">
                        <span className="font-medium">{r.id_rute}</span>
                        <span className="text-sm text-muted-foreground">
                          {r.origin_city?.name} → {r.destination_city?.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehículo */}
            <div>
              <Label>Vehículo *</Label>
              <Select 
                value={form.plate} 
                onValueChange={(value) => handleChange("plate", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione vehículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehiculos.map((v) => (
                    <SelectItem key={v.plate} value={v.plate}>
                      <div className="flex flex-col">
                        <span className="font-medium">{v.plate}</span>
                        <span className="text-sm text-muted-foreground">
                          {v.model} - Capacidad: {v.capacity}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conductor */}
            <div>
              <Label>Conductor *</Label>
              <Select 
                value={form.epe_code} 
                onValueChange={(value) => handleChange("epe_code", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione conductor" />
                </SelectTrigger>
                <SelectContent>
                  {empleados.map((e) => {
                    const nombreCompleto = `${e.name_1} ${e.name_2 || ""} ${e.last_name_1} ${e.last_name_2 || ""}`.trim();
                    return (
                      <SelectItem key={e.epe_code} value={e.epe_code}>
                        {nombreCompleto} ({e.epe_code})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Botón de guardar */}
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Creando viaje..." : "Guardar Viaje"}
            </Button>

            {/* Información */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> El ID del viaje se genera automáticamente.
                Asegúrese de que la fecha sea hoy o en el futuro.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NuevoTrip;