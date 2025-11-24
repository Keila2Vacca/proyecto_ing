-- ============================================================================
-- SISTEMA DE RESERVA DE PASAJES HACARITAMA
-- Script DDL - Basado en Modelo Conceptual del Equipo
-- Versión: 2.0.0
-- Fecha: 2025-01-25
-- DBMS: PostgreSQL 14+
-- Autores: Keila Vacca & Karen Bayona
-- ============================================================================

-- Conectar a la base de datos
-- \c hacaritama_db

-- ============================================================================
-- LIMPIAR ESQUEMA (solo para desarrollo)
-- ============================================================================

DROP TABLE IF EXISTS passage_detail CASCADE;
DROP TABLE IF EXISTS passage CASCADE;
DROP TABLE IF EXISTS new CASCADE;
DROP TABLE IF EXISTS trip CASCADE;
DROP TABLE IF EXISTS route CASCADE;
DROP TABLE IF EXISTS driver CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS other_employee CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS passenger CASCADE;
DROP TABLE IF EXISTS vehicle CASCADE;
DROP TABLE IF EXISTS city CASCADE;
DROP TABLE IF EXISTS state CASCADE;
DROP TABLE IF EXISTS state_trip CASCADE;
DROP TABLE IF EXISTS state_vehicle CASCADE;
DROP TABLE IF EXISTS state_passage CASCADE;

DROP TYPE IF EXISTS document_type_enum CASCADE;
DROP TYPE IF EXISTS employee_type_enum CASCADE;

-- ============================================================================
-- TIPOS ENUMERADOS
-- ============================================================================

CREATE TYPE document_type_enum AS ENUM ('CC', 'TI', 'CE', 'PASAPORTE');
CREATE TYPE employee_type_enum AS ENUM ('DRIVER', 'ADMIN', 'OTHER');

-- ============================================================================
-- TABLA: STATE (Estados/Departamentos)
-- ============================================================================

CREATE TABLE state (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

COMMENT ON TABLE state IS 'Estados o departamentos de Colombia';

-- ============================================================================
-- TABLA: CITY (Ciudades/Municipios)
-- ============================================================================

CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_id INTEGER NOT NULL REFERENCES state(id) ON DELETE RESTRICT,
    
    CONSTRAINT uq_city_name_state UNIQUE (name, state_id)
);

CREATE INDEX idx_city_state ON city(state_id);

COMMENT ON TABLE city IS 'Ciudades o municipios por departamento';

-- ============================================================================
-- TABLA: STATE_TRIP (Estados de Viaje)
-- ============================================================================

CREATE TABLE state_trip (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

COMMENT ON TABLE state_trip IS 'Estados posibles de un viaje: Programado, En Curso, Finalizado, Cancelado';

-- ============================================================================
-- TABLA: STATE_VEHICLE (Estados de Vehículo)
-- ============================================================================

CREATE TABLE state_vehicle (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

COMMENT ON TABLE state_vehicle IS 'Estados posibles de un vehículo: Disponible, En Servicio, Mantenimiento, Inactivo';

-- ============================================================================
-- TABLA: STATE_PASSAGE (Estados de Pasaje)
-- ============================================================================

CREATE TABLE state_passage (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

COMMENT ON TABLE state_passage IS 'Estados posibles de un pasaje: Activo, Anulado, Usado';

-- ============================================================================
-- TABLA: VEHICLE (Vehículos)
-- ============================================================================

CREATE TABLE vehicle (
    id SERIAL PRIMARY KEY,
    plate VARCHAR(10) NOT NULL UNIQUE,
    model VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    state_vehicle_id INTEGER NOT NULL REFERENCES state_vehicle(id) ON DELETE RESTRICT,
    
    CONSTRAINT chk_vehicle_plate CHECK (plate ~* '^[A-Z]{3}[0-9]{3}$'),
    CONSTRAINT chk_vehicle_capacity CHECK (capacity BETWEEN 10 AND 60)
);

CREATE INDEX idx_vehicle_plate ON vehicle(plate);
CREATE INDEX idx_vehicle_state ON vehicle(state_vehicle_id);

COMMENT ON TABLE vehicle IS 'Flota de vehículos de la cooperativa';
COMMENT ON COLUMN vehicle.plate IS 'Placa del vehículo formato: ABC123';
COMMENT ON COLUMN vehicle.capacity IS 'Capacidad total de asientos del vehículo';

-- ============================================================================
-- TABLA: ROUTE (Rutas)
-- ============================================================================

CREATE TABLE route (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10,2) NOT NULL,
    origin_city_id INTEGER NOT NULL REFERENCES city(id) ON DELETE RESTRICT,
    destination_city_id INTEGER NOT NULL REFERENCES city(id) ON DELETE RESTRICT,
    
    CONSTRAINT chk_route_price CHECK (price > 0),
    CONSTRAINT chk_route_different_cities CHECK (origin_city_id <> destination_city_id),
    CONSTRAINT uq_route_origin_destination UNIQUE (origin_city_id, destination_city_id)
);

CREATE INDEX idx_route_origin ON route(origin_city_id);
CREATE INDEX idx_route_destination ON route(destination_city_id);

COMMENT ON TABLE route IS 'Rutas de transporte entre ciudades';
COMMENT ON COLUMN route.price IS 'Precio base de la ruta';

-- ============================================================================
-- TABLA: EMPLOYEE (Empleados - Tabla Base)
-- ============================================================================

CREATE TABLE employee (
    code VARCHAR(20) PRIMARY KEY,
    name_1 VARCHAR(50) NOT NULL,
    name_2 VARCHAR(50),
    last_name_1 VARCHAR(50) NOT NULL,
    last_name_2 VARCHAR(50),
    phone VARCHAR(20) NOT NULL,
    employee_type employee_type_enum NOT NULL,
    
    CONSTRAINT chk_employee_phone CHECK (phone ~* '^\+?[0-9]{7,15}$')
);

CREATE INDEX idx_employee_type ON employee(employee_type);

COMMENT ON TABLE employee IS 'Tabla base de empleados (herencia)';
COMMENT ON COLUMN employee.code IS 'Código único del empleado (EPE_Code)';
COMMENT ON COLUMN employee.employee_type IS 'Tipo de empleado: DRIVER, ADMIN, OTHER';

-- ============================================================================
-- TABLA: DRIVER (Conductores - Hereda de Employee)
-- ============================================================================

CREATE TABLE driver (
    employee_code VARCHAR(20) PRIMARY KEY REFERENCES employee(code) ON DELETE CASCADE,
    license VARCHAR(20) NOT NULL UNIQUE,
    date_license DATE NOT NULL,
    
    CONSTRAINT chk_driver_license_valid CHECK (date_license > CURRENT_DATE)
);

CREATE INDEX idx_driver_license ON driver(license);

COMMENT ON TABLE driver IS 'Conductores de la cooperativa';
COMMENT ON COLUMN driver.license IS 'Número de licencia de conducción';
COMMENT ON COLUMN driver.date_license IS 'Fecha de vencimiento de la licencia';

-- ============================================================================
-- TABLA: ADMIN (Administradores - Hereda de Employee)
-- ============================================================================

CREATE TABLE admin (
    employee_code VARCHAR(20) PRIMARY KEY REFERENCES employee(code) ON DELETE CASCADE,
    access VARCHAR(100) NOT NULL
);

COMMENT ON TABLE admin IS 'Administradores del sistema';
COMMENT ON COLUMN admin.access IS 'Nivel de acceso o permisos especiales';

-- ============================================================================
-- TABLA: OTHER_EMPLOYEE (Otros Empleados - Hereda de Employee)
-- ============================================================================

CREATE TABLE other_employee (
    employee_code VARCHAR(20) PRIMARY KEY REFERENCES employee(code) ON DELETE CASCADE
);

COMMENT ON TABLE other_employee IS 'Otros empleados (secretarias, personal de apoyo)';

-- ============================================================================
-- TABLA: PASSENGER (Pasajeros)
-- ============================================================================

CREATE TABLE passenger (
    document_passenger VARCHAR(20) PRIMARY KEY,
    id VARCHAR(20) NOT NULL UNIQUE,
    name_1 VARCHAR(50) NOT NULL,
    name_2 VARCHAR(50),
    last_name_1 VARCHAR(50) NOT NULL,
    last_name_2 VARCHAR(50),
    phone VARCHAR(20) NOT NULL,
    
    CONSTRAINT chk_passenger_phone CHECK (phone ~* '^\+?[0-9]{7,15}$')
);

CREATE INDEX idx_passenger_id ON passenger(id);

COMMENT ON TABLE passenger IS 'Pasajeros que compran pasajes';
COMMENT ON COLUMN passenger.document_passenger IS 'Documento del pasajero (PK)';
COMMENT ON COLUMN passenger.id IS 'Número de identificación';

-- ============================================================================
-- TABLA: TRIP (Viajes)
-- ============================================================================

CREATE TABLE trip (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    departure_time TIME NOT NULL,
    state_trip_id INTEGER NOT NULL REFERENCES state_trip(id) ON DELETE RESTRICT,
    route_id INTEGER NOT NULL REFERENCES route(id) ON DELETE RESTRICT,
    vehicle_plate VARCHAR(10) NOT NULL REFERENCES vehicle(plate) ON DELETE RESTRICT,
    driver_code VARCHAR(20) NOT NULL REFERENCES driver(employee_code) ON DELETE RESTRICT,
    
    CONSTRAINT uq_trip_vehicle_date_time UNIQUE (vehicle_plate, date, departure_time)
);

CREATE INDEX idx_trip_date ON trip(date);
CREATE INDEX idx_trip_route ON trip(route_id);
CREATE INDEX idx_trip_vehicle ON trip(vehicle_plate);
CREATE INDEX idx_trip_driver ON trip(driver_code);
CREATE INDEX idx_trip_state ON trip(state_trip_id);

COMMENT ON TABLE trip IS 'Viajes programados con fecha, hora, vehículo y conductor';
COMMENT ON COLUMN trip.departure_time IS 'Hora de salida del viaje';

-- ============================================================================
-- TABLA: NEW (Novedades)
-- ============================================================================

CREATE TABLE new (
    id SERIAL PRIMARY KEY,
    date_change DATE NOT NULL DEFAULT CURRENT_DATE,
    motive TEXT NOT NULL,
    vehicle_plate VARCHAR(10) NOT NULL REFERENCES vehicle(plate) ON DELETE RESTRICT,
    driver_code VARCHAR(20) NOT NULL REFERENCES driver(employee_code) ON DELETE RESTRICT,
    trip_date DATE NOT NULL
);

CREATE INDEX idx_new_vehicle ON new(vehicle_plate);
CREATE INDEX idx_new_driver ON new(driver_code);
CREATE INDEX idx_new_date ON new(date_change);

COMMENT ON TABLE new IS 'Novedades o cambios en viajes (cambio de vehículo, conductor, etc.)';
COMMENT ON COLUMN new.motive IS 'Motivo del cambio o novedad';

-- ============================================================================
-- TABLA: PASSAGE (Pasajes)
-- ============================================================================

CREATE TABLE passage (
    line_item INTEGER NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    trip_id INTEGER NOT NULL REFERENCES trip(id) ON DELETE RESTRICT,
    state_passage_id INTEGER NOT NULL REFERENCES state_passage(id) ON DELETE RESTRICT,
    passenger_document VARCHAR(20) NOT NULL REFERENCES passenger(document_passenger) ON DELETE RESTRICT,
    
    PRIMARY KEY (line_item, trip_id)
);

CREATE INDEX idx_passage_trip ON passage(trip_id);
CREATE INDEX idx_passage_passenger ON passage(passenger_document);
CREATE INDEX idx_passage_state ON passage(state_passage_id);
CREATE INDEX idx_passage_date ON passage(purchase_date);

COMMENT ON TABLE passage IS 'Pasajes vendidos';
COMMENT ON COLUMN passage.line_item IS 'Número de línea del pasaje';
COMMENT ON COLUMN passage.purchase_date IS 'Fecha de compra del pasaje';

-- ============================================================================
-- TABLA: PASSAGE_DETAIL (Detalle de Pasaje)
-- ============================================================================

CREATE TABLE passage_detail (
    id_detail SERIAL PRIMARY KEY,
    seat_number INTEGER NOT NULL,
    price_paid DECIMAL(10,2) NOT NULL,
    passage_line_item INTEGER NOT NULL,
    passage_trip_id INTEGER NOT NULL,
    
    CONSTRAINT chk_passage_detail_seat CHECK (seat_number > 0),
    CONSTRAINT chk_passage_detail_price CHECK (price_paid > 0),
    CONSTRAINT uq_passage_detail_trip_seat UNIQUE (passage_trip_id, seat_number),
    
    FOREIGN KEY (passage_line_item, passage_trip_id) 
        REFERENCES passage(line_item, trip_id) ON DELETE CASCADE
);

CREATE INDEX idx_passage_detail_passage ON passage_detail(passage_line_item, passage_trip_id);

COMMENT ON TABLE passage_detail IS 'Detalle de cada pasaje: asiento y precio pagado';
COMMENT ON COLUMN passage_detail.seat_number IS 'Número de asiento asignado';
COMMENT ON COLUMN passage_detail.price_paid IS 'Precio pagado por el pasaje';
COMMENT ON CONSTRAINT uq_passage_detail_trip_seat ON passage_detail IS 'CRÍTICO: Un asiento solo puede venderse una vez por viaje';

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Validar capacidad del vehículo antes de vender pasaje
CREATE OR REPLACE FUNCTION validate_vehicle_capacity()
RETURNS TRIGGER AS $$
DECLARE
    v_capacity INTEGER;
    v_sold_seats INTEGER;
BEGIN
    -- Obtener capacidad del vehículo del viaje
    SELECT v.capacity INTO v_capacity
    FROM trip t
    INNER JOIN vehicle v ON t.vehicle_plate = v.plate
    WHERE t.id = NEW.passage_trip_id;
    
    -- Contar asientos ya vendidos para este viaje
    SELECT COUNT(*) INTO v_sold_seats
    FROM passage_detail
    WHERE passage_trip_id = NEW.passage_trip_id;
    
    -- Validar que no se exceda la capacidad
    IF v_sold_seats >= v_capacity THEN
        RAISE EXCEPTION 'No hay asientos disponibles. Capacidad: %, Vendidos: %', 
            v_capacity, v_sold_seats;
    END IF;
    
    -- Validar que el número de asiento no exceda la capacidad
    IF NEW.seat_number > v_capacity THEN
        RAISE EXCEPTION 'El asiento % no existe. Capacidad del vehículo: %', 
            NEW.seat_number, v_capacity;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_vehicle_capacity
BEFORE INSERT ON passage_detail
FOR EACH ROW
EXECUTE FUNCTION validate_vehicle_capacity();

-- Trigger: Validar estado del viaje antes de vender pasaje
CREATE OR REPLACE FUNCTION validate_trip_state_for_sale()
RETURNS TRIGGER AS $$
DECLARE
    v_state_name VARCHAR(50);
BEGIN
    SELECT st.name INTO v_state_name
    FROM trip t
    INNER JOIN state_trip st ON t.state_trip_id = st.id
    WHERE t.id = NEW.trip_id;
    
    IF v_state_name IN ('Finalizado', 'Cancelado') THEN
        RAISE EXCEPTION 'No se puede vender un pasaje para un viaje %', v_state_name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_trip_state_for_sale
BEFORE INSERT ON passage
FOR EACH ROW
EXECUTE FUNCTION validate_trip_state_for_sale();

-- ============================================================================
-- VISTAS
-- ============================================================================

-- Vista: Información completa de viajes
CREATE OR REPLACE VIEW view_trips_complete AS
SELECT 
    t.id AS trip_id,
    t.date AS trip_date,
    t.departure_time,
    st.name AS trip_state,
    r.price AS route_price,
    co.name AS origin_city,
    so.name AS origin_state,
    cd.name AS destination_city,
    sd.name AS destination_state,
    v.plate AS vehicle_plate,
    v.model AS vehicle_model,
    v.capacity AS vehicle_capacity,
    e.name_1 || ' ' || e.last_name_1 AS driver_name,
    d.license AS driver_license,
    COALESCE(COUNT(pd.id_detail), 0) AS seats_sold,
    v.capacity - COALESCE(COUNT(pd.id_detail), 0) AS seats_available
FROM trip t
INNER JOIN state_trip st ON t.state_trip_id = st.id
INNER JOIN route r ON t.route_id = r.id
INNER JOIN city co ON r.origin_city_id = co.id
INNER JOIN state so ON co.state_id = so.id
INNER JOIN city cd ON r.destination_city_id = cd.id
INNER JOIN state sd ON cd.state_id = sd.id
INNER JOIN vehicle v ON t.vehicle_plate = v.plate
INNER JOIN driver d ON t.driver_code = d.employee_code
INNER JOIN employee e ON d.employee_code = e.code
LEFT JOIN passage p ON t.id = p.trip_id
LEFT JOIN passage_detail pd ON p.line_item = pd.passage_line_item AND p.trip_id = pd.passage_trip_id
GROUP BY t.id, st.name, r.price, co.name, so.name, cd.name, sd.name, 
         v.plate, v.model, v.capacity, e.name_1, e.last_name_1, d.license;

COMMENT ON VIEW view_trips_complete IS 'Vista consolidada de viajes con toda la información';

-- Vista: Pasajes activos con información completa
CREATE OR REPLACE VIEW view_passages_active AS
SELECT 
    pd.id_detail,
    pd.seat_number,
    pd.price_paid,
    p.purchase_date,
    sp.name AS passage_state,
    t.date AS trip_date,
    t.departure_time,
    co.name AS origin_city,
    cd.name AS destination_city,
    v.plate AS vehicle_plate,
    pas.document_passenger,
    pas.name_1 || ' ' || pas.last_name_1 AS passenger_name,
    pas.phone AS passenger_phone
FROM passage_detail pd
INNER JOIN passage p ON pd.passage_line_item = p.line_item AND pd.passage_trip_id = p.trip_id
INNER JOIN state_passage sp ON p.state_passage_id = sp.id
INNER JOIN trip t ON p.trip_id = t.id
INNER JOIN route r ON t.route_id = r.id
INNER JOIN city co ON r.origin_city_id = co.id
INNER JOIN city cd ON r.destination_city_id = cd.id
INNER JOIN vehicle v ON t.vehicle_plate = v.plate
INNER JOIN passenger pas ON p.passenger_document = pas.document_passenger
WHERE sp.name = 'Activo';

COMMENT ON VIEW view_passages_active IS 'Pasajes activos con información completa';

-- ============================================================================
-- DATOS INICIALES (SEED DATA)
-- ============================================================================

-- Estados de Colombia (principales)
INSERT INTO state (name) VALUES
('Norte de Santander'),
('Santander'),
('Cesar'),
('Boyacá');

-- Ciudades
INSERT INTO city (name, state_id) VALUES
('Ábrego', 1),
('Cúcuta', 1),
('Ocaña', 1),
('Pamplona', 1),
('Bucaramanga', 2),
('San Gil', 2),
('Valledupar', 3),
('Tunja', 4);

-- Estados de viaje
INSERT INTO state_trip (name) VALUES
('Programado'),
('En Curso'),
('Finalizado'),
('Cancelado');

-- Estados de vehículo
INSERT INTO state_vehicle (name) VALUES
('Disponible'),
('En Servicio'),
('Mantenimiento'),
('Inactivo');

-- Estados de pasaje
INSERT INTO state_passage (name) VALUES
('Activo'),
('Anulado'),
('Usado');

-- Vehículos
INSERT INTO vehicle (plate, model, capacity, state_vehicle_id) VALUES
('ABC123', 'Mercedes Benz OF-1721', 40, 1),
('XYZ789', 'Chevrolet NPR', 30, 1),
('DEF456', 'Volvo B270F', 40, 1),
('GHI789', 'Hino AK', 28, 1),
('JKL012', 'Scania K124', 45, 3),
('MNO345', 'Volkswagen Crafter', 20, 1);

-- Rutas
INSERT INTO route (price, origin_city_id, destination_city_id) VALUES
(18000.00, 1, 2),  -- Ábrego → Cúcuta
(18000.00, 2, 1),  -- Cúcuta → Ábrego
(12000.00, 1, 3),  -- Ábrego → Ocaña
(12000.00, 3, 1),  -- Ocaña → Ábrego
(35000.00, 1, 5),  -- Ábrego → Bucaramanga
(35000.00, 5, 1),  -- Bucaramanga → Ábrego
(25000.00, 2, 3),  -- Cúcuta → Ocaña
(25000.00, 3, 2);  -- Ocaña → Cúcuta

-- Empleados (Administrador)
INSERT INTO employee (code, name_1, name_2, last_name_1, last_name_2, phone, employee_type) VALUES
('ADM001', 'Karen', 'Marcela', 'Bayona', 'Moreno', '+573001234567', 'ADMIN'),
('ADM002', 'Keila', 'Nathaly', 'Vacca', 'Bacca', '+573009876543', 'ADMIN');

INSERT INTO admin (employee_code, access) VALUES
('ADM001', 'FULL_ACCESS'),
('ADM002', 'FULL_ACCESS');

-- Empleados (Conductores)
INSERT INTO employee (code, name_1, name_2, last_name_1, last_name_2, phone, employee_type) VALUES
('DRV001', 'Carlos', 'Alberto', 'Rodríguez', 'Pérez', '+573201111111', 'DRIVER'),
('DRV002', 'María', 'Elena', 'González', 'López', '+573202222222', 'DRIVER'),
('DRV003', 'José', 'Luis', 'Martínez', 'Ruiz', '+573203333333', 'DRIVER'),
('DRV004', 'Ana', 'María', 'Sánchez', 'Torres', '+573204444444', 'DRIVER'),
('DRV005', 'Luis', 'Fernando', 'Ramírez', 'Castro', '+573205555555', 'DRIVER');

INSERT INTO driver (employee_code, license, date_license) VALUES
('DRV001', 'LIC001234', '2026-12-31'),
('DRV002', 'LIC005678', '2027-06-30'),
('DRV003', 'LIC009012', '2026-09-15'),
('DRV004', 'LIC003456', '2027-03-20'),
('DRV005', 'LIC007890', '2026-11-30');

-- Empleados (Otros - Secretarias)
INSERT INTO employee (code, name_1, name_2, last_name_1, last_name_2, phone, employee_type) VALUES
('OTH001', 'Laura', 'Patricia', 'Díaz', 'Morales', '+573206666666', 'OTHER'),
('OTH002', 'Pedro', 'Antonio', 'Vargas', 'Silva', '+573207777777', 'OTHER');

INSERT INTO other_employee (employee_code) VALUES
('OTH001'),
('OTH002');

-- Pasajeros
INSERT INTO passenger (document_passenger, id, name_1, name_2, last_name_1, last_name_2, phone) VALUES
('PSG001', '1111111111', 'Juan', 'Carlos', 'Pérez', 'García', '+573101111111'),
('PSG002', '2222222222', 'Ana', 'María', 'Martínez', 'López', '+573102222222'),
('PSG003', '3333333333', 'Carlos', 'Alberto', 'Gómez', 'Ruiz', '+573103333333'),
('PSG004', '4444444444', 'Laura', 'Patricia', 'Sánchez', 'Torres', '+573104444444'),
('PSG005', '5555555555', 'Pedro', 'Luis', 'Ramírez', 'Castro', '+573105555555');

-- Viajes (para hoy y próximos días)
INSERT INTO trip (date, departure_time, state_trip_id, route_id, vehicle_plate, driver_code) VALUES
(CURRENT_DATE, '06:00:00', 1, 1, 'ABC123', 'DRV001'),
(CURRENT_DATE, '09:00:00', 1, 1, 'DEF456', 'DRV003'),
(CURRENT_DATE, '12:00:00', 1, 1, 'ABC123', 'DRV001'),
(CURRENT_DATE + 1, '06:00:00', 1, 1, 'ABC123', 'DRV001'),
(CURRENT_DATE + 1, '09:00:00', 1, 2, 'XYZ789', 'DRV002'),
(CURRENT_DATE + 2, '05:00:00', 1, 5, 'ABC123', 'DRV001');

-- Pasajes de ejemplo
INSERT INTO passage (line_item, purchase_date, trip_id, state_passage_id, passenger_document) VALUES
(1, CURRENT_DATE, 1, 1, 'PSG001'),
(2, CURRENT_DATE, 1, 1, 'PSG002'),
(3, CURRENT_DATE, 2, 1, 'PSG003');

INSERT INTO passage_detail (seat_number, price_paid, passage_line_item, passage_trip_id) VALUES
(5, 18000.00, 1, 1),
(10, 18000.00, 2, 1),
(15, 18000.00, 3, 2);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Contar registros por tabla
SELECT 'States' AS tabla, COUNT(*) AS total FROM state
UNION ALL SELECT 'Cities', COUNT(*) FROM city
UNION ALL SELECT 'Vehicles', COUNT(*) FROM vehicle
UNION ALL SELECT 'Employees', COUNT(*) FROM employee
UNION ALL SELECT 'Drivers', COUNT(*) FROM driver
UNION ALL SELECT 'Admins', COUNT(*) FROM admin
UNION ALL SELECT 'Other Employees', COUNT(*) FROM other_employee
UNION ALL SELECT 'Passengers', COUNT(*) FROM passenger
UNION ALL SELECT 'Routes', COUNT(*) FROM route
UNION ALL SELECT 'Trips', COUNT(*) FROM trip
UNION ALL SELECT 'Passages', COUNT(*) FROM passage
UNION ALL SELECT 'Passage Details', COUNT(*) FROM passage_detail;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
