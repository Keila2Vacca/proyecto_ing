import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";

import Dashboard from "./pages/Dashboard";
import Reservar from "./pages/Reservar";
import Pasajeros from "./pages/Pasajeros/Pasajeros";
import Nuevo from "./pages/Pasajeros/Nuevo";
import Editar from "./pages/Pasajeros/Editar";
import Vehiculos from "./pages/Vehiculos/Vehiculos";
import NuevoV from "./pages/Vehiculos/NuevoV";
import EditarV from "./pages/Vehiculos/EditarV";
import Rutas from "./pages/Rutas/Rutas";
import NuevoR from "./pages/Rutas/NuevoR";
import EditarR from "./pages/Rutas/EditarR";
import Pago from "./pages/Pago";
import Factura from "./pages/Factura";
import ChatBot from "./components/chat/ChatBot";
import Configuracion from "./pages/Configuracion/Configuracion";
import Seguridad from "./pages/Configuracion/Seguridad";
import EditarPerfil from "./pages/Configuracion/EditarPerfil";
import Notificaciones from "./pages/Configuracion/Notificaciones";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          {/* Páginas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/factura" element={<Factura />} />
          <Route path="/chat/chatbot" element={<ChatBot />} />
          <Route path="/pasajeros/nuevo" element={<Nuevo />} />
          <Route path="/pasajeros/editar/:document_passenger" element={<Editar />} />
          <Route path="/vehiculos/nuevov" element={<NuevoV />} />
          <Route path="/vehiculos/editarv/:plate" element={<EditarV />} />
          <Route path="/rutas/nuevor" element={<NuevoR />} />
          <Route path="/rutas/editarr/:id_rute" element={<EditarR />} />
          <Route path="/configuracion/editarperfil" element={<EditarPerfil />} />
          <Route path="/configuracion/notificaciones" element={<Notificaciones />} />
          <Route path="/configuracion/seguridad" element={<Seguridad />} />


          {/* Rutas protegidas - cualquier usuario autenticado */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reservar" 
            element={
              <ProtectedRoute>
                <Reservar />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configuracion" 
            element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            } 
          />

          {/* Rutas protegidas SOLO PARA ADMIN Y SECRETARIA */}
          <Route 
            path="/pasajeros" 
            element={
              <ProtectedRoute requireAdmin>
                <Pasajeros />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/vehiculos" 
            element={
              <ProtectedRoute requireAdmin>
                <Vehiculos />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/rutas" 
            element={
              <ProtectedRoute requireAdmin>
                <Rutas />
              </ProtectedRoute>
            }
          />

          {/* Debe ir al final */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
