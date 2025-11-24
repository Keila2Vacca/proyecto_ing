# 📊 Comparación de Modelos de Base de Datos

## 🎯 Resumen

Este documento compara el modelo inicial (schema.sql) con el modelo basado en el diseño del equipo (schema_v2.sql).

---

## 📋 Diferencias Principales

### 1. Estructura de Empleados

**Modelo Inicial (schema.sql):**
- Una sola tabla `pasajeros` que incluye todos los usuarios (clientes, secretarias, admin)
- Campo `rol` con ENUM para diferenciar tipos

**Modelo del Equipo (schema_v2.sql):**
- Tabla base `employee` con herencia
- Tablas especializadas: `driver`, `admin`, `other_employee`
- Separación clara entre empleados y pasajeros

```sql
-- Modelo del Equipo (Herencia)
employee (tabla base)
├── driver (conductores)
├── admin (administradores)
└── other_employee (secretarias, otros)
```

### 2. Ubicaciones Geográficas

**Modelo Inicial:**
- Campos de texto simples para origen/destino en `rutas`

**Modelo del Equipo:**
- Tablas `state` (departamentos)
- Tabla `city` (ciudades) con relación a `state`
- Normalización completa de ubicaciones

```sql
state (departamento)
  └── city (ciudad)
       └── route (usa origin_city_id y destination_city_id)
```

### 3. Estados de Entidades

**Modelo Inicial:**
- ENUMs directos en las tablas

**Modelo del Equipo:**
- Tablas separadas para estados:
  - `state_trip` (estados de viaje)
  - `state_vehicle` (estados de vehículo)
  - `state_passage` (estados de pasaje)
- Mayor flexibilidad para agregar nuevos estados

### 4. Estructura de Pasajes

**Modelo Inicial:**
```
ventas (transacción)
  └── pasajes (ticket individual)
```

**Modelo del Equipo:**
```
passage (pasaje)
  └── passage_detail (detalle: asiento, precio)
```

### 5. Novedades/Cambios

**Modelo Inicial:**
- No incluido

**Modelo del Equipo:**
- Tabla `new` para registrar cambios en viajes
- Permite trazabilidad de modificaciones

---

## 📊 Comparación Tabla por Tabla

| Concepto | Modelo Inicial | Modelo del Equipo |
|----------|----------------|-------------------|
| **Usuarios** | `pasajeros` (todos) | `employee` + `passenger` (separados) |
| **Conductores** | Tabla `conductores` | Tabla `driver` (hereda de `employee`) |
| **Administradores** | Rol en `pasajeros` | Tabla `admin` (hereda de `employee`) |
| **Ubicaciones** | Texto en `rutas` | `state` → `city` → `route` |
| **Vehículos** | `vehiculos` | `vehicle` |
| **Rutas** | `rutas` | `route` |
| **Viajes** | `viajes` | `trip` |
| **Pasajes** | `ventas` + `pasajes` | `passage` + `passage_detail` |
| **Estados** | ENUMs en tablas | Tablas separadas |
| **Novedades** | ❌ No existe | ✅ Tabla `new` |

---

## 🔍 Análisis Detallado

### Ventajas del Modelo Inicial (schema.sql)

✅ **Simplicidad:**
- Menos tablas (7 vs 13)
- Más fácil de entender inicialmente
- Menos JOINs en consultas simples

✅ **Enfoque en el negocio:**
- Orientado específicamente a venta de pasajes
- Tabla `ventas` clara para transacciones

✅ **Implementación más rápida:**
- Menos código para CRUD
- Menos relaciones que mantener

### Ventajas del Modelo del Equipo (schema_v2.sql)

✅ **Normalización completa:**
- Cumple con 3FN (Tercera Forma Normal)
- Evita redundancia de datos
- Ubicaciones geográficas normalizadas

✅ **Escalabilidad:**
- Fácil agregar nuevos tipos de empleados
- Fácil agregar nuevos estados
- Estructura extensible

✅ **Trazabilidad:**
- Tabla `new` para auditoría de cambios
- Mejor control de modificaciones

✅ **Separación de conceptos:**
- Empleados vs Pasajeros claramente diferenciados
- Herencia de empleados bien modelada

✅ **Flexibilidad:**
- Estados en tablas separadas (no ENUMs fijos)
- Más fácil modificar estados sin cambiar esquema

---

## 🎯 Recomendación

### Para el Proyecto Académico

**Recomiendo usar el Modelo del Equipo (schema_v2.sql)** por las siguientes razones:

1. **Cumple mejor con teoría de bases de datos:**
   - Normalización completa
   - Herencia bien implementada
   - Integridad referencial robusta

2. **Demuestra conocimientos avanzados:**
   - Diseño conceptual → lógico → físico
   - Patrones de herencia
   - Normalización de datos geográficos

3. **Mejor para evaluación académica:**
   - Más complejo = más puntos
   - Muestra dominio de conceptos
   - Justificación de decisiones de diseño

4. **Preparación profesional:**
   - Estructura similar a sistemas reales
   - Escalable y mantenible
   - Buenas prácticas de la industria

### Ajustes Sugeridos

Para combinar lo mejor de ambos modelos:

1. **Mantener la estructura del Modelo del Equipo**
2. **Agregar campos del Modelo Inicial:**
   - Email y password en `employee` o `admin` para autenticación
   - Campo `email` en `passenger` para notificaciones
   - Referencia de pago en `passage`

3. **Crear vista simplificada para ventas:**
```sql
CREATE VIEW view_sales AS
SELECT 
    p.purchase_date,
    pas.document_passenger,
    pas.name_1 || ' ' || pas.last_name_1 AS passenger_name,
    pd.price_paid,
    t.date AS trip_date,
    co.name AS origin,
    cd.name AS destination
FROM passage p
INNER JOIN passage_detail pd ON p.line_item = pd.passage_line_item
INNER JOIN passenger pas ON p.passenger_document = pas.document_passenger
INNER JOIN trip t ON p.trip_id = t.id
INNER JOIN route r ON t.route_id = r.id
INNER JOIN city co ON r.origin_city_id = co.id
INNER JOIN city cd ON r.destination_city_id = cd.id;
```

---

## 📝 Mapeo de Conceptos

### Del Modelo Inicial al Modelo del Equipo

| Modelo Inicial | Modelo del Equipo | Notas |
|----------------|-------------------|-------|
| `pasajeros` (rol=ADMIN) | `admin` | Separado en tabla propia |
| `pasajeros` (rol=SECRETARIA) | `other_employee` | Tipo de empleado |
| `pasajeros` (rol=CLIENTE) | `passenger` | Tabla independiente |
| `conductores` | `driver` | Hereda de `employee` |
| `rutas.origen` | `route.origin_city_id` → `city` | Normalizado |
| `rutas.destino` | `route.destination_city_id` → `city` | Normalizado |
| `vehiculos` | `vehicle` | Similar |
| `viajes` | `trip` | Similar |
| `ventas` | `passage` | Concepto similar |
| `pasajes` | `passage_detail` | Detalle del pasaje |
| - | `new` | Nueva tabla para novedades |

---

## 🔄 Migración entre Modelos

Si deciden cambiar de un modelo a otro:

### De Inicial a Equipo:

```sql
-- 1. Migrar pasajeros clientes
INSERT INTO passenger (document_passenger, id, name_1, last_name_1, phone)
SELECT numero_documento, numero_documento, nombre, apellido, telefono
FROM pasajeros WHERE rol = 'CLIENTE';

-- 2. Migrar administradores
INSERT INTO employee (code, name_1, last_name_1, phone, employee_type)
SELECT 'ADM' || id_pasajero, nombre, apellido, telefono, 'ADMIN'
FROM pasajeros WHERE rol = 'ADMIN';

-- 3. Migrar conductores
INSERT INTO employee (code, name_1, last_name_1, phone, employee_type)
SELECT 'DRV' || id_conductor, nombre, apellido, telefono, 'DRIVER'
FROM conductores;

-- ... etc
```

---

## 🎓 Justificación para Documentación Académica

### Por qué el Modelo del Equipo es mejor para el proyecto:

1. **Normalización (Teoría de BD):**
   - Cumple 1FN, 2FN, 3FN
   - Elimina dependencias transitivas
   - Reduce redundancia

2. **Patrones de Diseño:**
   - Herencia de tablas (Generalización/Especialización)
   - Separación de concerns
   - Integridad referencial

3. **Escalabilidad:**
   - Fácil agregar nuevos tipos de empleados
   - Estados modificables sin ALTER TABLE
   - Estructura extensible

4. **Trazabilidad:**
   - Auditoría de cambios (tabla `new`)
   - Historial completo
   - Cumple con requisitos de sistemas reales

5. **Complejidad Apropiada:**
   - Demuestra conocimientos avanzados
   - Justifica uso de herramientas (JPA, ORM)
   - Prepara para sistemas empresariales

---

## 📌 Decisión Final

**Archivo a usar:** `schema_v2.sql` (Modelo del Equipo)

**Razones:**
1. ✅ Basado en su diseño conceptual
2. ✅ Mejor normalización
3. ✅ Más completo académicamente
4. ✅ Escalable y profesional
5. ✅ Incluye todas las entidades del diagrama

**Ajustes pendientes:**
- Agregar campos de autenticación (email, password)
- Agregar campos de auditoría (created_at, updated_at)
- Considerar agregar tabla de ventas si se requiere facturación

---

## 📞 Próximos Pasos

1. **Revisar schema_v2.sql** con el equipo
2. **Validar** que cubre todos los requisitos
3. **Ejecutar** el script en PostgreSQL
4. **Probar** con datos de ejemplo
5. **Documentar** decisiones de diseño
6. **Implementar** entidades JPA basadas en este modelo

---

**Última actualización:** 25 de Enero, 2025  
**Autores:** Keila Vacca & Karen Bayona  
**Versión:** 2.0.0
