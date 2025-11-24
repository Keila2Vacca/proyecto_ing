import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Bus, 
  MapPin, 
  Settings, 
  LogOut,
  Calendar,
  TrendingUp,
  Menu
} from "lucide-react";
import { useState } from "react";
import imagotipo from "@/assets/imagotipo.png";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

/**
 * Main dashboard component after successful login
 * Features: Navigation menu, quick stats, and main action cards
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { userRole, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  // Navigation menu items filtrados por rol
  const allMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ['administrador', 'secretaria', 'cliente'] },
    { icon: Ticket, label: "Reservar Pasaje", path: "/reservar", roles: ['administrador', 'secretaria', 'cliente'] },
    { icon: Users, label: "Pasajeros", path: "/pasajeros", roles: ['administrador', 'secretaria'] },
    { icon: Bus, label: "Vehículos", path: "/vehiculos", roles: ['administrador', 'secretaria'] },
    { icon: MapPin, label: "Rutas", path: "/rutas", roles: ['administrador', 'secretaria'] },
    { icon: Settings, label: "Configuración", path: "/configuracion", roles: ['administrador', 'secretaria', 'cliente'] },
  ];

  // Filtrar menú según rol del usuario
  const menuItems = allMenuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  // Quick stats data
  const stats = [
    { label: "Pasajes Hoy", value: "24", trend: "+12%", icon: Ticket },
    { label: "Viajes Activos", value: "3", trend: "En curso", icon: Bus },
    { label: "Próximo Viaje", value: "14:30", trend: "Hoy", icon: Calendar },
    { label: "Ocupación", value: "78%", trend: "+5%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-accent rounded-md transition-smooth"
              >
                <Menu className="h-6 w-6" />
              </button>
              <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="rounded-full"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur animate-fade-in">
          <nav className="container mx-auto px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-smooth"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="sticky top-24 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Menú Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 hover:bg-accent"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Bienvenido a COOTRANS Hacaritama
              </h1>
              <p className="text-muted-foreground text-lg">
                Sistema de gestión de pasajes intermunicipales
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-smooth">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="shadow-md hover:shadow-elevated transition-smooth cursor-pointer group">
                  <Link to="/reservar">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-smooth">
                        <Ticket className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <CardTitle>Nueva Reserva</CardTitle>
                      <CardDescription>
                        Reservar un pasaje para un nuevo pasajero
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="shadow-md hover:shadow-elevated transition-smooth cursor-pointer group">
                  <Link to="/pasajeros">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-3 group-hover:bg-secondary/30 transition-smooth">
                        <Users className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <CardTitle>Gestionar Pasajeros</CardTitle>
                      <CardDescription>
                        Ver y administrar información de pasajeros
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="shadow-md hover:shadow-elevated transition-smooth cursor-pointer group">
                  <Link to="/vehiculos">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-smooth">
                        <Bus className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle>Gestionar Vehículos</CardTitle>
                      <CardDescription>
                        Administrar flota y asignaciones de vehículos
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas operaciones realizadas en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Pasaje reservado", user: "Juan Pérez", time: "Hace 5 min", status: "success" },
                    { action: "Viaje completado", user: "Ruta Ábrego-Ocaña", time: "Hace 15 min", status: "success" },
                    { action: "Nuevo pasajero registrado", user: "María García", time: "Hace 1 hora", status: "info" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="space-y-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
