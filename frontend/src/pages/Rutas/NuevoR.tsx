import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";

const NuevaRuta = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [form, setForm] = useState({
    id_rute: "",
    price: "",
    id_city: "",
    id_state: "",
    id_city_d: "",
    id_state_d: "",
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
    const fetchCiudades = async () => {
      const { data, error } = await supabase.from("city").select("*");
      if (error) console.error(error);
      else setCiudades(data);
    };
    fetchCiudades();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { id_rute, price, id_city, id_state, id_city_d, id_state_d } = form;

    if (!id_rute || !price || !id_city || !id_state || !id_city_d || !id_state_d) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (id_city === id_city_d && id_state === id_state_d) {
      toast.error("Origen y destino no pueden ser iguales");
      return;
    }

    const { error } = await supabase.from("rute").insert([form]);
    if (error) {
      toast.error("Error al crear ruta");
      console.error(error);
    } else {
      toast.success("Ruta creada exitosamente");
      navigate("/rutas");
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
            <Button variant="ghost" onClick={() => navigate("/rutas")} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Rutas
            </Button>

            <Card>
                <CardHeader>
                <CardTitle>Nueva Ruta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label>ID Ruta</Label>
                    <Input name="id_rute" value={form.id_rute} onChange={handleChange} />
                </div>
                <div>
                    <Label>Precio</Label>
                    <Input type="number" name="price" value={form.price} onChange={handleChange} min={1} />
                </div>
                <div>
                    <Label>Origen</Label>
                    <select name="id_city" value={form.id_city} onChange={handleChange} className="w-full border rounded p-2 mb-2">
                    <option value="">Ciudad</option>
                    {ciudades.map((c) => (
                        <option key={c.id_city} value={c.id_city}>{c.name}</option>
                    ))}
                    </select>
                    <select name="id_state" value={form.id_state} onChange={handleChange} className="w-full border rounded p-2">
                    <option value="">Departamento</option>
                    {ciudades.map((c) => (
                        <option key={c.id_state} value={c.id_state}>{c.id_state}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <Label>Destino</Label>
                    <select name="id_city_d" value={form.id_city_d} onChange={handleChange} className="w-full border rounded p-2 mb-2">
                    <option value="">Ciudad</option>
                    {ciudades.map((c) => (
                        <option key={c.id_city} value={c.id_city}>{c.name}</option>
                    ))}
                    </select>
                    <select name="id_state_d" value={form.id_state_d} onChange={handleChange} className="w-full border rounded p-2">
                    <option value="">Departamento</option>
                    {ciudades.map((c) => (
                        <option key={c.id_state} value={c.id_state}>{c.id_state}</option>
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

export default NuevaRuta;
