import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import imagotipo from "@/assets/imagotipo.png";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";


const EditarPasajero = () => {
  const { document_passenger } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [form, setForm] = useState(null);

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
      const { data, error } = await supabase
        .from("passenger")
        .select("*")
        .eq("document_passenger", document_passenger)
        .single();

      if (error) {
        toast.error("Error al cargar pasajero");
        console.error(error);
      } else {
        setForm(data);
      }
    };

    fetchData();
  }, [document_passenger]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("passenger")
      .update(form)
      .eq("document_passenger", document_passenger);

    if (error) {
      toast.error("Error al actualizar pasajero");
      console.error(error);
    } else {
      toast.success("Pasajero actualizado");
      navigate("/pasajeros");
    }
  };

  if (!form) return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="min-h-screen bg-background">
              {/* Header */}
              <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
                <div className="container mx-auto px-4">
                  <div className="flex h-16 items-center justify-between">
                    <Link to="/dashboard">
                      <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
                    </Link>
                    <div className="flex items-center gap-2">
                      <AccessibilityControls  />
                      <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </header>
        
              <div className="container mx-auto px-4 py-8 max-w-xl">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Dashboard
                </Button>
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Pasajero</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["name_1", "name_2", "last_name_1", "last_name_2", "phone", "birthdate"].map((field) => (
                      <div key={field}>
                        <Label>{field.replace(/_/g, " ")}</Label>
                        <Input name={field} value={form[field]} onChange={handleChange} />
                      </div>
                    ))}
                    <div>
                      <Label>Género</Label>
                      <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-2 py-1">
                        <option value="">Seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                    <Button onClick={handleUpdate}>Actualizar</Button>
                  </CardContent>
                </Card>
              </div>
      </div>
  );
};

export default EditarPasajero;
