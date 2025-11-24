# 🏗️ Arquitectura del Sistema - Hacaritama

## 📐 Visión General

Sistema web de tres capas con arquitectura Cliente-Servidor basada en API REST.

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React 18 + Vite (SPA)                      │   │
│  │  - Componentes reutilizables                         │   │
│  │  - React Router (navegación)                         │   │
│  │  - Context API (estado global)                       │   │
│  │  - Axios (HTTP client)                               │   │
│  │  - Tailwind CSS (estilos)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕ HTTP/JSON + JWT                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Spring Boot 3.x (API REST)                    │   │
│  │                                                       │   │
│  │  Controllers ─→ Services ─→ Repositories             │   │
│  │       ↓             ↓              ↓                  │   │
│  │    DTOs        Business        Entities              │   │
│  │               Logic                                   │   │
│  │                                                       │   │
│  │  - Spring Security (JWT)                             │   │
│  │  - Spring Data JPA                                   │   │
│  │  - Bean Validation                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕ JPA/JDBC                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL 14+                          │   │
│  │                                                       │   │
│  │  - 7 tablas principales                              │   │
│  │  - Constraints (PK, FK, UNIQUE)                      │   │
│  │  - Triggers (actualización de asientos)              │   │
│  │  - Stored Procedures (reportes)                      │   │
│  │  - Views (consultas complejas)                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Patrón de Arquitectura: MVC + Capas

### Frontend (React)
```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Botones, inputs, cards
│   ├── layout/         # Header, Footer, Sidebar
│   └── features/       # Componentes específicos de dominio
├── pages/              # Páginas/Vistas
├── services/           # Llamadas a API
├── hooks/              # Custom hooks
├── context/            # Estado global (Context API)
├── utils/              # Funciones auxiliares
└── assets/             # Imágenes, iconos
```

### Backend (Spring Boot)
```
src/main/java/com/hacaritama/reservas/
├── controller/         # REST Controllers (endpoints)
├── service/            # Lógica de negocio
├── repository/         # Acceso a datos (JPA)
├── model/              # Entidades JPA
├── dto/                # Data Transfer Objects
├── mapper/             # Conversión Entity ↔ DTO
├── security/           # Configuración JWT
├── exception/          # Manejo de excepciones
├── config/             # Configuraciones
└── util/               # Utilidades
```

---

## 🔐 Flujo de Autenticación (JWT)

```
┌──────────┐                                    ┌──────────┐
│  Cliente │                                    │  Backend │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  1. POST /api/auth/login                      │
     │    { email, password }                        │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                    2. Validar credenciales
     │                                       (Spring Security)
     │                                                │
     │  3. Response: { token, user }                 │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  4. Guardar token en localStorage             │
     │                                                │
     │  5. Requests subsecuentes                     │
     │     Header: Authorization: Bearer <token>     │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                    6. Validar JWT
     │                                       (JwtFilter)
     │                                                │
     │  7. Response con datos                        │
     │<──────────────────────────────────────────────┤
     │                                                │
```

---

## 🎯 Flujo de Reserva de Pasaje

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│ Cliente │     │ Frontend │     │ Backend │     │    BD    │
└────┬────┘     └────┬─────┘     └────┬────┘     └────┬─────┘
     │               │                 │               │
     │ 1. Buscar viajes                │               │
     ├──────────────>│                 │               │
     │               │ GET /api/viajes?origen=X&destino=Y&fecha=Z
     │               ├────────────────>│               │
     │               │                 │ SELECT viajes │
     │               │                 ├──────────────>│
     │               │                 │<──────────────┤
     │               │<────────────────┤               │
     │<──────────────┤                 │               │
     │               │                 │               │
     │ 2. Seleccionar viaje            │               │
     ├──────────────>│                 │               │
     │               │ GET /api/viajes/{id}/asientos   │
     │               ├────────────────>│               │
     │               │                 │ SELECT asientos ocupados
     │               │                 ├──────────────>│
     │               │                 │<──────────────┤
     │               │<────────────────┤               │
     │<──────────────┤ (Mapa visual)   │               │
     │               │                 │               │
     │ 3. Seleccionar asiento          │               │
     ├──────────────>│                 │               │
     │               │                 │               │
     │ 4. Ingresar datos pasajero      │               │
     ├──────────────>│                 │               │
     │               │                 │               │
     │ 5. Procesar pago                │               │
     ├──────────────>│ POST /api/ventas                │
     │               ├────────────────>│               │
     │               │                 │ BEGIN TRANSACTION
     │               │                 │ INSERT venta  │
     │               │                 ├──────────────>│
     │               │                 │ INSERT pasaje │
     │               │                 ├──────────────>│
     │               │                 │ TRIGGER: UPDATE asientos_disponibles
     │               │                 │<──────────────┤
     │               │                 │ COMMIT        │
     │               │<────────────────┤               │
     │<──────────────┤ (Pasaje PDF)    │               │
     │               │                 │               │
```

---

## 📊 Modelo de Datos (Entidad-Relación)

### Entidades Principales

```
PASAJEROS
├── id_pasajero (PK)
├── tipo_documento
├── numero_documento (UNIQUE)
├── nombre
├── apellido
├── email (UNIQUE)
├── telefono
├── password (hash)
├── rol (ENUM: CLIENTE, SECRETARIA, ADMIN)
└── fecha_registro

RUTAS
├── id_ruta (PK)
├── origen
├── destino
├── distancia_km
├── duracion_estimada
└── estado (ACTIVO/INACTIVO)

VEHÍCULOS
├── id_vehiculo (PK)
├── placa (UNIQUE)
├── tipo (BUS/BUSETA)
├── marca
├── modelo
├── capacidad_asientos
└── estado (DISPONIBLE/EN_SERVICIO/MANTENIMIENTO)

CONDUCTORES
├── id_conductor (PK)
├── numero_documento (UNIQUE)
├── nombre
├── apellido
├── licencia (UNIQUE)
├── telefono
└── estado (ACTIVO/INACTIVO)

VIAJES
├── id_viaje (PK)
├── id_ruta (FK → RUTAS)
├── id_vehiculo (FK → VEHÍCULOS)
├── id_conductor (FK → CONDUCTORES)
├── fecha
├── hora_salida
├── hora_llegada_estimada
├── estado (PROGRAMADO/EN_CURSO/FINALIZADO/CANCELADO)
├── asientos_disponibles
└── precio_base

VENTAS
├── id_venta (PK)
├── id_pasajero (FK → PASAJEROS)
├── fecha_venta
├── total
├── metodo_pago (EFECTIVO/TARJETA/ONLINE)
└── estado (COMPLETADA/ANULADA)

PASAJES
├── id_pasaje (PK)
├── id_venta (FK → VENTAS)
├── id_viaje (FK → VIAJES)
├── id_pasajero (FK → PASAJEROS)
├── numero_asiento
├── precio
├── estado (ACTIVO/ANULADO)
└── UNIQUE(id_viaje, numero_asiento) ← CRÍTICO
```

---

## 🔒 Seguridad

### Autenticación
- **JWT (JSON Web Tokens)** con expiración de 24 horas
- Refresh tokens para renovación automática
- Passwords hasheados con **BCrypt**

### Autorización
- Control de acceso basado en roles (RBAC)
- Endpoints protegidos por rol:
  - `CLIENTE`: Comprar pasajes, ver historial
  - `SECRETARIA`: Vender pasajes, gestionar pasajeros
  - `ADMIN`: Acceso total

### Validaciones
- **Backend:** Bean Validation (JSR-380)
- **Frontend:** Validación en tiempo real
- **Base de Datos:** Constraints (NOT NULL, UNIQUE, CHECK)

---

## 🚀 Escalabilidad

### Optimizaciones Implementadas
1. **Paginación** en listados grandes
2. **Índices** en columnas de búsqueda frecuente
3. **Caché** de rutas y vehículos (Redis en futuro)
4. **Lazy Loading** en frontend
5. **Connection Pooling** en backend (HikariCP)

### Futuras Mejoras
- Microservicios (separar módulos)
- Message Queue (RabbitMQ/Kafka) para emails
- CDN para assets estáticos
- Load Balancer para múltiples instancias

---

## 📈 Monitoreo y Logs

### Backend
- **Spring Boot Actuator** (health, metrics)
- **Logback** para logs estructurados
- Niveles: ERROR, WARN, INFO, DEBUG

### Frontend
- **Console logs** en desarrollo
- **Sentry** para tracking de errores (futuro)

---

## 🧪 Estrategia de Testing

### Backend
- **Unitarios:** JUnit 5 + Mockito (>80% cobertura)
- **Integración:** TestContainers (PostgreSQL)
- **API:** RestAssured

### Frontend
- **Unitarios:** Jest + React Testing Library
- **Integración:** Testing Library
- **E2E:** Playwright (futuro)

---

## 📦 Despliegue

### Desarrollo
```
Frontend: http://localhost:5173
Backend:  http://localhost:8080
BD:       localhost:5432
```

### Producción (Planeado)
```
Frontend: Vercel/Netlify (CDN global)
Backend:  Render/Railway (contenedores)
BD:       Supabase/Railway (PostgreSQL managed)
```

---

## 🔄 CI/CD Pipeline (Futuro)

```
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ GitHub       │
│ Actions      │
└──────┬───────┘
       │
       ├─→ Lint & Format
       ├─→ Run Tests
       ├─→ Build
       ├─→ Security Scan
       │
       ▼
┌──────────────┐
│   Deploy     │
│ (Staging)    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Deploy     │
│ (Production) │
└──────────────┘
```

---

## 📚 Documentación de API

Se utilizará **Swagger/OpenAPI 3.0** para documentación interactiva.

Acceso: `http://localhost:8080/swagger-ui.html`

---

## 🎯 Principios de Diseño

1. **SOLID** - Código mantenible y escalable
2. **DRY** - Don't Repeat Yourself
3. **KISS** - Keep It Simple, Stupid
4. **YAGNI** - You Aren't Gonna Need It
5. **Separation of Concerns** - Capas bien definidas
6. **API First** - Diseño de API antes de implementación
