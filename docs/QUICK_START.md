# ⚡ Guía de Inicio Rápido - Hacaritama

## 🎯 Para Nuevos Desarrolladores

Esta guía te ayudará a tener el proyecto corriendo en **menos de 15 minutos**.

---

## ✅ Pre-requisitos (Verificar primero)

```bash
# Verificar instalaciones
node --version    # Debe ser v18+
java -version     # Debe ser 17
mvn --version     # Debe ser 3.8+
psql --version    # Debe ser 14+
git --version     # Debe ser 2.30+
```

Si falta algo, instalar desde:
- Node.js: https://nodejs.org/
- Java 17: https://adoptium.net/
- Maven: https://maven.apache.org/
- PostgreSQL: https://www.postgresql.org/
- Git: https://git-scm.com/

---

## 🚀 Instalación en 5 Pasos

### Paso 1: Clonar Repositorio (1 min)

```bash
git clone https://github.com/Keila2Vacca/Proyecto_Hacaritama_web.git
cd Proyecto_Hacaritama_web
```

---

### Paso 2: Base de Datos (3 min)

**Opción A: Con pgAdmin (Recomendado para Windows)**

1. Abrir pgAdmin
2. Conectarse a PostgreSQL
3. Click derecho en "Databases" → Create → Database
4. Nombre: `hacaritama_db`
5. Click "Save"
6. Click derecho en `hacaritama_db` → Query Tool
7. Abrir y ejecutar `database/schema.sql` (F5)
8. Abrir y ejecutar `database/seed_data.sql` (F5)

**Opción B: Línea de comandos**

```bash
# Crear BD
psql -U postgres -c "CREATE DATABASE hacaritama_db;"

# Ejecutar scripts
psql -U postgres -d hacaritama_db -f database/schema.sql
psql -U postgres -d hacaritama_db -f database/seed_data.sql
```

✅ **Verificar:** Deberías tener 7 tablas creadas

---

### Paso 3: Backend (5 min)

```bash
cd backend

# Copiar variables de entorno
copy .env.example .env     # Windows
cp .env.example .env       # Linux/Mac

# Editar .env (IMPORTANTE)
# Cambiar DB_PASSWORD por tu password de PostgreSQL
notepad .env               # Windows
nano .env                  # Linux/Mac

# Instalar dependencias (toma 2-3 min)
mvn clean install -DskipTests

# Ejecutar
mvn spring-boot:run
```

✅ **Verificar:** Deberías ver "Started ReservasPasajesApplication" en la consola

🌐 **Probar:** http://localhost:8080/api

---

### Paso 4: Frontend (4 min)

**Abrir NUEVA terminal** (dejar backend corriendo)

```bash
cd frontend

# Copiar variables de entorno
copy .env.example .env     # Windows
cp .env.example .env       # Linux/Mac

# Instalar dependencias (toma 1-2 min)
npm install

# Ejecutar
npm run dev
```

✅ **Verificar:** Deberías ver "Local: http://localhost:5173"

🌐 **Probar:** http://localhost:5173

---

### Paso 5: Probar el Sistema (2 min)

1. Abrir navegador: http://localhost:5173
2. Click en "Iniciar Sesión"
3. Usar credenciales de prueba:
   - **Email:** `admin@hacaritama.com`
   - **Password:** `Admin123!`
4. Explorar el sistema

---

## 🎉 ¡Listo!

Tu entorno de desarrollo está configurado. Ahora puedes:

1. 📖 Leer la [Arquitectura](ARQUITECTURA.md)
2. 📡 Revisar la [API](API_DOCUMENTATION.md)
3. 🤝 Leer la [Guía de Contribución](../CONTRIBUTING.md)
4. 💻 Crear tu primera feature branch

---

## 🐛 Problemas Comunes

### ❌ Error: "Cannot connect to database"

**Solución:**
1. Verificar que PostgreSQL esté corriendo
2. Verificar password en `backend/.env`
3. Verificar que la BD `hacaritama_db` exista

```bash
# Verificar servicio PostgreSQL
# Windows
Get-Service postgresql*

# Linux
sudo systemctl status postgresql
```

---

### ❌ Error: "Port 8080 already in use"

**Solución:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

---

### ❌ Error: "npm ERR! code ELIFECYCLE"

**Solución:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Error: "Java version mismatch"

**Solución:**
- Instalar Java 17
- Configurar JAVA_HOME:
  ```bash
  # Windows
  setx JAVA_HOME "C:\Program Files\Java\jdk-17"
  
  # Linux/Mac
  export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
  ```

---

## 📋 Comandos Útiles

### Backend
```bash
# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run

# Tests
mvn test

# Ver logs
tail -f logs/hacaritama.log
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Tests
npm test

# Lint
npm run lint
```

### Git
```bash
# Ver estado
git status

# Crear feature
git checkout -b feature/mi-feature

# Commit
git add .
git commit -m "feat: mi cambio"

# Push
git push origin feature/mi-feature
```

---

## 🎓 Siguientes Pasos

1. ✅ Entorno configurado
2. 📖 Leer documentación en `docs/`
3. 🎨 Ver mockups en `docs/MOCKUPS.md`
4. 💻 Elegir una tarea del backlog
5. 🌿 Crear feature branch
6. 🚀 Empezar a desarrollar

---

## 📞 ¿Necesitas Ayuda?

- 📚 Documentación completa: [`docs/INSTALLATION.md`](INSTALLATION.md)
- 🐛 Reportar problema: [GitHub Issues](https://github.com/Keila2Vacca/Proyecto_Hacaritama_web/issues)
- 💬 Contactar equipo: keila.vacca@ufpso.edu.co

---

**¡Feliz desarrollo! 🚀**
