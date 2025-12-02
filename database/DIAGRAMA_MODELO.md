# 📊 Diagrama del Modelo de Base de Datos - Hacaritama v2.0

## 🎯 Modelo Entidad-Relación Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE RESERVA DE PASAJES HACARITAMA                 │
│                              Modelo de Datos v2.0                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    STATE     │
│──────────────│
│ # id         │
│ * name       │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼───────┐
│     CITY     │
│──────────────│
│ # id         │
│ * name       │
│ * state_id   │◄────────────┐
└──────┬───────┘             │
       │                     │
       │ origin              │ destination
       │                     │
       ├─────────────────────┤
       │                     │
       │ N                   │ N
┌──────▼─────────────────────▼──┐
│          ROUTE                │
│───────────────────────────────│
│ # id                          │
│ * price                       │
│ * origin_city_id      (FK)    │
│ * destination_city_id (FK)    │
└──────┬────────────────────────┘
       │ 1
       │
       │ N
┌──────▼───────────────────────────────────────────┐
│                    TRIP                          │
│──────────────────────────────────────────────────│
│ # id                                             │
│ * date                                           │
│ * departure_time                                 │
│ * state_trip_id           (FK) ──────┐          │
│ * route_id                (FK)       │          │
│ * vehicle_plate           (FK) ──┐   │          │
│ * driver_code             (FK) ──│───│──┐       │
└──────┬───────────────────────────│───│──│───────┘
       │                           │   │  │
       │ 1                         │   │  │
       │                           │   │  │
       │ N                         │   │  │
┌──────▼──────────────────┐        │   │  │
│       PASSAGE           │        │   │  │
│─────────────────────────│        │   │  │
│ # line_item       (PK1) │        │   │  │
│ # trip_id         (PK2) │        │   │  │
│ * purchase_date         │        │   │  │
│ * state_passage_id (FK) │◄───┐   │   │  │
│ * passenger_document(FK)│◄───│───│───│──│──┐
└──────┬──────────────────┘    │   │   │  │  │
       │ 1                     │   │   │  │  │
       │                       │   │   │  │  │
       │ N                     │   │   │  │  │
┌──────▼──────────────────┐    │   │   │  │  │
│   PASSAGE_DETAIL        │    │   │   │  │  │
│─────────────────────────│    │   │   │  │  │
│ # id_detail             │    │   │   │  │  │
│ * seat_number           │    │   │   │  │  │
│ * price_paid            │    │   │   │  │  │
│ * passage_line_item(FK) │    │   │   │  │  │
│ * passage_trip_id  (FK) │    │   │   │  │  │
│                         │    │   │   │  │  │
│ UNIQUE(passage_trip_id, │    │   │   │  │  │
│        seat_number)     │    │   │   │  │  │
└─────────────────────────┘    │   │   │  │  │
                               │   │   │  │  │
┌──────────────────┐           │   │   │  │  │
│ STATE_PASSAGE    │           │   │   │  │  │
│──────────────────│           │   │   │  │  │
│ # id             │───────────┘   │   │  │  │
│ * name           │               │   │  │  │
│ (Activo, Anulado,│               │   │  │  │
│  Usado)          │               │   │  │  │
└──────────────────┘               │   │  │  │
                                   │   │  │  │
┌──────────────────┐               │   │  │  │
│  STATE_TRIP      │               │   │  │  │
│──────────────────│               │   │  │  │
│ # id             │───────────────┘   │  │  │
│ * name           │                   │  │  │
│ (Programado,     │                   │  │  │
│  En Curso,       │                   │  │  │
│  Finalizado,     │                   │  │  │
│  Cancelado)      │                   │  │  │
└──────────────────┘                   │  │  │
                                       │  │  │
┌──────────────────────────┐           │  │  │
│       VEHICLE            │           │  │  │
│──────────────────────────│           │  │  │
│ # plate                  │───────────┘  │  │
│ * model                  │              │  │
│ * capacity               │              │  │
│ * state_vehicle_id  (FK) │◄──┐          │  │
└──────────────────────────┘   │          │  │
                               │          │  │
┌──────────────────┐           │          │  │
│ STATE_VEHICLE    │           │          │  │
│──────────────────│           │          │  │
│ # id             │───────────┘          │  │
│ * name           │                      │  │
│ (Disponible,     │                      │  │
│  En Servicio,    │                      │  │
│  Mantenimiento,  │                      │  │
│  Inactivo)       │                      │  │
└──────────────────┘                      │  │
                                          │  │
┌─────────────────────────────────────────┼──┼──┐
│              EMPLOYEE                   │  │  │
│─────────────────────────────────────────│  │  │
│ # code                                  │  │  │
│ * name_1                                │  │  │
│ o name_2                                │  │  │
│ * last_name_1                           │  │  │
│ o last_name_2                           │  │  │
│ * phone                                 │  │  │
│ * employee_type (DRIVER/ADMIN/OTHER)    │  │  │
└───┬─────────────┬─────────────┬─────────┘  │  │
    │             │             │            │  │
    │ IS-A        │ IS-A        │ IS-A       │  │
    │             │             │            │  │
┌───▼──────┐  ┌───▼──────┐  ┌───▼──────┐    │  │
│  DRIVER  │  │  ADMIN   │  │  OTHER   │    │  │
│──────────│  │──────────│  │──────────│    │  │
│#emp_code │  │#emp_code │  │#emp_code │    │  │
│*license  │  │*access   │  │          │    │  │
│*date_lic │  │          │  │          │    │  │
└────┬─────┘  └──────────┘  └──────────┘    │  │
     │                                       │  │
     │ drive                                 │  │
     └───────────────────────────────────────┘  │
                                                │
┌───────────────────────────────────────────────┼──┐
│                  PASSENGER                    │  │
│───────────────────────────────────────────────│  │
│ # document_passenger                          │  │
│ * id                                          │  │
│ * name_1                                      │  │
│ o name_2                                      │  │
│ * last_name_1                                 │  │
│ o last_name_2                                 │  │
│ * phone                                       │  │
└───────────────────────────────────────────────┘  │
                                                   │
                                                   │ buy
                                                   └──────┘

┌──────────────────────────────────────────────┐
│                    NEW                       │
│──────────────────────────────────────────────│
│ # id                                         │
│ * date_change                                │
│ * motive                                     │
│ * vehicle_plate           (FK) ──────────────┼─► VEHICLE
│ * driver_code             (FK) ──────────────┼─► DRIVER
│ * trip_date                                  │
└──────────────────────────────────────────────┘
```

---

## 🔑 Leyenda

```
# = Primary Key (Clave Primaria)
* = Required Field (Campo Obligatorio)
o = Optional Field (Campo Opcional)
FK = Foreign Key (Clave Foránea)
PK1, PK2 = Composite Primary Key (Clave Primaria Compuesta)

─── = Relación uno a uno (1:1)
──┬ = Relación uno a muchos (1:N)
──< = Relación muchos a muchos (N:M)
IS-A = Herencia (Generalización/Especialización)
```

---

## 📋 Cardinalidades

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| STATE → CITY | 1:N | Un estado tiene muchas ciudades |
| CITY → ROUTE (origin) | 1:N | Una ciudad es origen de muchas rutas |
| CITY → ROUTE (destination) | 1:N | Una ciudad es destino de muchas rutas |
| ROUTE → TRIP | 1:N | Una ruta tiene muchos viajes |
| VEHICLE → TRIP | 1:N | Un vehículo realiza muchos viajes |
| DRIVER → TRIP | 1:N | Un conductor maneja muchos viajes |
| STATE_TRIP → TRIP | 1:N | Un estado aplica a muchos viajes |
| TRIP → PASSAGE | 1:N | Un viaje tiene muchos pasajes |
| PASSENGER → PASSAGE | 1:N | Un pasajero compra muchos pasajes |
| STATE_PASSAGE → PASSAGE | 1:N | Un estado aplica a muchos pasajes |
| PASSAGE → PASSAGE_DETAIL | 1:N | Un pasaje tiene muchos detalles |
| EMPLOYEE → DRIVER | 1:1 | Herencia (IS-A) |
| EMPLOYEE → ADMIN | 1:1 | Herencia (IS-A) |
| EMPLOYEE → OTHER | 1:1 | Herencia (IS-A) |
| VEHICLE → NEW | 1:N | Un vehículo tiene muchas novedades |
| DRIVER → NEW | 1:N | Un conductor tiene muchas novedades |

---

## 🎯 Constraints Críticos

### 1. Asiento Único por Viaje
```sql
UNIQUE(passage_trip_id, seat_number) en PASSAGE_DETAIL
```
**Garantiza:** Un asiento solo puede venderse una vez por viaje.

### 2. Ciudades Diferentes en Ruta
```sql
CHECK (origin_city_id <> destination_city_id) en ROUTE
```
**Garantiza:** Una ruta no puede tener el mismo origen y destino.

### 3. Vehículo Único por Viaje
```sql
UNIQUE(vehicle_plate, date, departure_time) en TRIP
```
**Garantiza:** Un vehículo no puede estar en dos viajes al mismo tiempo.

### 4. Capacidad del Vehículo
```sql
CHECK (seat_number <= vehicle.capacity)
```
**Garantiza:** No se venden asientos que no existen en el vehículo.

---

## 📊 Tablas de Estados

### STATE_TRIP (Estados de Viaje)
- Programado
- En Curso
- Finalizado
- Cancelado

### STATE_VEHICLE (Estados de Vehículo)
- Disponible
- En Servicio
- Mantenimiento
- Inactivo

### STATE_PASSAGE (Estados de Pasaje)
- Activo
- Anulado
- Usado

---

## 🔄 Flujo de Datos Principal

```
1. PASSENGER (pasajero se registra)
   ↓
2. Busca TRIP disponible
   ↓
3. TRIP muestra asientos disponibles (VEHICLE.capacity - vendidos)
   ↓
4. Selecciona asiento
   ↓
5. Crea PASSAGE
   ↓
6. Crea PASSAGE_DETAIL (asiento + precio)
   ↓
7. TRIGGER valida capacidad y disponibilidad
   ↓
8. Pasaje confirmado
```

---

## 🎨 Herencia de Empleados

```
                  EMPLOYEE
                  (Tabla Base)
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     DRIVER        ADMIN         OTHER
  (Conductores) (Administradores) (Secretarias)
```

**Tipo de Herencia:** Table-per-Type (TPT)
- Cada subtipo tiene su propia tabla
- Comparten la PK con la tabla base
- Permite campos específicos por tipo

---

## 🗺️ Normalización Geográfica

```
STATE (Departamento)
  │
  └── CITY (Ciudad/Municipio)
        │
        └── ROUTE (Ruta)
              │
              └── TRIP (Viaje)
```

**Ventajas:**
- Evita duplicación de nombres de ciudades
- Facilita búsquedas por departamento
- Permite agregar más información geográfica (coordenadas, etc.)

---

## 📈 Índices Recomendados

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_trip_date ON trip(date);
CREATE INDEX idx_trip_route ON trip(route_id);
CREATE INDEX idx_passage_trip ON passage(trip_id);
CREATE INDEX idx_passage_passenger ON passage(passenger_document);

-- Búsquedas geográficas
CREATE INDEX idx_city_state ON city(state_id);
CREATE INDEX idx_route_origin ON route(origin_city_id);
CREATE INDEX idx_route_destination ON route(destination_city_id);

-- Búsquedas por estado
CREATE INDEX idx_trip_state ON trip(state_trip_id);
CREATE INDEX idx_vehicle_state ON vehicle(state_vehicle_id);
CREATE INDEX idx_passage_state ON passage(state_passage_id);
```

---

## 🔍 Consultas Comunes

### 1. Buscar viajes disponibles
```sql
SELECT t.*, 
       co.name AS origin,
       cd.name AS destination,
       v.capacity - COUNT(pd.id_detail) AS seats_available
FROM trip t
INNER JOIN route r ON t.route_id = r.id
INNER JOIN city co ON r.origin_city_id = co.id
INNER JOIN city cd ON r.destination_city_id = cd.id
INNER JOIN vehicle v ON t.vehicle_plate = v.plate
LEFT JOIN passage p ON t.id = p.trip_id
LEFT JOIN passage_detail pd ON p.line_item = pd.passage_line_item
WHERE t.date = '2025-01-25'
  AND co.name = 'Ábrego'
  AND cd.name = 'Cúcuta'
GROUP BY t.id, co.name, cd.name, v.capacity;
```

### 2. Ver asientos ocupados de un viaje
```sql
SELECT pd.seat_number
FROM passage_detail pd
INNER JOIN passage p ON pd.passage_line_item = p.line_item
WHERE p.trip_id = 1
  AND p.state_passage_id = (SELECT id FROM state_passage WHERE name = 'Activo');
```

### 3. Historial de pasajes de un pasajero
```sql
SELECT 
    p.purchase_date,
    t.date AS trip_date,
    co.name AS origin,
    cd.name AS destination,
    pd.seat_number,
    pd.price_paid,
    sp.name AS status
FROM passage p
INNER JOIN passage_detail pd ON p.line_item = pd.passage_line_item
INNER JOIN trip t ON p.trip_id = t.id
INNER JOIN route r ON t.route_id = r.id
INNER JOIN city co ON r.origin_city_id = co.id
INNER JOIN city cd ON r.destination_city_id = cd.id
INNER JOIN state_passage sp ON p.state_passage_id = sp.id
WHERE p.passenger_document = 'PSG001'
ORDER BY p.purchase_date DESC;
```

---

## 📝 Notas de Implementación

### Para JPA/Hibernate (Java)

```java
// Herencia de Employee
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "employee_type")
public class Employee {
    @Id
    private String code;
    // ...
}

@Entity
@DiscriminatorValue("DRIVER")
public class Driver extends Employee {
    private String license;
    // ...
}

// Clave compuesta en Passage
@Entity
@IdClass(PassageId.class)
public class Passage {
    @Id
    private Integer lineItem;
    
    @Id
    @ManyToOne
    private Trip trip;
    // ...
}
```

---

## 🎯 Validaciones de Negocio

1. **No vender pasajes para viajes finalizados/cancelados**
   - Trigger: `validate_trip_state_for_sale()`

2. **No exceder capacidad del vehículo**
   - Trigger: `validate_vehicle_capacity()`

3. **No vender el mismo asiento dos veces**
   - Constraint: `UNIQUE(passage_trip_id, seat_number)`

4. **Licencia de conductor vigente**
   - Check: `date_license > CURRENT_DATE`

5. **Ciudades diferentes en ruta**
   - Check: `origin_city_id <> destination_city_id`

---

**Última actualización:** 25 de Octubre, 2025  
**Autores:** Keila Vacca & Karen Bayona  
**Versión del Modelo:** 2.0.0
