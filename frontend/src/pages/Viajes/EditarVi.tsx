import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const EditarTrip = () => {
  const { id_trip } = useParams(); 
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [form, setForm] = useState<any>(null);
  const [rutas, setRutas] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);

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
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from("trip")
        .select("*")
        .eq("id_trip", id_trip)
        .maybeSingle();

      if (error) {
        toast.error("Error al cargar viaje");
        console.error(error);
      } else if (!data) {
        toast.error(`No se encontró el viaje con id ${id_trip}`);
      } else {
        setForm(data);
      }
    };

    const fetchData = async () => {
      const [rutasRes, vehiculosRes, empleadosRes, estadosRes] = await Promise.all([
        supabase.from("rute").select("id_rute"),
        supabase.from("vehicle").select("plate"),
        supabase
            .from("employee")
            .select("epe_code, name_1, name_2, last_name_1, last_name_2, type_employee")
            .eq("type_employee", "D"), //  solo conductores
        supabase.from("state_trip").select("id_state_trip, name"),
        ]);

      if (!rutasRes.error) setRutas(rutasRes.data || []);
      if (!vehiculosRes.error) setVehiculos(vehiculosRes.data || []);
      if (!empleadosRes.error) setEmpleados(empleadosRes.data || []);
      if (!estadosRes.error) setEstados(estadosRes.data || []);
    };

    fetchTrip();
    fetchData();
  }, [id_trip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { id_trip, date, departure_time, id_state_trip, id_rute, plate, epe_code } = form;

    if (!date || !departure_time || !id_state_trip || !id_rute || !plate || !epe_code) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const { error } = await supabase
      .from("trip")
      .update({
        date,
        departure_time,
        id_state_trip,
        id_rute,
        plate,
        epe_code,
      })
      .eq("id_trip", id_trip);

    if (error) {
      toast.error("Error al actualizar viaje");
      console.error(error);
    } else {
      toast.success("Viaje actualizado exitosamente");
      navigate("/viajes");
    }
  };

  if (!form) return <p className="text-center">Cargando viaje...</p>;

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

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Button variant="ghost" onClick={() => navigate("/viajes")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Viajes
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Editar Viaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>ID Viaje</Label>
              <Input name="id_trip" value={form.id_trip} disabled />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div>
              <Label>Hora de salida</Label>
              <Input type="time" name="departure_time" value={form.departure_time} onChange={handleChange} />
            </div>
            <div>
              <Label>Estado del viaje</Label>
              <select
                name="id_state_trip"
                value={form.id_state_trip}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                {estados.map((e) => (
                  <option key={e.id_state_trip} value={e.id_state_trip}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Ruta</Label>
              <select
                name="id_rute"
                value={form.id_rute}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                {rutas.map((r) => (
                  <option key={r.id_rute} value={r.id_rute}>
                    {r.id_rute}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Vehículo</Label>
              <select
                name="plate"
                value={form.plate}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                {vehiculos.map((v) => (
                  <option key={v.plate} value={v.plate}>
                    {v.plate}
                  </option>
                ))}
              </select>
            </div>
            <div>
            <Label>Conductor</Label>
            <select
                name="epe_code"
                value={form.epe_code}
                onChange={handleChange}
                className="w-full border rounded p-2"
            >
                <option value="">Seleccione conductor</option>
                {empleados.map((e) => {
                const nombreCompleto = `${e.name_1} ${e.name_2 ?? ""} ${e.last_name_1} ${e.last_name_2 ?? ""}`.trim();
                return (
                    <option key={e.epe_code} value={e.epe_code}>
                    {nombreCompleto}
                    </option>
                );
                })}
            </select>
            </div>

            <Button onClick={handleSubmit}>Actualizar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarTrip;
