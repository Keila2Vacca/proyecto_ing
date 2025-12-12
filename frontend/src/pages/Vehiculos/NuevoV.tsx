import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { AccessibilityControls } from "@/components/ThemeToggle";
import imagotipo from "@/assets/imagotipo.png";

const NuevoVehiculo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plate: "",
    model: "",
    capacity: "",
    id_state_vehicle: "",
  });
  const [estados, setEstados] = useState<any[]>([]);

  useEffect(() => {
    const fetchEstados = async () => {
      const { data, error } = await supabase.from("state_vehicle").select("*");
      if (error) console.error(error);
      else setEstados(data);
    };
    fetchEstados();
  }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Si el campo es "plate", convertir a mayúsculas
    if (name === "plate") {
        setForm({ ...form, [name]: value.toUpperCase() });
    } else {
        setForm({ ...form, [name]: value });
    }
    };


  const handleSubmit = async () => {
    // Validaciones extra
    if (!form.plate || !form.model || !form.capacity || !form.id_state_vehicle) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const capacidad = Number(form.capacity);
    if (capacidad < 1 || capacidad > 11) {
      toast.error("La capacidad debe estar entre 1 y 11");
      return;
    }

    const { error } = await supabase.from("vehicle").insert([form]);
    if (error) {
      toast.error("Error al crear vehículo");
      console.error(error);
    } else {
      toast.success("Vehículo creado exitosamente");
      navigate("/vehiculos");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header con barra de navegación */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link to="/dashboard">
            <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <AccessibilityControls />
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Button variant="ghost" onClick={() => navigate("/vehiculos")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a vehículo
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo Vehículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label>Placa</Label>
                <Input name="plate" value={form.plate} onChange={handleChange} />
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
                <option value="">Seleccione estado</option>
                {estados.map((estado) => (
                  <option key={estado.id_state_vehicle} value={estado.id_state_vehicle}>
                    {estado.name}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleSubmit}>Guardar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NuevoVehiculo;
