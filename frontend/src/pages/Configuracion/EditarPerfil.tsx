import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { ArrowLeft, User } from "lucide-react";
import imagotipo from "@/assets/imagotipo.png";
import { Link } from "react-router-dom";


const EditarPerfil = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email || "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateEmail = async () => {
    if (!form.email || form.email === user?.email) {
      toast.info("No hay cambios en el correo");
      return;
    }

    const { error } = await supabase.auth.updateUser({ email: form.email });
    if (error) {
      toast.error("Error al actualizar correo");
      console.error(error);
    } else {
      toast.success("Correo actualizado. Revisa tu bandeja para confirmar el cambio.");
    }
  };

  const handleUpdatePassword = async () => {
    if (!form.newPassword || form.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: form.newPassword });
    if (error) {
      toast.error("Error al actualizar contraseña");
      console.error(error);
    } else {
      toast.success("Contraseña actualizada exitosamente");
      setForm({ ...form, newPassword: "", confirmPassword: "" });
    }
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
              <AccessibilityControls />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Button variant="ghost" onClick={() => navigate('/configuracion')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Configuración
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Editar Perfil</CardTitle>
                <CardDescription>Actualice su correo y contraseña</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Actualizar correo */}
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input name="email" value={form.email} onChange={handleChange} />
              <Button onClick={handleUpdateEmail}>Actualizar correo</Button>
            </div>

            {/* Actualizar contraseña */}
            <div className="space-y-2">
              <Label>Nueva contraseña</Label>
              <Input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
              <Label>Confirmar contraseña</Label>
              <Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
              <Button onClick={handleUpdatePassword}>Actualizar contraseña</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarPerfil;
