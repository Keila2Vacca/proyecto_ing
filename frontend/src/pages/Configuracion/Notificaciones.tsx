import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";
import { Link } from "react-router-dom";

const Notificaciones = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    systemAnnouncements: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Preferencias de notificación actualizadas");
    // Aquí podrías guardar en Supabase o en user_metadata si lo deseas
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
        <Button variant="ghost" onClick={() => navigate('/configuracion')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Configuración
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Administre sus preferencias de alerta</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Alertas por correo electrónico</Label>
              <Switch checked={settings.emailAlerts} onCheckedChange={() => handleToggle("emailAlerts")} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Alertas por SMS</Label>
              <Switch checked={settings.smsAlerts} onCheckedChange={() => handleToggle("smsAlerts")} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Anuncios del sistema</Label>
              <Switch checked={settings.systemAnnouncements} onCheckedChange={() => handleToggle("systemAnnouncements")} />
            </div>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notificaciones;
