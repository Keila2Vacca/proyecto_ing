import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Password recovery page component
 * Allows users to request a password reset link via email
 */
const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Handle password recovery request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }

    setIsLoading(true);
    
    // Simulate sending recovery email (replace with actual API call)
    setTimeout(() => {
      setEmailSent(true);
      toast.success("Correo de recuperación enviado exitosamente");
      setIsLoading(false);
    }, 1500);
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
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-elevated animate-fade-in relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center mb-2">
            <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-24 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription className="text-base">
            {emailSent 
              ? "Hemos enviado instrucciones a su correo electrónico"
              : "Ingrese su correo para recibir instrucciones de recuperación"
            }
          </CardDescription>
        </CardHeader>
        
        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-smooth"
                    required
                  />
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
                {isLoading ? "Enviando..." : "Enviar Instrucciones"}
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
        ) : (
          <CardContent className="space-y-6">
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-muted-foreground">
                Revise su bandeja de entrada y siga las instrucciones para restablecer su contraseña.
              </p>
              <p className="text-sm text-muted-foreground">
                Si no recibe el correo en unos minutos, revise su carpeta de spam.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                Intentar con otro correo
              </Button>
              <Link to="/login" className="w-full">
                <Button variant="brand" className="w-full">
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PasswordRecovery;
