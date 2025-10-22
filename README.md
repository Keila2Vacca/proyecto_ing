# 🚌 Sistema de Reserva de Pasajes - Hacaritama

![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Licencia](https://img.shields.io/badge/licencia-Académico-blue)

Sistema web responsive para la gestión y venta de pasajes intermunicipales de la Cooperativa de Transporte Hacaritama.

## 📋 Descripción

Plataforma web que permite a los usuarios consultar rutas disponibles, seleccionar asientos y comprar pasajes de manera autónoma, mientras que la cooperativa puede gestionar eficientemente sus recursos (vehículos, conductores, rutas) y generar reportes operativos y financieros.

## 🎯 Objetivos del Proyecto

- Modernizar el proceso de venta de pasajes
- Eliminar conflictos por dobles asignaciones de asientos
- Brindar acceso 24/7 a la compra de pasajes
- Optimizar la gestión operativa de la cooperativa
- Proporcionar trazabilidad completa de transacciones

## 🚀 Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework de diseño
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.x** - Framework
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - ORM
- **PostgreSQL** - Base de datos

### DevOps
- **Git/GitHub** - Control de versiones
## 📦 Requisitos Previos

- **Node.js** 18+ y npm
- **Java JDK** 17+
- **PostgreSQL** 14+
- **Maven** 3.8+
- **Git** 2.30+

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/[usuario]/hacaritama-reservas-pasajes.git
cd hacaritama-reservas-pasajes
```

### 2. Configurar Backend
```bash
cd backend

# Crear base de datos PostgreSQL
psql -U postgres
CREATE DATABASE hacaritama_db;

# Configurar application.properties
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Editar con tus credenciales de BD

# Instalar dependencias y ejecutar
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### 3. Configurar Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar VITE_API_URL con la URL del backend

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🌿 Estrategia de Branching (Git Flow)

### Branches Principales

- **`main`**: Código en producción (protegido)
- **`develop`**: Rama de integración

### Branches Temporales

- **`feature/nombre-feature`**: Nuevas funcionalidades
- **`bugfix/descripcion-bug`**: Corrección de bugs
- **`hotfix/descripcion-urgente`**: Correcciones urgentes en producción

## 🎓 Contexto Académico

Este proyecto se desarrolla como trabajo de grado para las asignaturas:
- **Ingeniería de Software**
- **Base de Datos**


