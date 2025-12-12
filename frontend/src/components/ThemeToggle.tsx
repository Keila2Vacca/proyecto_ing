import { Moon, Sun, Type, Contrast, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

/**
 * Componente mejorado de accesibilidad
 * Incluye: Tema, tamaño de fuente y alto contraste
 */
export function AccessibilityControls() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState(100); // Porcentaje
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Cargar preferencias desde localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const savedFontSize = localStorage.getItem("fontSize");
    const savedHighContrast = localStorage.getItem("highContrast");

    // Obtener tema del sistema
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    // Aplicar tamaño de fuente si existe guardado
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      applyFontSize(size);
    }

    // Aplicar alto contraste si está activado
    if (savedHighContrast === "true") {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
    // También actualizar las variables CSS para consistencia
    document.documentElement.style.setProperty('--font-size-base', `${size}%`);
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize.toString());
    applyFontSize(newSize);
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("highContrast", newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add("high-contrast");
      // Aplicar estilos de alto contraste
      document.documentElement.style.setProperty('--background', '0 0% 0%');
      document.documentElement.style.setProperty('--foreground', '0 0% 100%');
      document.documentElement.style.setProperty('--primary', '0 0% 100%');
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 0%');
    } else {
      document.documentElement.classList.remove("high-contrast");
      // Restaurar valores por defecto
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--foreground');
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-foreground');
    }
  };

  const resetAccessibility = () => {
    // Resetear a valores por defecto
    const defaultSize = 100;
    setFontSize(defaultSize);
    setHighContrast(false);
    
    localStorage.removeItem("fontSize");
    localStorage.removeItem("highContrast");
    
    applyFontSize(defaultSize);
    document.documentElement.classList.remove("high-contrast");
    
    // Restaurar todas las propiedades CSS
    const rootStyles = document.documentElement.style;
    rootStyles.removeProperty('--background');
    rootStyles.removeProperty('--foreground');
    rootStyles.removeProperty('--primary');
    rootStyles.removeProperty('--primary-foreground');
    rootStyles.removeProperty('--font-size-base');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón para tema claro/oscuro */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="rounded-full hover:bg-accent"
        aria-label="Cambiar tema"
        title="Cambiar entre tema claro y oscuro"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      {/* Menú de accesibilidad */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
            aria-label="Configuración de accesibilidad"
            title="Ajustes de accesibilidad"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2 text-sm font-semibold">
            <Settings className="h-4 w-4" />
            Accesibilidad
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Tamaño de texto - ESTO FUNCIONA */}
          <div className="px-2 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" />
                Tamaño del texto
              </span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                {fontSize}%
              </span>
            </div>
            <Slider
              value={[fontSize]}
              min={80}
              max={150}
              step={5}
              onValueChange={handleFontSizeChange}
              className="w-full cursor-pointer"
              aria-label="Ajustar tamaño de texto"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span className="text-xs">Pequeño</span>
              <span className="text-sm">Normal</span>
              <span className="text-base">Grande</span>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Alto contraste - MEJORADO */}
          <DropdownMenuItem 
            onClick={toggleHighContrast} 
            className="cursor-pointer hover:bg-accent"
            aria-label="Activar alto contraste"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <div>
                  <span className="font-medium">Alto contraste</span>
                  <p className="text-xs text-muted-foreground">
                    Mejora la visibilidad
                  </p>
                </div>
              </div>
              <div 
                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${highContrast ? 'bg-primary border-primary' : 'border-muted-foreground'}`}
              >
                {highContrast && <span className="text-[10px] text-primary-foreground">✓</span>}
              </div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Resetear */}
          <DropdownMenuItem 
            onClick={resetAccessibility} 
            className="cursor-pointer hover:bg-accent text-red-600 dark:text-red-400"
            aria-label="Restablecer preferencias"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium">Restablecer preferencias</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ThemeToggle() {
  return <AccessibilityControls />;
}