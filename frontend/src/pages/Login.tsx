import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Login page component with authentication form
 * Features: Email/password login, password recovery, theme toggle
 */
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Verificar si ya está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    if (!formData.email || !formData.password) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales incorrectas. Verifique su correo y contraseña");
        } else {
          toast.error("Error al iniciar sesión: " + error.message);
        }
        return;
      }

      if (data.session) {
        toast.success("¡Bienvenido a COOTRANS Hacaritama!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Error inesperado al iniciar sesión");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-mountain relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <AccessibilityControls />
      </div>

      <Card className="w-full max-w-md shadow-elevated animate-fade-in relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center mb-2">
            <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-24 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription className="text-base">
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Email input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 transition-smooth"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <Link 
                  to="/recuperar-contrasena" 
                  className="text-xs text-primary hover:text-primary/80 transition-smooth font-medium"
                >
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 transition-smooth"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              variant="brand"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              ¿No tiene una cuenta?{" "}
              <Link 
                to="/registro" 
                className="text-primary font-medium hover:text-primary/80 transition-smooth"
              >
                Registrarse
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
