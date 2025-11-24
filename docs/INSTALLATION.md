# 🚀 Guía de Instalación - Sistema Hacaritama

## 📋 Requisitos Previos

### Software Necesario

| Software | Versión Mínima | Propósito |
|----------|----------------|-----------|
| **Node.js** | 18.x | Runtime para frontend |
| **npm** | 9.x | Gestor de paquetes JS |
| **Java JDK** | 17 | Runtime para backend |
| **Maven** | 3.8+ | Build tool Java |
| **PostgreSQL** | 14+ | Base de datos |
| **Git** | 2.30+ | Control de versiones |
| **pgAdmin** | 4.x (opcional) | GUI para PostgreSQL |

### Verificar Instalaciones

```bash
# Node.js y npm
node --version  # Debe mostrar v18.x o superior
npm --version   # Debe mostrar 9.x o superior

# Java
java -version   # Debe mostrar version 17

# Maven
mvn --version   # Debe mostrar 3.8 o superior

# PostgreSQL
psql --version  # Debe mostrar 14 o superior

# Git
git --version   # Debe mostrar 2.30 o superior
```

---

## 📥 Paso 1: Clonar el Repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/Keila2Vacca/Proyecto_Hacaritama_web.git

# Entrar al directorio
cd Proyecto_Hacaritama_web

# Verificar estructura
dir  # En Windows
ls   # En Linux/Mac
```

---

## 🗄️ Paso 2: Configurar Base de Datos

### 2.1 Crear Base de Datos

**Opción A: Usando pgAdmin**
1. Abrir pgAdmin
2. Conectarse al servidor PostgreSQL
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `hacaritama_db`
5. Owner: `postgres`
6. Encoding: `UTF8`
7. Click "Save"

**Opción B: Usando línea de comandos**
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE hacaritama_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_CO.UTF-8'
    LC_CTYPE = 'es_CO.UTF-8';

# Salir
\q
```

### 2.2 Ejecutar Scripts de Base de Datos

```bash
# Conectar a la base de datos
psql -U postgres -d hacaritama_db

# Ejecutar script de esquema
\i database/schema.sql

# Ejecutar script de datos de prueba
\i database/seed_data.sql

# Verificar tablas creadas
\dt

# Salir
\q
```

**Alternativa con pgAdmin:**
1. Abrir pgAdmin
2. Conectarse a `hacaritama_db`
3. Click en "Query Tool"
4. Abrir archivo `database/schema.sql`
5. Ejecutar (F5)
6. Repetir con `database/seed_data.sql`

### 2.3 Verificar Instalación

```sql
-- Contar registros
SELECT 'Pasajeros' AS tabla, COUNT(*) FROM pasajeros
UNION ALL
SELECT 'Rutas', COUNT(*) FROM rutas
UNION ALL
SELECT 'Vehículos', COUNT(*) FROM vehiculos
UNION ALL
SELECT 'Conductores', COUNT(*) FROM conductores
UNION ALL
SELECT 'Viajes', COUNT(*) FROM viajes;

-- Debe mostrar:
-- Pasajeros: 7
-- Rutas: 8
-- Vehículos: 6
-- Conductores: 5
-- Viajes: 20+
```

---

## ⚙️ Paso 3: Configurar Backend (Spring Boot)

### 3.1 Navegar al directorio backend

```bash
cd backend
```

### 3.2 Configurar Variables de Entorno

Crear archivo `.env` en `backend/`:

```bash
# Windows PowerShell
New-Item .env

# Linux/Mac
touch .env
```

Contenido del archivo `.env`:

```properties
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hacaritama_db
DB_USERNAME=postgres
DB_PASSWORD=tu_password_aqui

# JWT
JWT_SECRET=HacaritamaSecretKey2025ChangeThisInProduction
JWT_EXPIRATION=86400000

# Email (opcional para desarrollo)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password

# Pasarela de Pagos (opcional)
PAYMENT_API_KEY=test_key_here
PAYMENT_PUBLIC_KEY=test_public_key_here

# Entorno
SPRING_PROFILES_ACTIVE=dev
```

### 3.3 Configurar application.properties

Editar `backend/src/main/resources/application.properties`:

```properties
# Configuración de Base de Datos
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:hacaritama_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Server
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.com.hacaritama=DEBUG
logging.level.org.springframework.web=INFO
logging.level.org.hibernate.SQL=DEBUG

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:3000

# File Upload
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
```

### 3.4 Instalar Dependencias y Compilar

```bash
# Limpiar y compilar
mvn clean install

# Si hay errores, intentar:
mvn clean install -DskipTests
```

### 3.5 Ejecutar Backend

```bash
# Opción 1: Con Maven
mvn spring-boot:run

# Opción 2: Con el JAR compilado
java -jar target/reservas-pasajes-0.0.1-SNAPSHOT.jar
```

**Verificar que el backend esté corriendo:**
- Abrir navegador: `http://localhost:8080/api`
- Debe mostrar un mensaje o página de error 404 (normal, no hay endpoint en raíz)

---

## 🎨 Paso 4: Configurar Frontend (React)

### 4.1 Navegar al directorio frontend

```bash
# Desde la raíz del proyecto
cd frontend
```

### 4.2 Configurar Variables de Entorno

Crear archivo `.env` en `frontend/`:

```bash
# Windows PowerShell
New-Item .env

# Linux/Mac
touch .env
```

Contenido del archivo `.env`:

```properties
# API Backend
VITE_API_URL=http://localhost:8080/api

# Pasarela de Pagos (opcional)
VITE_PAYMENT_PUBLIC_KEY=test_public_key_here

# Entorno
VITE_ENV=development

# Google Maps (opcional)
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

### 4.3 Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# Si hay errores, intentar:
npm install --legacy-peer-deps

# O limpiar caché
npm cache clean --force
npm install
```

### 4.4 Ejecutar Frontend

```bash
# Modo desarrollo
npm run dev
```

**Verificar que el frontend esté corriendo:**
- Abrir navegador: `http://localhost:5173`
- Debe mostrar la página de inicio

---

## ✅ Paso 5: Verificar Instalación Completa

### 5.1 Verificar Backend

```bash
# Desde otra terminal
curl http://localhost:8080/api/rutas

# O con PowerShell
Invoke-WebRequest -Uri http://localhost:8080/api/rutas
```

Debe retornar JSON con las rutas.

### 5.2 Verificar Frontend

1. Abrir `http://localhost:5173`
2. Debe cargar la página de inicio
3. Intentar buscar viajes
4. Verificar que se comunique con el backend

### 5.3 Probar Login

**Credenciales de prueba:**
- **Admin:** `admin@hacaritama.com` / `Admin123!`
- **Secretaria:** `secretaria@hacaritama.com` / `Secretaria123!`
- **Cliente:** `juan.perez@email.com` / `Cliente123!`

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to database"

**Solución:**
1. Verificar que PostgreSQL esté corriendo:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux
   sudo systemctl status postgresql
   ```
2. Verificar credenciales en `.env`
3. Verificar que la base de datos `hacaritama_db` exista

---

### Error: "Port 8080 already in use"

**Solución:**
```bash
# Windows - Encontrar proceso
netstat -ano | findstr :8080

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

O cambiar el puerto en `application.properties`:
```properties
server.port=8081
```

---

### Error: "npm ERR! code ELIFECYCLE"

**Solución:**
```bash
# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

---

### Error: "Java version mismatch"

**Solución:**
```bash
# Verificar versión de Java
java -version

# Si es diferente a 17, instalar JDK 17
# Configurar JAVA_HOME
# Windows:
setx JAVA_HOME "C:\Program Files\Java\jdk-17"

# Linux/Mac:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

---

### Error: "CORS policy blocked"

**Solución:**
Verificar en `application.properties`:
```properties
cors.allowed-origins=http://localhost:5173
```

Y en el código de configuración de Spring Security.

---

## 🔄 Scripts Útiles

### Backend

```bash
# Compilar sin tests
mvn clean install -DskipTests

# Ejecutar tests
mvn test

# Generar reporte de cobertura
mvn test jacoco:report

# Limpiar target
mvn clean
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format

# Tests
npm test
npm run test:coverage
```

---

## 📦 Estructura de Archivos Importante

```
Proyecto_Hacaritama_web/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hacaritama/reservas/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   └── test/
│   ├── .env (crear)
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env (crear)
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql
│   └── seed_data.sql
└── docs/
```

---

## 🎯 Próximos Pasos

1. ✅ Instalación completada
2. 📖 Leer `docs/ARQUITECTURA.md`
3. 📡 Revisar `docs/API_DOCUMENTATION.md`
4. 💻 Comenzar desarrollo siguiendo `VERSION.md`
5. 🔀 Crear branch de feature: `git checkout -b feature/nombre-feature`

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs del backend: `backend/logs/`
2. Revisar consola del navegador (F12)
3. Consultar documentación en `docs/`
4. Contactar al equipo de desarrollo

---

## 📝 Notas Importantes

- **Nunca** commitear archivos `.env` (ya están en `.gitignore`)
- **Cambiar** todas las contraseñas por defecto en producción
- **Usar** ramas de feature para desarrollo
- **Ejecutar** tests antes de hacer push
- **Documentar** cambios en `CHANGELOG.md`
