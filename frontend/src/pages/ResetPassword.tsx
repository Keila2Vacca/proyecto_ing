// src/pages/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; 
import imagotipo from "@/assets/imagotipo.png";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Obtener parámetros de la URL
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  // IMPORTANTE: Para el flujo de Supabase, el token viene como '#access_token=...'
  useEffect(() => {
    const verifyTokenAndSession = async () => {
      // Extraer token del hash si viene en ese formato
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const hashType = params.get('type');
      
      // Usar el token del hash si existe, sino usar los query params normales
      const finalToken = accessToken || token;
      const finalType = hashType || type;
      
      if (!finalToken || finalType !== 'recovery') {
        toast.error("Enlace de recuperación inválido o expirado");
        setIsValidToken(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Intentar establecer la sesión con el token de recuperación
        const { data, error } = await supabase.auth.setSession({
          access_token: finalToken,
          refresh_token: refreshToken || ''
        });

        if (error) {
          console.error("Error estableciendo sesión:", error);
          
          // Si falla, intentar otra forma de verificación
          try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: finalToken,
              type: 'recovery'
            });
            
            if (verifyError) throw verifyError;
            
            setIsValidToken(true);
            toast.success("Token verificado correctamente");
          } catch (verifyError: any) {
            throw verifyError;
          }
          return;
        }

        // Si llegamos aquí, la sesión se estableció correctamente
        setIsValidToken(true);
        toast.success("Sesión de recuperación establecida");
        
      } catch (error: any) {
        console.error("Error verificando token:", error);
        toast.error(error.message || "El enlace ha expirado o es inválido");
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyTokenAndSession();
  }, [token, type]);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!password || !confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    if (password.length < 8) { // Igual que en registro
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    
    try {
      // Actualizar la contraseña en Supabase
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Éxito - cerrar sesión de recuperación
      await supabase.auth.signOut();
      
      toast.success("¡Contraseña actualizada exitosamente!");
      setIsSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error: any) {
      console.error("Error actualizando contraseña:", error);
      toast.error(error.message || "Error al actualizar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // Si el token no es válido
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-mountain relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <AccessibilityControls />
        </div>
        
        <Card className="w-full max-w-md shadow-elevated animate-fade-in relative z-10">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center mb-2">
              <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-24 object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold">Enlace Inválido</CardTitle>
            <CardDescription className="text-base">
              Este enlace de recuperación ha expirado o es inválido.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-6">
                Solicita un nuevo enlace desde la página de recuperación.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/password-recovery">
                  <Button variant="brand" className="w-full">
                    Solicitar nuevo enlace
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si se actualizó exitosamente
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-mountain relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md shadow-elevated animate-fade-in relative z-10">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center mb-2">
              <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-24 object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold">¡Contraseña Actualizada!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4 py-6">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-muted-foreground">
                Tu contraseña ha sido actualizada exitosamente.
              </p>
              <p className="text-sm text-muted-foreground">
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>
            
            <div className="pt-4">
              <Link to="/login" className="w-full">
                <Button variant="brand" className="w-full">
                  Ir al inicio de sesión ahora
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-mountain relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-elevated animate-fade-in relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center mb-2">
            <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-24 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold">Nueva Contraseña</CardTitle>
          <CardDescription className="text-base">
            {isLoading ? "Verificando tu enlace..." : "Crea una nueva contraseña para tu cuenta"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 transition-smooth"
                  required
                  disabled={isLoading || isValidToken === false}
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Debe tener al menos 8 caracteres, igual que en el registro
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 transition-smooth"
                  required
                  disabled={isLoading || isValidToken === false}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              variant="brand"
              disabled={isLoading || isValidToken === false}
              size="lg"
            >
              {isLoading ? "Procesando..." : "Establecer Nueva Contraseña"}
            </Button>
            
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-smooth w-full"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;