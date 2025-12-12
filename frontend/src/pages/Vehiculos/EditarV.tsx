import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const EditarVehiculo = () => {
  const { plate } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [estados, setEstados] = useState<any[]>([]);
  const { signOut } = useAuth();
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
    const fetchVehiculo = async () => {
         // Normalizar placa: mayúsculas y quitar guiones si los hubiera
     const normalizedPlate = plate?.toUpperCase().replace(/-/g, "");
      const { data, error } = await supabase
        .from("vehicle")
        .select("*")
        .eq("plate", normalizedPlate)
        .single();
        if (error) {
        console.error(error);
        toast.error("No se pudo cargar el vehículo");
        } else {
        setForm(data);
        }
    };

    const fetchEstados = async () => {
      const { data, error } = await supabase.from("state_vehicle").select("*");
      if (error) console.error(error);
      else setEstados(data);
    };

    fetchVehiculo();
    fetchEstados();
  }, [plate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const normalizedPlate = plate?.toUpperCase().replace(/-/g, "");
    const { error } = await supabase.from("vehicle").update(form).eq("plate", normalizedPlate);
    if (error) {
      toast.error("Error al actualizar vehículo");
      console.error(error);
    } else {
      toast.success("Vehículo actualizado exitosamente");
      navigate("/vehiculos");
    }
  };

  if (!form) return <p className="text-center">Cargando vehículo...</p>;

  return (
        <div className="min-h-screen bg-background">
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
            <Button variant="ghost" onClick={() => navigate("/vehiculos")} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Vehículos
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Editar Vehículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Placa</Label>
                  <Input name="plate" value={form.plate} disabled />
                </div>
                <div>
                  <Label>Modelo</Label>
                  <select
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                      >
                      <option value="">Seleccione modelo</option>
                      <option value="Taxi">Taxi</option>
                      <option value="Buseta">Buseta</option>
                  </select>
                </div>
                <div>
                  <Label>Capacidad</Label>
                    <Input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      min={1}
                      max={11}
                    />
                </div>
                <div>
                  <Label>Estado</Label>
                  <select
                    name="id_state_vehicle"
                    value={form.id_state_vehicle}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  >
                    {estados.map((estado) => (
                      <option key={estado.id_state_vehicle} value={estado.id_state_vehicle}>
                        {estado.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleSubmit}>Actualizar</Button>
              </CardContent>
            </Card>
          </div>
        </div>
  );
};

export default EditarVehiculo;
