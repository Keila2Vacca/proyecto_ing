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

const EditarConductor = () => {
  const { epe_code } = useParams(); // epe_code
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
    const fetchConductor = async () => {
      const { data, error } = await supabase
        .from("employee")
        .select("*")
        .eq("epe_code", epe_code)
        .eq("type_employee", "D") // solo conductores
        .maybeSingle();

      if (error) {
        toast.error("Error al cargar conductor");
        console.error(error);
      } else if (!data) {
        toast.error(`No se encontró el conductor con código ${epe_code}`);
      } else {
        setForm(data);
      }
    };

    fetchConductor();
  }, [epe_code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const {
      epe_code,
      document_employee,
      name_1,
      last_name_1,
      phone,
      birthdate,
      gender,
      dvr_license,
      date_license,
    } = form;

    if (!document_employee || !name_1 || !last_name_1 || !phone || !birthdate || !gender || !dvr_license || !date_license) {
      toast.error("Todos los campos obligatorios deben completarse");
      return;
    }

    const { error } = await supabase
      .from("employee")
      .update({
        document_employee,
        name_1,
        name_2: form.name_2,
        last_name_1,
        last_name_2: form.last_name_2,
        phone,
        birthdate,
        gender,
        dvr_license,
        date_license,
      })
      .eq("epe_code", epe_code);

    if (error) {
      toast.error("Error al actualizar conductor");
      console.error(error);
    } else {
      toast.success("Conductor actualizado exitosamente");
      navigate("/conductores");
    }
  };

  if (!form) return <p className="text-center">Cargando conductor...</p>;

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
        <Button variant="ghost" onClick={() => navigate("/conductores")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Conductores
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Editar Conductor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Código empleado</Label>
              <Input name="epe_code" value={form.epe_code} disabled />
            </div>
            <div>
              <Label>Documento</Label>
              <Input name="document_employee" value={form.document_employee} onChange={handleChange} />
            </div>
            <div>
              <Label>Primer nombre</Label>
              <Input name="name_1" value={form.name_1} onChange={handleChange} />
            </div>
            <div>
              <Label>Segundo nombre</Label>
              <Input name="name_2" value={form.name_2 ?? ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Primer apellido</Label>
              <Input name="last_name_1" value={form.last_name_1} onChange={handleChange} />
            </div>
            <div>
              <Label>Segundo apellido</Label>
              <Input name="last_name_2" value={form.last_name_2 ?? ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <Label>Fecha nacimiento</Label>
              <Input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
            </div>
            <div>
              <Label>Género</Label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded p-2">
                <option value="">Seleccione género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div>
              <Label>Licencia de conducción</Label>
              <Input name="dvr_license" value={form.dvr_license ?? ""} onChange={handleChange} />
            </div>
            <div>
              <Label>Fecha de vencimiento licencia</Label>
              <Input type="date" name="date_license" value={form.date_license ?? ""} onChange={handleChange} />
            </div>
            <Button onClick={handleSubmit}>Actualizar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarConductor;
