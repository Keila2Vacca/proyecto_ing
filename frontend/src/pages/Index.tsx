import { Button } from "@/components/ui/button";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { ArrowRight, Ticket, Shield, Clock, Smartphone } from "lucide-react";
import imagotipo from "@/assets/imagotipo.png";

/**
 * Landing page component
 * Welcome page with company information and call-to-action buttons
 */
const Index = () => {
  const features = [
    {
      icon: Ticket,
      title: "Reserva en Línea",
      description: "Reserve sus pasajes de manera rápida y segura desde cualquier lugar"
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Viaje con tranquilidad en nuestros vehículos certificados y conductores profesionales"
    },
    {
      icon: Clock,
      title: "Disponibilidad 24/7",
      description: "Acceda a nuestro sistema en cualquier momento del día"
    },
    {
      icon: Smartphone,
      title: "Desde Cualquier Dispositivo",
      description: "Compatible con computadoras, tablets y smartphones"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-mountain text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <AccessibilityControls />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
            <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-32 md:h-40 object-contain" />
            
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Viaje Seguro y Confiable
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                La seguridad y calidad de servicio van de la mano
              </p>
              <p className="text-lg text-white/80">
                Transporte intermunicipal Ábrego - Ocaña y más destinos
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/registro">
                <Button size="lg" variant="accent" className="text-lg px-8 shadow-elevated">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/30 hover:bg-white/20 text-white">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Por qué elegir COOTRANS Hacaritama?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Somos una cooperativa de transporte comprometida con su seguridad y comodidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg border bg-card hover:shadow-elevated transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-mountain text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Listo para viajar con nosotros?
            </h2>
            <p className="text-lg text-white/90">
              Únase a miles de pasajeros satisfechos que confían en COOTRANS Hacaritama
            </p>
            <div className="pt-4">
              <Link to="/registro">
                <Button size="lg" variant="accent" className="text-lg px-8 shadow-elevated">
                  Crear Cuenta Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 COOTRANS Hacaritama. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">Ábrego, Norte de Santander - Colombia</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
