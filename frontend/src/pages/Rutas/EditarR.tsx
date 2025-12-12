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

const EditarRuta = () => {
  const { id_rute } = useParams(); // id_rute
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);

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
    const fetchRuta = async () => {
      const { data, error } = await supabase
        .from("rute")
        .select("*")
        .eq("id_rute", id_rute)
        .maybeSingle();

      if (error) {
        toast.error("Error al cargar la ruta");
        console.error(error);
      } else if (!data) {
        toast.error(`No se encontró la ruta con id ${id}`);
      } else {
        setForm(data);
      }
    };

    const fetchCiudades = async () => {
      const { data, error } = await supabase.from("city").select("*");
      if (error) console.error(error);
      else setCiudades(data);
    };

    fetchRuta();
    fetchCiudades();
  }, [id_rute]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { id_rute, price, id_city, id_state, id_city_d, id_state_d } = form;

    if (!price || !id_city || !id_state || !id_city_d || !id_state_d) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (id_city === id_city_d && id_state === id_state_d) {
      toast.error("Origen y destino no pueden ser iguales");
      return;
    }

    const { error } = await supabase
      .from("rute")
      .update({
        price,
        id_city,
        id_state,
        id_city_d,
        id_state_d,
      })
      .eq("id_rute", id_rute);

    if (error) {
      toast.error("Error al actualizar ruta");
      console.error(error);
    } else {
      toast.success("Ruta actualizada exitosamente");
      navigate("/rutas");
    }
  };

  if (!form) return <p className="text-center">Cargando ruta...</p>;

  return (
    <div className="min-h-screen bg-background">
      {/* Barra de navegación */}
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
        <Button variant="ghost" onClick={() => navigate("/rutas")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Rutas
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Editar Ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>ID Ruta</Label>
              <Input name="id_rute" value={form.id_rute} disabled />
            </div>
            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div>
              <Label>Origen</Label>
              <select
                name="id_city"
                value={form.id_city}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-2"
              >
                {ciudades.map((c) => (
                  <option key={c.id_city} value={c.id_city}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                name="id_state"
                value={form.id_state}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                {ciudades.map((c) => (
                  <option key={c.id_state} value={c.id_state}>
                    {c.id_state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Destino</Label>
              <select
                name="id_city_d"
                value={form.id_city_d}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-2"
              >
                {ciudades.map((c) => (
                  <option key={c.id_city} value={c.id_city}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                name="id_state_d"
                value={form.id_state_d}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                {ciudades.map((c) => (
                  <option key={c.id_state} value={c.id_state}>
                    {c.id_state}
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

export default EditarRuta;
