# 🚌 Sistema de Reserva de Pasajes - Hacaritama

![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-0.1.0-blue)
![Licencia](https://img.shields.io/badge/licencia-Académico-green)
![Java](https://img.shields.io/badge/Java-17-orange)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)

Sistema web responsive para la gestión y venta de pasajes intermunicipales de la **Cooperativa de Transporte Hacaritama** (Ábrego, Norte de Santander).

---

## 📋 Descripción

Plataforma web que permite a los usuarios:
- 🎫 **Comprar pasajes online** con selección de asiento
- 🔍 **Buscar viajes** por origen, destino y fecha
- 💳 **Pagar electrónicamente** de forma segura
- 📱 **Recibir pasaje digital** con código QR

Y a la cooperativa:
- 🚌 **Gestionar flota** de vehículos
- 👨‍✈️ **Administrar conductores** y rutas
- 📊 **Generar reportes** de ventas y ocupación
- ⚡ **Control en tiempo real** de asientos disponibles

---

## 🎯 Problema que Resuelve

**Situación actual:**
- ❌ Venta de pasajes **solo presencial** o por teléfono
- ❌ **Conflictos por dobles asignaciones** de asientos
- ❌ No hay control de inventario en tiempo real
- ❌ Falta de trazabilidad de ventas

**Solución:**
- ✅ Sistema web accesible 24/7
- ✅ Asignación única de asientos (constraint en BD)
- ✅ Inventario actualizado automáticamente
- ✅ Historial completo de transacciones

---

## 🚀 Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool moderno
- **Tailwind CSS** - Framework de diseño
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.5** - Framework empresarial
- **Spring Security** - Autenticación JWT
- **Spring Data JPA** - ORM
- **PostgreSQL 14+** - Base de datos relacional

### DevOps & Tools
- **Git/GitHub** - Control de versiones (Git Flow)
- **Maven** - Build tool Java
- **npm** - Gestor de paquetes JS
- **Docker** - Contenedores (futuro)
- **Vercel/Netlify** - Deploy frontend
- **Render/Railway** - Deploy backend
## 📦 Requisitos Previos

- **Node.js** 18+ y npm
- **Java JDK** 17+
- **PostgreSQL** 14+
- **Maven** 3.8+
- **Git** 2.30+

---

## ⚡ Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/Keila2Vacca/Proyecto_Hacaritama_web.git
cd Proyecto_Hacaritama_web
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE hacaritama_db;
\q

# Ejecutar scripts
psql -U postgres -d hacaritama_db -f database/schema.sql
psql -U postgres -d hacaritama_db -f database/seed_data.sql
```

### 3. Configurar Backend
```bash
cd backend

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Instalar y ejecutar
mvn clean install
mvn spring-boot:run
```

✅ Backend corriendo en `http://localhost:8080/api`

### 4. Configurar Frontend
```bash
cd frontend

# Copiar variables de entorno
cp .env.example .env

# Instalar y ejecutar
npm install
npm run dev
```

✅ Frontend corriendo en `http://localhost:5173`

### 5. Credenciales de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | admin@hacaritama.com | Admin123! |
| **Secretaria** | secretaria@hacaritama.com | Secretaria123! |
| **Cliente** | juan.perez@email.com | Cliente123! |

📖 **Guía completa:** Ver [`docs/INSTALLATION.md`](docs/INSTALLATION.md)

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [📐 ARQUITECTURA.md](docs/ARQUITECTURA.md) | Arquitectura del sistema y patrones |
| [📡 API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Documentación completa de API REST |
| [🎨 MOCKUPS.md](docs/MOCKUPS.md) | Diseños y wireframes |
| [🚀 INSTALLATION.md](docs/INSTALLATION.md) | Guía detallada de instalación |
| [📋 VERSION.md](VERSION.md) | Control de versiones y roadmap |
| [📝 CHANGELOG.md](CHANGELOG.md) | Historial de cambios |
| [🤝 CONTRIBUTING.md](CONTRIBUTING.md) | Guía de contribución |

---

## 🗄️ Modelo de Datos

El sistema utiliza **13 tablas** con herencia y normalización completa:

```
STATE → CITY → ROUTE → TRIP ←─── VEHICLE
                        │         STATE_VEHICLE
                        │
                    PASSAGE ←─── PASSENGER
                        │
                PASSAGE_DETAIL
                        │
                STATE_PASSAGE

EMPLOYEE (herencia)
├── DRIVER
├── ADMIN
└── OTHER

NEW (novedades)
```

**Regla crítica:** Un asiento en un viaje solo puede venderse **UNA vez** (constraint `UNIQUE(passage_trip_id, seat_number)`)

📊 **Scripts SQL:** 
- [`database/schema_v2.sql`](database/schema_v2.sql) - **Modelo oficial** (basado en diseño del equipo)
- [`database/schema.sql`](database/schema.sql) - Modelo inicial simplificado
- [`database/MODELO_COMPARACION.md`](database/MODELO_COMPARACION.md) - Comparación de modelos
- [`database/DIAGRAMA_MODELO.md`](database/DIAGRAMA_MODELO.md) - Diagrama visual completo

---

## 🎯 Funcionalidades Principales

### Para Clientes
- ✅ Registro y autenticación
- ✅ Búsqueda de viajes por origen/destino/fecha
- ✅ Visualización de asientos disponibles
- ✅ Selección de asiento específico
- ✅ Pago online (MercadoPago/PayU)
- ✅ Pasaje digital con QR
- ✅ Historial de compras

### Para Secretarias
- ✅ Venta presencial de pasajes
- ✅ Registro de pasajeros
- ✅ Consulta de disponibilidad
- ✅ Anulación de pasajes

### Para Administradores
- ✅ Gestión de rutas
- ✅ Gestión de vehículos
- ✅ Gestión de conductores
- ✅ Programación de viajes
- ✅ Reportes de ventas y ocupación
- ✅ Dashboard con KPIs

---

## 🌿 Flujo de Trabajo (Git Flow)

### Estructura de Branches

```
main (producción)
  └── develop (integración)
       ├── feature/auth-jwt
       ├── feature/seleccion-asientos
       └── bugfix/validacion-email
```

### Crear Feature Branch

```bash
# Actualizar develop
git checkout develop
git pull origin develop

# Crear feature
git checkout -b feature/nombre-descriptivo

# Trabajar y commitear
git add .
git commit -m "feat: descripción del cambio"

# Push y crear PR
git push origin feature/nombre-descriptivo
```

### Convención de Commits

```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Documentación
style: Formato de código
refactor: Refactorización
test: Tests
chore: Mantenimiento
```

📖 **Guía completa:** Ver [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## 🧪 Testing

### Backend
```bash
# Ejecutar tests
mvn test

# Cobertura
mvn test jacoco:report
# Ver reporte en: target/site/jacoco/index.html
```

### Frontend
```bash
# Ejecutar tests
npm test

# Cobertura
npm run test:coverage
# Ver reporte en: coverage/lcov-report/index.html
```

**Cobertura mínima:** 80% backend, 70% frontend

---

## 📈 Roadmap de Versiones

| Versión | Sprint | Fecha | Objetivo |
|---------|--------|-------|----------|
| **0.1.0** | Sprint 0 | Ene 2025 | ✅ Configuración inicial |
| **0.2.0** | Sprint 1 | Feb 2025 | Base de datos y modelos |
| **0.3.0** | Sprint 2 | Feb 2025 | Autenticación JWT |
| **0.4.0** | Sprint 3 | Mar 2025 | Gestión de pasajeros |
| **0.5.0** | Sprint 4 | Mar 2025 | Rutas y vehículos |
| **0.6.0** | Sprint 5 | Abr 2025 | Conductores y viajes |
| **0.7.0** | Sprint 6 | Abr 2025 | Búsqueda de viajes |
| **0.8.0** | Sprint 7-8 | May 2025 | Sistema de reservas |
| **0.9.0** | Sprint 9 | May 2025 | Integraciones (pagos, email) |
| **1.0.0** | Sprint 10-11 | Jun 2025 | 🎯 Release de producción |

📋 **Roadmap completo:** Ver [`VERSION.md`](VERSION.md)

---

## 🎓 Contexto Académico

**Universidad:** Francisco de Paula Santander - Ocaña  
**Programa:** Ingeniería de Sistemas  
**Asignaturas:** Ingeniería de Software + Base de Datos  
**Período:** 2025-1  
**Docente:** Duván Andrey Márquez Pinzón

---

## 👥 Equipo de Desarrollo

| Rol | Nombre | Código | GitHub |
|-----|--------|--------|--------|
| **Product Owner** | Karen Marcela Bayona Moreno | 192215 | [@KarenMarcela](https://github.com/KarenMarcela) |
| **Scrum Master** | Keila Nathaly Vacca Bacca | 192221 | [@Keila2Vacca](https://github.com/Keila2Vacca) |
| **Dev Team** | Keila Vacca & Karen Bayona | - | Full Stack Developers |

---

## 📞 Contacto y Soporte

- **Issues:** [GitHub Issues](https://github.com/Keila2Vacca/Proyecto_Hacaritama_web/issues)
- **Email:** keila.vacca@ufpso.edu.co, karen.bayona@ufpso.edu.co
- **Documentación:** Ver carpeta [`docs/`](docs/)

---

## 📄 Licencia

Este proyecto es de uso **académico** para la Universidad Francisco de Paula Santander - Ocaña.

---

## 🙏 Agradecimientos

- Universidad Francisco de Paula Santander - Ocaña
- Cooperativa de Transporte Hacaritama
- Docente Duván Andrey Márquez Pinzón

---

<div align="center">

**🚌 Hacaritama - Viaja Seguro, Reserva Fácil**

[![GitHub](https://img.shields.io/badge/GitHub-Proyecto-blue?logo=github)](https://github.com/Keila2Vacca/Proyecto_Hacaritama_web)

</div>


