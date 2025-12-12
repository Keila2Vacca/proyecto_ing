import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Tickets, 
  Users, 
  Bus, 
  MapPin, 
  Settings, 
  LogOut,
  Calendar,
  TrendingUp,
  UserRound,
  Earth,
  Menu,
  Phone,
  Mail,
  MapPin as MapIcon,
  Clock,
  MessageCircle,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import imagotipo from "@/assets/imagotipo.png";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userRole, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    pasajesHoy: 0,
    viajesActivos: 0,
    proximoViaje: "",
    ocupacionPromedio: 0
  });
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  // Cargar datos del dashboard
  useEffect(() => {
    cargarDashboardData();
  }, []);

  const cargarDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Obtener pasajes de hoy
      const hoy = new Date();
      const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
      
      const { data: pasajesHoyData, error: errorPasajes } = await supabase
        .from("pasajes")
        .select("id_pasaje")
        .gte("created_at", inicioDia.toISOString())
        .lt("created_at", finDia.toISOString());

      if (errorPasajes) {
        console.error("Error cargando pasajes de hoy:", errorPasajes);
      }

      // 2. Obtener viajes activos (hoy y futuros)
      const { data: viajesData, error: errorViajes } = await supabase
        .from("trip")
        .select("*")
        .gte("date", hoy.toISOString().split('T')[0])
        .order("date", { ascending: true })
        .order("departure_time", { ascending: true });

      if (errorViajes) {
        console.error("Error cargando viajes:", errorViajes);
      }

      // Calcular viajes activos (hoy y futuros)
      const viajesActivos = viajesData?.length || 0;
      
      // 3. Encontrar próximo viaje
      let proximoViaje = "No hay viajes";
      if (viajesData && viajesData.length > 0) {
        const proximo = viajesData[0];
        const fecha = new Date(proximo.date);
        const fechaFormateada = fecha.toLocaleDateString('es-CO', { 
          day: '2-digit', 
          month: 'short' 
        });
        proximoViaje = `${fechaFormateada} - ${proximo.departure_time}`;
      }

      // 4. Calcular ocupación promedio (estimar basado en pasajes vendidos)
      const { data: ocupacionData, error: errorOcupacion } = await supabase
        .from("pasajes")
        .select("*")
        .gte("created_at", new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate()).toISOString());

      if (!errorOcupacion && ocupacionData && viajesData) {
        // Estimación simple: pasajes vendidos vs capacidad total estimada
        const capacidadTotal = (viajesData.length * 40); // Asumiendo 40 asientos por bus
        const pasajesVendidos = ocupacionData.length;
        const ocupacion = capacidadTotal > 0 ? Math.round((pasajesVendidos / capacidadTotal) * 100) : 0;
        
        setDashboardData({
          pasajesHoy: pasajesHoyData?.length || 0,
          viajesActivos,
          proximoViaje,
          ocupacionPromedio: ocupacion
        });
      } else {
        setDashboardData({
          pasajesHoy: pasajesHoyData?.length || 0,
          viajesActivos,
          proximoViaje,
          ocupacionPromedio: 0
        });
      }

    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
      toast.error("Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Menú según rol
  const allMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ["administrador", "secretaria", "cliente"] },
    { icon: Tickets, label: "Reservar Pasaje", path: "/reservar", roles: ["administrador", "secretaria", "cliente"] },
    { icon: Users, label: "Pasajeros", path: "/pasajeros", roles: ["administrador", "secretaria", "cliente"] },
    { icon: Bus, label: "Vehículos", path: "/vehiculos", roles: ["administrador", "secretaria", "cliente"] },
    { icon: MapPin, label: "Rutas", path: "/rutas", roles: ["administrador", "secretaria", "cliente"] },
    { icon: Earth, label: "Viajes", path: "/viajes", roles: ["administrador", "secretaria", "cliente"] },
    { icon: UserRound, label: "Conductores", path: "/conductores", roles: ["administrador", "secretaria", "cliente"] },
    { icon: Tickets, label: "Pasajes", path: "/pasajes", roles: ["administrador", "secretaria", "cliente"] },
    { icon: Settings, label: "Configuración", path: "/configuracion", roles: ["administrador", "secretaria", "cliente"] },
  ];

  const menuItems = userRole ? allMenuItems.filter(item => item.roles.includes(userRole)) : [];

  // Stats con datos reales
  const stats = [
    { 
      label: "Pasajes Hoy", 
      value: dashboardData.pasajesHoy.toString(), 
      trend: loading ? "Cargando..." : "+0%", 
      icon: Tickets,
      color: "text-green-600"
    },
    { 
      label: "Viajes Activos", 
      value: dashboardData.viajesActivos.toString(), 
      trend: "En curso", 
      icon: Bus,
      color: "text-blue-600"
    },
    { 
      label: "Próximo Viaje", 
      value: dashboardData.proximoViaje, 
      trend: "Próximo", 
      icon: Calendar,
      color: "text-orange-600"
    },
    { 
      label: "Ocupación", 
      value: `${dashboardData.ocupacionPromedio}%`, 
      trend: "Promedio", 
      icon: TrendingUp,
      color: "text-purple-600"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={imagotipo} alt="Hacaritama" className="h-8 w-8" />
            <span className="font-semibold">COOTRANS Hacaritama</span>
          </div>

          <div className="flex items-center gap-3">
            <AccessibilityControls />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(prev => !prev)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-b bg-card">
          <div className="container mx-auto px-4 py-3 space-y-2">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 transition-smooth"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Contenido principal con sidebar al lado */}
      <div className="container mx-auto px-4 py-6 flex">
        {/* Sidebar Desktop - Card con el estilo original */}
        <aside className="hidden lg:block w-64 shrink-0 mr-8">
          <Card className="sticky top-24 shadow-md h-fit">
            <CardHeader>
              <CardTitle>Navegación</CardTitle>
              <CardDescription>Secciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 transition-smooth"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content - Toma el espacio restante */}
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
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded mt-2"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                    </>
                  )}
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
                      <Tickets className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle>Nueva Reserva</CardTitle>
                    <CardDescription>Reservar un pasaje para un nuevo pasajero</CardDescription>
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
                    <CardDescription>Ver y administrar información de pasajeros</CardDescription>
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
                    <CardDescription>Administrar flota y asignaciones de vehículos</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </div>
          </div>

          {/* Información de Sistema */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
              <CardDescription>Estado actual de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Tiempo de operación</p>
                      <p className="text-sm text-muted-foreground">24/7 Disponible</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Bus className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Vehículos activos</p>
                      <p className="text-sm text-muted-foreground">Total: 15 unidades</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <UserRound className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Conductores</p>
                      <p className="text-sm text-muted-foreground">25 conductores activos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Rutas activas</p>
                      <p className="text-sm text-muted-foreground">2 rutas disponibles</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Botón flotante del chatbot - Abre en nueva página */}
      <Button
        onClick={() => navigate('/chatbotpage')}
        className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-105 transition-all duration-200 z-50"
        size="icon"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="sr-only">Abrir chat</span>
      </Button>

      {/* Footer */}
      <footer className="bg-card border-t mt-12 z-40 relative">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={imagotipo} alt="Hacaritama" className="h-10 w-10" />
                <span className="font-bold text-lg">COOTRANS Hacaritama</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transporte intermunicipal seguro y confiable en el departamento de Norte de Santander.
              </p>
            </div>

            {/* Contacto */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contacto</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+57 316 6574964</span>
                  <span className="text-sm">+57 314 2157928</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">contacto@cootranshacaritama.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Oficinas en Ocaña y Ábrego</span>
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/reservar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Reservar pasaje
                  </Link>
                </li>
                <li>
                  <Link to="/rutas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Ver rutas
                  </Link>
                </li>
                <li>
                  <Link to="/viajes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Próximos viajes
                  </Link>
                </li>
                <li>
                  <Link to="/tarifas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Tarifas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Horarios */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Horarios de Atención</h3>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Lunes a Sabado</p>
                <p className="font-medium">5:00 AM - 7:00 PM</p>
                <p className="text-muted-foreground mt-2">Venta de pasajes</p>
                <p className="font-medium">24/7 Online</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} COOTRANS Hacaritama. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Sistema de Gestión de Pasajes v1.0 | Desarrollado por Karen Bayona y Keila Vacca para Norte de Santander
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;