import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import imagotipo from "@/assets/imagotipo.png";

const NuevoPasajero = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [form, setForm] = useState({
    document_passenger: "",
    name_1: "",
    name_2: "",
    last_name_1: "",
    last_name_2: "",
    phone: "",
    gender: "",
    birthdate: "",
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.document_passenger) return "El documento es obligatorio";
    if (form.document_passenger.length > 17) return "El documento no puede superar 17 caracteres";

    if (!form.name_1) return "El primer nombre es obligatorio";
    if (form.name_1.length > 15) return "El primer nombre no puede superar 15 caracteres";

    if (!form.last_name_1) return "El primer apellido es obligatorio";
    if (form.last_name_1.length > 15) return "El primer apellido no puede superar 15 caracteres";

    if (!form.phone) return "El teléfono es obligatorio";
    if (form.phone.length > 12) return "El teléfono no puede superar 12 caracteres";

    if (!form.gender) return "Debe seleccionar género";
    if (form.gender !== "M" && form.gender !== "F") return "El género debe ser M o F";

    if (!form.birthdate) return "Debe seleccionar fecha de nacimiento";

    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    console.log("Insertando pasajero:", form);

    const { error } = await supabase.from("passenger").insert([form]);
    if (error) {
      toast.error("Error al crear pasajero");
      console.error(error);
    } else {
      toast.success("Pasajero creado exitosamente");
      navigate("/pasajeros");
    }
  };

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
                <CardTitle>Nuevo Pasajero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Documento</Label>
                  <Input name="document_passenger" value={form.document_passenger} onChange={handleChange} />
                </div>
                <div>
                  <Label>Primer Nombre</Label>
                  <Input name="name_1" value={form.name_1} onChange={handleChange} />
                </div>
                <div>
                  <Label>Segundo Nombre</Label>
                  <Input name="name_2" value={form.name_2} onChange={handleChange} />
                </div>
                <div>
                  <Label>Primer Apellido</Label>
                  <Input name="last_name_1" value={form.last_name_1} onChange={handleChange} />
                </div>
                <div>
                  <Label>Segundo Apellido</Label>
                  <Input name="last_name_2" value={form.last_name_2} onChange={handleChange} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div>
                  <Label>Género</Label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <div>
                  <Label>Fecha de Nacimiento</Label>
                  <Input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
                </div>
                <Button onClick={handleSubmit}>Guardar</Button>
              </CardContent>
            </Card>
          </div>
        </div>
  );
};

export default NuevoPasajero;
