import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import imagotipo from "@/assets/imagotipo.png";
import { supabase } from "@/integrations/supabase/client";

const Reservar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rutas, setRutas] = useState<any[]>([]);
  const [viajes, setViajes] = useState<any[]>([]);
  const [fechaViaje, setFechaViaje] = useState('');
  const [horaViaje, setHoraViaje] = useState('12:00');
  const [asientosOcupados, setAsientosOcupados] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name_1: '',
    name_2: '',
    last_name_1: '',
    last_name_2: '',
    document_passenger: '',
    phone: '',
    gender: '',
    birthdate: '',
    id_rute: '',
    id_trip: '', // Ahora sí seleccionamos un viaje
    seat_number: '',
    precio: 0,
  });

  useEffect(() => {
    cargarRutasDisponibles();
    cargarViajesDisponibles();
  }, []);

  useEffect(() => {
    if (formData.id_trip) {
      cargarAsientosOcupados(formData.id_trip);
    }
  }, [formData.id_trip]);

  const cargarRutasDisponibles = async () => {
    try {
      const { data, error } = await supabase.rpc("get_rutas");
      if (error) throw error;
      
      const rutasFormateadas = (data || []).map((ruta: any) => ({
        ...ruta,
        displayText: `${ruta.origen} → ${ruta.destino} - $${ruta.price?.toLocaleString()} COP`
      }));
      
      setRutas(rutasFormateadas);
      
    } catch (error) {
      console.error("Error cargando rutas:", error);
      toast.error("Error cargando rutas");
    }
  };

  const cargarViajesDisponibles = async () => {
    try {
      // Cargar viajes con capacidad disponible
      const { data, error } = await supabase
        .from("trip")
        .select(`
          id_trip,
          date,
          departure_time,
          id_state_trip,
          id_rute,
          plate,
          epe_code,
          rute:rute (
            price
          )
        `)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      
      setViajes(data || []);
      
    } catch (error) {
      console.error("Error cargando viajes:", error);
      // Si no hay viajes futuros, cargar todos
      const { data } = await supabase
        .from("trip")
        .select("*")
        .limit(10);
      
      setViajes(data || []);
    }
  };

  const cargarAsientosOcupados = async (idTrip: string) => {
    try {
      const { data, error } = await supabase
        .from("passage_detail")
        .select("seat_number")
        .eq("id_trip", idTrip);

      if (error) throw error;
      
      const asientos = new Set(data?.map(d => d.seat_number).filter(Boolean));
      setAsientosOcupados(asientos);
      
    } catch (error) {
      console.error("Error cargando asientos:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    
    if (field === 'id_rute') {
      const rutaSeleccionada = rutas.find(r => r.id_rute === value);
      if (rutaSeleccionada?.price) {
        newData.precio = rutaSeleccionada.price;
        newData.id_trip = ''; // Resetear viaje cuando cambia ruta
      }
    }
    
    if (field === 'id_trip') {
      const viajeSeleccionado = viajes.find(v => v.id_trip === value);
      if (viajeSeleccionado?.rute?.price) {
        newData.precio = viajeSeleccionado.rute.price;
      }
    }
    
    setFormData(newData);
  };

  const generarIdSale = async (): Promise<string> => {
    try {
      const { data: ultimaVenta } = await supabase
        .from("sale")
        .select("id_sale")
        .order("id_sale", { ascending: false })
        .limit(1)
        .single();

      let nuevoNumero = 1;
      if (ultimaVenta) {
        const match = ultimaVenta.id_sale.match(/SALE-(\d+)/);
        if (match) nuevoNumero = parseInt(match[1]) + 1;
      }

      return `SALE-${nuevoNumero.toString().padStart(4, '0')}`;
      
    } catch (error) {
      return `SALE-${Date.now().toString().slice(-6)}`;
    }
  };

  const generarConsecutivoUnico = async (idTrip: string): Promise<string> => {
    try {
      // Obtener todos los consecutivos existentes para este viaje
      const { data: pasajesExistentes } = await supabase
        .from("passage")
        .select("consecutivo")
        .eq("id_trip", idTrip)
        .order("consecutivo", { ascending: false });

      if (!pasajesExistentes || pasajesExistentes.length === 0) {
        return "1001";
      }

      // Encontrar el mayor número y sumar 1
      const numeros = pasajesExistentes.map(p => parseInt(p.consecutivo)).filter(n => !isNaN(n));
      const maxNumero = Math.max(...numeros);
      
      return (maxNumero + 1).toString();
      
    } catch (error) {
      console.error("Error generando consecutivo:", error);
      // Generar consecutivo basado en timestamp
      return Date.now().toString().slice(-6);
    }
  };

  const verificarDisponibilidadAsiento = (asiento: string): boolean => {
    if (!asiento.trim()) return true;
    return !asientosOcupados.has(asiento.trim().toUpperCase());
  };

  const crearNuevoViaje = async (idRute: string): Promise<string> => {
    try {
      const nuevoIdTrip = `TRP-${Date.now().toString().slice(-8)}`;
      
      // Buscar un estado de viaje disponible
      const { data: estados } = await supabase
        .from("state_trip")
        .select("id_state_trip")
        .limit(1)
        .single();

      const estadoTrip = estados?.id_state_trip || 'ACTIVE';

      const viajeData = {
        id_trip: nuevoIdTrip,
        date: fechaViaje || new Date().toISOString().split('T')[0],
        departure_time: horaViaje || '12:00:00',
        id_state_trip: estadoTrip,
        id_rute: idRute,
        plate: 'GEN-000',
        epe_code: 'EMP001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from("trip").insert(viajeData);
      if (error) throw error;

      return nuevoIdTrip;
      
    } catch (error) {
      console.error("Error creando nuevo viaje:", error);
      throw new Error("No se pudo crear un nuevo viaje");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    if (!formData.name_1 || !formData.last_name_1 || !formData.document_passenger || 
        !formData.phone || !formData.birthdate || !formData.id_rute || !formData.seat_number) {
      toast.error("Complete todos los campos requeridos (*)");
      return;
    }

    if (!formData.id_trip) {
      toast.error("Debe seleccionar un viaje");
      return;
    }
    
    // Solo pedir fechaViaje si NO hay viaje seleccionado (cuando se crea uno nuevo)
    if (!formData.id_trip && !fechaViaje) {
      toast.error("Seleccione una fecha de viaje");
      return;
    }

    // Si hay viaje seleccionado, usar su fecha
    if (formData.id_trip) {
      const viajeSeleccionado = viajes.find(v => v.id_trip === formData.id_trip);
      if (!viajeSeleccionado?.date) {
        toast.error("El viaje seleccionado no tiene fecha válida");
        return;
      }
    }
    // Validar que el asiento no esté ocupado
    if (!verificarDisponibilidadAsiento(formData.seat_number)) {
      toast.error(`El asiento ${formData.seat_number} ya está ocupado`);
      return;
    }

    setLoading(true);

    try {
      console.log("Iniciando creación de reserva...");

      // 1. Crear/actualizar pasajero
      const datosPasajero = {
        document_passenger: formData.document_passenger,
        name_1: formData.name_1,
        name_2: formData.name_2 || null,
        last_name_1: formData.last_name_1,
        last_name_2: formData.last_name_2 || null,
        phone: formData.phone,
        gender: formData.gender || null,
        birthdate: formData.birthdate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: errorPasajero } = await supabase
        .from("passenger")
        .upsert(datosPasajero, { onConflict: 'document_passenger' });
      
      if (errorPasajero) throw errorPasajero;

      // 2. Verificar que el viaje aún tenga capacidad
      const { count: asientosOcupadosCount } = await supabase
        .from("passage")
        .select("*", { count: 'exact', head: true })
        .eq("id_trip", formData.id_trip);

      if ((asientosOcupadosCount || 0) >= 11) {
        toast.error("Este viaje ya está completo. Por favor seleccione otro.");
        setLoading(false);
        return;
      }

      // 3. Generar IDs
      const idSale = await generarIdSale();
      const consecutivo = await generarConsecutivoUnico(formData.id_trip);

      console.log(`Generando pasaje: consecutivo=${consecutivo}, id_trip=${formData.id_trip}`);

      // 4. Verificar que el consecutivo+id_trip no exista ya
      const { data: pasajeExistente } = await supabase
        .from("passage")
        .select("consecutivo")
        .eq("consecutivo", consecutivo)
        .eq("id_trip", formData.id_trip)
        .single();

      if (pasajeExistente) {
        // Si ya existe, generar uno nuevo
        const nuevoConsecutivo = await generarConsecutivoUnico(formData.id_trip + "-alt");
        if (nuevoConsecutivo === consecutivo) {
          throw new Error("No se pudo generar un consecutivo único");
        }
        consecutivo = nuevoConsecutivo;
      }

      // 5. Obtener estado para pasaje
      const { data: estados } = await supabase
        .from("state_passage")
        .select("id_state_passage")
        .ilike("name", "%Comprado%")
        .limit(1)
        .single();
      
      const idStatePassage = estados?.id_state_passage || 'Comprado';

      // 6. Crear venta
      const ventaData = {
        id_sale: idSale,
        sale_date: new Date().toISOString().split('T')[0],
        quantity_passages: 1,
        total_amount: formData.precio,
        payment_method: 'Efectivo',
        document_passenger: formData.document_passenger,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: errorVenta } = await supabase
        .from("sale")
        .insert(ventaData);
      
      if (errorVenta) throw errorVenta;

      // 7. Crear pasaje
      const pasajeData = {
        consecutivo: consecutivo,
        id_trip: formData.id_trip,
        purchase_date: new Date().toISOString().split('T')[0],
        id_state_passage: idStatePassage,
        document_passenger: formData.document_passenger,
        id_sale: idSale,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Insertando pasaje:", pasajeData);

      const { error: errorPasaje } = await supabase
        .from("passage")
        .insert(pasajeData);
      
      if (errorPasaje) {
        console.error("Error detallado al crear pasaje:", errorPasaje);
        
        if (errorPasaje.code === '23505') { // Violación de clave única
          toast.error("Error: Ya existe un pasaje con estos datos. Intente nuevamente.");
          // Recargar la página para obtener nuevos IDs
          window.location.reload();
          return;
        }
        
        throw errorPasaje;
      }

      // 8. Crear detalle
      const detalleData = {
        line_item: "1",
        consecutivo: consecutivo,
        id_trip: formData.id_trip,
        seat_number: formData.seat_number.trim().toUpperCase(),
        price_paid: formData.precio,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: errorDetalle } = await supabase
        .from("passage_detail")
        .insert(detalleData);
      
      if (errorDetalle) throw errorDetalle;

      // 9. Guardar para pago
      const rutaSeleccionada = rutas.find(r => r.id_rute === formData.id_rute);
      const viajeSeleccionado = viajes.find(v => v.id_trip === formData.id_trip);
      
      sessionStorage.setItem('nuevoPasaje', JSON.stringify({
        pasaje: pasajeData,
        venta: ventaData,
        detalle: detalleData,
        passengerData: {
          nombre: `${formData.name_1} ${formData.name_2 || ''}`.trim(),
          apellido: `${formData.last_name_1} ${formData.last_name_2 || ''}`.trim(),
          documento: formData.document_passenger
        },
        viajeInfo: {
          ruta: rutaSeleccionada ? `${rutaSeleccionada.origen} → ${rutaSeleccionada.destino}` : '',
          fecha: viajeSeleccionado?.date || fechaViaje,
          hora: viajeSeleccionado?.departure_time || horaViaje,
          asiento: formData.seat_number,
          precio: formData.precio,
          id_trip: formData.id_trip
        }
      }));

      toast.success("Reserva creada exitosamente");
      navigate('/pago');
      
    } catch (error: any) {
      console.error("Error completo:", error);
      toast.error(`Error: ${error.message || "Error al crear reserva"}`);
    } finally {
      setLoading(false);
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

  // Filtrar viajes por ruta seleccionada
  const viajesFiltrados = formData.id_rute 
    ? viajes.filter(v => v.id_rute === formData.id_rute)
    : [];

  // Obtener capacidad disponible para cada viaje
  const getCapacidadDisponible = async (idTrip: string): Promise<number> => {
    try {
      const { count } = await supabase
        .from("passage")
        .select("*", { count: 'exact', head: true })
        .eq("id_trip", idTrip);
      
      return 40 - (count || 0); // Capacidad máxima de 40 asientos
    } catch (error) {
      return 40; // Valor por defecto
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <img src={imagotipo} alt="COOTRANS Hacaritama" className="h-10 object-contain" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Ticket className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Reservar Pasaje</CardTitle>
                <CardDescription>Complete el formulario para reservar un nuevo pasaje</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Pasajero */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información del Pasajero</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_1">Primer Nombre *</Label>
                    <Input
                      id="name_1"
                      value={formData.name_1}
                      onChange={(e) => handleInputChange('name_1', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="name_2">Segundo Nombre</Label>
                    <Input
                      id="name_2"
                      value={formData.name_2}
                      onChange={(e) => handleInputChange('name_2', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="last_name_1">Primer Apellido *</Label>
                    <Input
                      id="last_name_1"
                      value={formData.last_name_1}
                      onChange={(e) => handleInputChange('last_name_1', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="last_name_2">Segundo Apellido</Label>
                    <Input
                      id="last_name_2"
                      value={formData.last_name_2}
                      onChange={(e) => handleInputChange('last_name_2', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="document_passenger">Documento *</Label>
                    <Input
                      id="document_passenger"
                      value={formData.document_passenger}
                      onChange={(e) => handleInputChange('document_passenger', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Género</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthdate">Fecha de Nacimiento *</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => handleInputChange('birthdate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Información del Viaje */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información del Viaje</h3>
                
                {/* Selección de Ruta */}
                <div>
                  <Label htmlFor="id_rute">Ruta *</Label>
                  <Select 
                    value={formData.id_rute} 
                    onValueChange={(value) => handleInputChange('id_rute', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      {rutas.map((ruta) => (
                        <SelectItem key={ruta.id_rute} value={ruta.id_rute}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{ruta.origen} → {ruta.destino}</span>
                            <span className="text-sm text-muted-foreground">
                              ${ruta.price?.toLocaleString()} COP
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selección de Viaje */}
                {formData.id_rute && (
                  <div>
                    <Label htmlFor="id_trip">Viaje Disponible *</Label>
                    <Select 
                      value={formData.id_trip} 
                      onValueChange={(value) => handleInputChange('id_trip', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          viajesFiltrados.length === 0 
                            ? "No hay viajes para esta ruta" 
                            : "Seleccione un viaje"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {viajesFiltrados.map((viaje) => (
                          <SelectItem key={viaje.id_trip} value={viaje.id_trip}>
                            <div className="flex flex-col py-1">
                              <span className="font-medium">
                                {new Date(viaje.date).toLocaleDateString()} {viaje.departure_time}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Estado: {viaje.id_state_trip}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Fecha y Hora del Viaje (solo si no hay viajes disponibles) */}
                {formData.id_rute && viajesFiltrados.length === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha_viaje">Fecha del Viaje *</Label>
                      <Input
                        id="fecha_viaje"
                        type="date"
                        value={fechaViaje}
                        onChange={(e) => setFechaViaje(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hora_viaje">Hora del Viaje</Label>
                      <Input
                        id="hora_viaje"
                        type="time"
                        value={horaViaje}
                        onChange={(e) => setHoraViaje(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Asiento y Precio */}
                {formData.id_trip && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Detalles de la Reserva</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="seat_number">Número de Asiento *</Label>
                        <div className="space-y-2">
                          <Input
                            id="seat_number"
                            value={formData.seat_number}
                            onChange={(e) => handleInputChange('seat_number', e.target.value)}
                            placeholder="Ej: A12"
                            required
                            className={!verificarDisponibilidadAsiento(formData.seat_number) ? "border-red-500" : ""}
                          />
                          {formData.seat_number && !verificarDisponibilidadAsiento(formData.seat_number) && (
                            <div className="flex items-center gap-1 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              Este asiento ya está ocupado
                            </div>
                          )}
                          {asientosOcupados.size > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Asientos ocupados: {Array.from(asientosOcupados).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Precio Total</Label>
                        <div className="p-3 bg-white border rounded-lg">
                          <p className="font-bold text-lg text-blue-900">
                            ${formData.precio.toLocaleString()} COP
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Precio por persona
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={
                    loading || 
                    !formData.id_rute || 
                    !formData.seat_number || 
                    !formData.id_trip ||
                    !verificarDisponibilidadAsiento(formData.seat_number)
                  }
                >
                  {loading ? "Procesando..." : (
                    <>
                      <Ticket className="mr-2 h-4 w-4" />
                      Confirmar Reserva
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reservar;