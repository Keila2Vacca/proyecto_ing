# 📡 Documentación de API REST - Sistema Hacaritama

## 🎯 Información General

**Base URL:** `http://localhost:8080/api`  
**Versión:** 1.0.0  
**Formato:** JSON  
**Autenticación:** JWT Bearer Token

---

## 🔐 Autenticación

### POST /api/auth/register
Registrar nuevo usuario (cliente)

**Request Body:**
```json
{
  "tipoDocumento": "CC",
  "numeroDocumento": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "telefono": "+573001234567",
  "password": "Password123!"
}
```

**Response 201:**
```json
{
  "id": 1,
  "email": "juan@email.com",
  "nombre": "Juan Pérez",
  "rol": "CLIENTE",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST /api/auth/login
Iniciar sesión

**Request Body:**
```json
{
  "email": "juan@email.com",
  "password": "Password123!"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "juan@email.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "CLIENTE"
}
```

---

### POST /api/auth/refresh
Renovar token JWT

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

---

## 🗺️ Rutas

### GET /api/rutas
Listar todas las rutas activas

**Response 200:**
```json
[
  {
    "idRuta": 1,
    "origen": "Ábrego",
    "destino": "Cúcuta",
    "distanciaKm": 85.5,
    "duracionEstimada": "2:30:00",
    "precioBase": 18000.00,
    "activo": true
  }
]
```

---

### GET /api/rutas/{id}
Obtener ruta por ID

**Response 200:**
```json
{
  "idRuta": 1,
  "origen": "Ábrego",
  "destino": "Cúcuta",
  "distanciaKm": 85.5,
  "duracionEstimada": "2:30:00",
  "precioBase": 18000.00,
  "activo": true
}
```

---

### POST /api/rutas
Crear nueva ruta (ADMIN)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "origen": "Ábrego",
  "destino": "Pamplona",
  "distanciaKm": 60.0,
  "duracionEstimada": "1:45:00",
  "precioBase": 15000.00
}
```

**Response 201:**
```json
{
  "idRuta": 9,
  "origen": "Ábrego",
  "destino": "Pamplona",
  "distanciaKm": 60.0,
  "duracionEstimada": "1:45:00",
  "precioBase": 15000.00,
  "activo": true
}
```

---

## 🚌 Viajes

### GET /api/viajes
Buscar viajes disponibles

**Query Parameters:**
- `origen` (required): Ciudad de origen
- `destino` (required): Ciudad de destino
- `fecha` (required): Fecha del viaje (YYYY-MM-DD)
- `page` (optional): Número de página (default: 0)
- `size` (optional): Tamaño de página (default: 10)

**Example:**
```
GET /api/viajes?origen=Ábrego&destino=Cúcuta&fecha=2025-01-25
```

**Response 200:**
```json
{
  "content": [
    {
      "idViaje": 1,
      "fecha": "2025-01-25",
      "horaSalida": "06:00:00",
      "horaLlegadaEstimada": "08:30:00",
      "estado": "PROGRAMADO",
      "asientosDisponibles": 35,
      "precioBase": 18000.00,
      "ruta": {
        "origen": "Ábrego",
        "destino": "Cúcuta",
        "distanciaKm": 85.5
      },
      "vehiculo": {
        "placa": "ABC123",
        "tipo": "BUS",
        "marca": "Mercedes Benz",
        "capacidadAsientos": 40
      },
      "conductor": {
        "nombre": "Carlos Rodríguez",
        "telefono": "+573201111111"
      }
    }
  ],
  "totalElements": 8,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

---

### GET /api/viajes/{id}
Obtener detalles de un viaje

**Response 200:**
```json
{
  "idViaje": 1,
  "fecha": "2025-01-25",
  "horaSalida": "06:00:00",
  "horaLlegadaEstimada": "08:30:00",
  "estado": "PROGRAMADO",
  "asientosDisponibles": 35,
  "precioBase": 18000.00,
  "ruta": {
    "idRuta": 1,
    "origen": "Ábrego",
    "destino": "Cúcuta"
  },
  "vehiculo": {
    "idVehiculo": 1,
    "placa": "ABC123",
    "capacidadAsientos": 40
  },
  "conductor": {
    "idConductor": 1,
    "nombre": "Carlos Rodríguez"
  }
}
```

---

### GET /api/viajes/{id}/asientos
Obtener mapa de asientos de un viaje

**Response 200:**
```json
{
  "idViaje": 1,
  "capacidadTotal": 40,
  "asientosDisponibles": 35,
  "asientosOcupados": [5, 10, 11, 17, 24],
  "mapaAsientos": [
    {"numero": 1, "estado": "DISPONIBLE"},
    {"numero": 2, "estado": "DISPONIBLE"},
    {"numero": 3, "estado": "DISPONIBLE"},
    {"numero": 4, "estado": "DISPONIBLE"},
    {"numero": 5, "estado": "OCUPADO"},
    {"numero": 6, "estado": "DISPONIBLE"}
  ]
}
```

---

### POST /api/viajes
Crear nuevo viaje (ADMIN)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "idRuta": 1,
  "idVehiculo": 1,
  "idConductor": 1,
  "fecha": "2025-01-26",
  "horaSalida": "06:00:00",
  "horaLlegadaEstimada": "08:30:00",
  "precioBase": 18000.00
}
```

**Response 201:**
```json
{
  "idViaje": 25,
  "fecha": "2025-01-26",
  "horaSalida": "06:00:00",
  "estado": "PROGRAMADO",
  "asientosDisponibles": 40,
  "precioBase": 18000.00
}
```

---

## 🎫 Ventas y Pasajes

### POST /api/ventas
Crear venta y comprar pasaje

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "idViaje": 1,
  "numeroAsiento": 14,
  "metodoPago": "TARJETA",
  "datosComprador": {
    "tipoDocumento": "CC",
    "numeroDocumento": "1234567890",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@email.com",
    "telefono": "+573001234567"
  },
  "datosPago": {
    "numeroTarjeta": "4111111111111111",
    "nombreTitular": "JUAN PEREZ",
    "fechaVencimiento": "12/26",
    "cvv": "123"
  }
}
```

**Response 201:**
```json
{
  "idVenta": 6,
  "fechaVenta": "2025-01-25T10:30:00",
  "total": 18000.00,
  "metodoPago": "TARJETA",
  "estado": "COMPLETADA",
  "referenciaPago": "TRX-2025-000123",
  "pasaje": {
    "idPasaje": 9,
    "numeroAsiento": 14,
    "precio": 18000.00,
    "codigoQr": "HAC-2025-000009-QR",
    "viaje": {
      "fecha": "2025-01-25",
      "horaSalida": "06:00:00",
      "origen": "Ábrego",
      "destino": "Cúcuta"
    }
  }
}
```

---

### GET /api/pasajes/{id}
Obtener pasaje por ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "idPasaje": 1,
  "numeroAsiento": 5,
  "precio": 18000.00,
  "estado": "ACTIVO",
  "codigoQr": "HAC-2025-000001-QR",
  "fechaEmision": "2025-01-25T08:00:00",
  "pasajero": {
    "nombre": "Juan Pérez",
    "documento": "1234567890",
    "email": "juan@email.com"
  },
  "viaje": {
    "fecha": "2025-01-25",
    "horaSalida": "06:00:00",
    "horaLlegadaEstimada": "08:30:00",
    "origen": "Ábrego",
    "destino": "Cúcuta",
    "vehiculo": "ABC123"
  }
}
```

---

### GET /api/pasajes/mis-pasajes
Obtener pasajes del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `estado` (optional): ACTIVO, ANULADO, USADO
- `page` (optional): Número de página
- `size` (optional): Tamaño de página

**Response 200:**
```json
{
  "content": [
    {
      "idPasaje": 1,
      "numeroAsiento": 5,
      "precio": 18000.00,
      "estado": "ACTIVO",
      "fechaEmision": "2025-01-25T08:00:00",
      "viaje": {
        "fecha": "2025-01-25",
        "horaSalida": "06:00:00",
        "origen": "Ábrego",
        "destino": "Cúcuta"
      }
    }
  ],
  "totalElements": 5,
  "totalPages": 1
}
```

---

### PUT /api/pasajes/{id}/anular
Anular un pasaje

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "motivo": "Cambio de planes del pasajero"
}
```

**Response 200:**
```json
{
  "idPasaje": 1,
  "estado": "ANULADO",
  "fechaAnulacion": "2025-01-25T11:00:00",
  "motivoAnulacion": "Cambio de planes del pasajero",
  "reembolso": {
    "monto": 18000.00,
    "metodoPago": "TARJETA",
    "tiempoEstimado": "5-7 días hábiles"
  }
}
```

---

### GET /api/pasajes/{id}/pdf
Descargar pasaje en PDF

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="pasaje-HAC-2025-000001.pdf"

[Binary PDF content]
```

---

## 👥 Pasajeros

### GET /api/pasajeros
Listar pasajeros (ADMIN, SECRETARIA)

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional): Buscar por nombre, documento o email
- `rol` (optional): Filtrar por rol
- `page`, `size`: Paginación

**Response 200:**
```json
{
  "content": [
    {
      "idPasajero": 1,
      "tipoDocumento": "CC",
      "numeroDocumento": "1234567890",
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@email.com",
      "telefono": "+573001234567",
      "rol": "CLIENTE",
      "fechaRegistro": "2025-01-20T10:00:00"
    }
  ],
  "totalElements": 50,
  "totalPages": 5
}
```

---

### GET /api/pasajeros/{id}
Obtener pasajero por ID

**Response 200:**
```json
{
  "idPasajero": 1,
  "tipoDocumento": "CC",
  "numeroDocumento": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "telefono": "+573001234567",
  "rol": "CLIENTE",
  "fechaRegistro": "2025-01-20T10:00:00",
  "totalViajes": 5,
  "totalGastado": 90000.00
}
```

---

## 🚗 Vehículos

### GET /api/vehiculos
Listar vehículos (ADMIN)

**Response 200:**
```json
[
  {
    "idVehiculo": 1,
    "placa": "ABC123",
    "tipo": "BUS",
    "marca": "Mercedes Benz",
    "modelo": "OF-1721",
    "anio": 2020,
    "capacidadAsientos": 40,
    "estado": "DISPONIBLE"
  }
]
```

---

### POST /api/vehiculos
Crear vehículo (ADMIN)

**Request Body:**
```json
{
  "placa": "PQR456",
  "tipo": "BUSETA",
  "marca": "Chevrolet",
  "modelo": "NPR",
  "anio": 2023,
  "capacidadAsientos": 30
}
```

---

## 👨‍✈️ Conductores

### GET /api/conductores
Listar conductores (ADMIN)

**Response 200:**
```json
[
  {
    "idConductor": 1,
    "numeroDocumento": "10111213",
    "nombre": "Carlos",
    "apellido": "Rodríguez",
    "numeroLicencia": "LIC001234",
    "categoriaLicencia": "C2",
    "telefono": "+573201111111",
    "activo": true
  }
]
```

---

## 📊 Reportes

### GET /api/reportes/ventas
Reporte de ventas (ADMIN)

**Query Parameters:**
- `fechaInicio` (required): YYYY-MM-DD
- `fechaFin` (required): YYYY-MM-DD

**Response 200:**
```json
{
  "periodo": {
    "inicio": "2025-01-01",
    "fin": "2025-01-31"
  },
  "totalVentas": 150,
  "totalIngresos": 2700000.00,
  "ventasPorDia": [
    {"fecha": "2025-01-25", "cantidad": 45, "monto": 810000.00}
  ],
  "ventasPorRuta": [
    {"ruta": "Ábrego → Cúcuta", "cantidad": 80, "monto": 1440000.00}
  ],
  "ventasPorMetodoPago": [
    {"metodo": "TARJETA", "cantidad": 90, "porcentaje": 60.0}
  ]
}
```

---

### GET /api/reportes/ocupacion
Reporte de ocupación (ADMIN)

**Response 200:**
```json
{
  "promedioOcupacion": 75.5,
  "viajesCompletos": 12,
  "viajesBajaOcupacion": 3,
  "ocupacionPorRuta": [
    {
      "ruta": "Ábrego → Cúcuta",
      "promedioOcupacion": 80.2,
      "totalViajes": 50
    }
  ]
}
```

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Asiento ya ocupado |
| 422 | Unprocessable Entity - Validación fallida |
| 500 | Internal Server Error |

**Formato de Error:**
```json
{
  "timestamp": "2025-01-25T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El asiento 5 ya está ocupado en este viaje",
  "path": "/api/ventas"
}
```

---

## 🔒 Autorización por Rol

| Endpoint | CLIENTE | SECRETARIA | ADMIN |
|----------|---------|------------|-------|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| GET /api/viajes | ✅ | ✅ | ✅ |
| POST /api/ventas | ✅ | ✅ | ✅ |
| GET /api/pasajes/mis-pasajes | ✅ | ❌ | ❌ |
| PUT /api/pasajes/{id}/anular | ✅ | ✅ | ✅ |
| POST /api/viajes | ❌ | ❌ | ✅ |
| POST /api/vehiculos | ❌ | ❌ | ✅ |
| GET /api/reportes/* | ❌ | ❌ | ✅ |

---

## 📝 Notas Importantes

1. **Todos los endpoints requieren Content-Type: application/json**
2. **Las fechas usan formato ISO 8601**
3. **Los precios están en pesos colombianos (COP)**
4. **Los tokens JWT expiran en 24 horas**
5. **La paginación por defecto es de 10 elementos**
6. **Los asientos se numeran desde 1 hasta la capacidad del vehículo**
