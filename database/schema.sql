-- ============================================================================
-- SISTEMA DE RESERVA DE PASAJES HACARITAMA
-- Script DDL - Creación de Base de Datos
-- Versión: 1.0.0
-- Fecha: 2025-01-25
-- DBMS: PostgreSQL 14+
-- ============================================================================

-- Crear base de datos (ejecutar como superusuario)
-- CREATE DATABASE hacaritama_db
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'es_CO.UTF-8'
--     LC_CTYPE = 'es_CO.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Conectar a la base de datos
-- \c hacaritama_db

-- ============================================================================
-- TIPOS ENUMERADOS
-- ============================================================================

CREATE TYPE tipo_documento_enum AS ENUM ('CC', 'TI', 'CE', 'PASAPORTE');
CREATE TYPE rol_usuario_enum AS ENUM ('CLIENTE', 'SECRETARIA', 'ADMIN');
CREATE TYPE tipo_vehiculo_enum AS ENUM ('BUS', 'BUSETA', 'MICROBUS');
CREATE TYPE estado_vehiculo_enum AS ENUM ('DISPONIBLE', 'EN_SERVICIO', 'MANTENIMIENTO', 'INACTIVO');
CREATE TYPE estado_viaje_enum AS ENUM ('PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO');
CREATE TYPE metodo_pago_enum AS ENUM ('EFECTIVO', 'TARJETA', 'PSE', 'NEQUI', 'DAVIPLATA');
CREATE TYPE estado_venta_enum AS ENUM ('COMPLETADA', 'ANULADA', 'PENDIENTE');
CREATE TYPE estado_pasaje_enum AS ENUM ('ACTIVO', 'ANULADO', 'USADO');

-- ============================================================================
-- TABLA: PASAJEROS
-- Almacena información de clientes y usuarios del sistema
-- ============================================================================

CREATE TABLE pasajeros (
    id_pasajero SERIAL PRIMARY KEY,
    tipo_documento tipo_documento_enum NOT NULL DEFAULT 'CC',
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol rol_usuario_enum NOT NULL DEFAULT 'CLIENTE',
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT chk_email_formato CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_telefono_formato CHECK (telefono ~* '^\+?[0-9]{7,15}$')
);

CREATE INDEX idx_pasajeros_email ON pasajeros(email);
CREATE INDEX idx_pasajeros_documento ON pasajeros(numero_documento);
CREATE INDEX idx_pasajeros_rol ON pasajeros(rol);

COMMENT ON TABLE pasajeros IS 'Usuarios del sistema: clientes, secretarias y administradores';
COMMENT ON COLUMN pasajeros.password_hash IS 'Contraseña hasheada con BCrypt';

-- ============================================================================
-- TABLA: RUTAS
-- Define los trayectos disponibles (origen → destino)
-- ============================================================================

CREATE TABLE rutas (
    id_ruta SERIAL PRIMARY KEY,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    distancia_km DECIMAL(6,2) NOT NULL,
    duracion_estimada INTERVAL NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_distancia_positiva CHECK (distancia_km > 0),
    CONSTRAINT chk_precio_positivo CHECK (precio_base > 0),
    CONSTRAINT chk_origen_destino_diferentes CHECK (origen <> destino),
    CONSTRAINT uq_ruta_origen_destino UNIQUE (origen, destino)
);

CREATE INDEX idx_rutas_origen_destino ON rutas(origen, destino);
CREATE INDEX idx_rutas_activo ON rutas(activo);

COMMENT ON TABLE rutas IS 'Rutas de transporte intermunicipal';
COMMENT ON COLUMN rutas.duracion_estimada IS 'Tiempo estimado de viaje (ej: 2 hours 30 minutes)';

-- ============================================================================
-- TABLA: VEHÍCULOS
-- Flota de buses y busetas de la cooperativa
-- ============================================================================

CREATE TABLE vehiculos (
    id_vehiculo SERIAL PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    tipo tipo_vehiculo_enum NOT NULL DEFAULT 'BUS',
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL,
    capacidad_asientos INTEGER NOT NULL,
    estado estado_vehiculo_enum NOT NULL DEFAULT 'DISPONIBLE',
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_revision DATE,
    
    CONSTRAINT chk_placa_formato CHECK (placa ~* '^[A-Z]{3}[0-9]{3}$'),
    CONSTRAINT chk_capacidad_valida CHECK (capacidad_asientos BETWEEN 10 AND 60),
    CONSTRAINT chk_anio_valido CHECK (anio BETWEEN 1990 AND EXTRACT(YEAR FROM CURRENT_DATE) + 1)
);

CREATE INDEX idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);

COMMENT ON TABLE vehiculos IS 'Flota de vehículos de la cooperativa';
COMMENT ON COLUMN vehiculos.placa IS 'Formato: ABC123 (3 letras + 3 números)';

-- ============================================================================
-- TABLA: CONDUCTORES
-- Personal operativo autorizado para conducir
-- ============================================================================

CREATE TABLE conductores (
    id_conductor SERIAL PRIMARY KEY,
    tipo_documento tipo_documento_enum NOT NULL DEFAULT 'CC',
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_licencia VARCHAR(20) NOT NULL UNIQUE,
    categoria_licencia VARCHAR(5) NOT NULL,
    fecha_vencimiento_licencia DATE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_contratacion DATE NOT NULL DEFAULT CURRENT_DATE,
    
    CONSTRAINT chk_licencia_vigente CHECK (fecha_vencimiento_licencia > CURRENT_DATE),
    CONSTRAINT chk_categoria_valida CHECK (categoria_licencia IN ('C1', 'C2', 'C3'))
);

CREATE INDEX idx_conductores_documento ON conductores(numero_documento);
CREATE INDEX idx_conductores_licencia ON conductores(numero_licencia);
CREATE INDEX idx_conductores_activo ON conductores(activo);

COMMENT ON TABLE conductores IS 'Conductores certificados de la cooperativa';
COMMENT ON COLUMN conductores.categoria_licencia IS 'C1: Automóviles, C2: Camiones, C3: Vehículos articulados';

-- ============================================================================
-- TABLA: VIAJES
-- Instancias específicas de servicio programado
-- ============================================================================

CREATE TABLE viajes (
    id_viaje SERIAL PRIMARY KEY,
    id_ruta INTEGER NOT NULL REFERENCES rutas(id_ruta) ON DELETE RESTRICT,
    id_vehiculo INTEGER NOT NULL REFERENCES vehiculos(id_vehiculo) ON DELETE RESTRICT,
    id_conductor INTEGER NOT NULL REFERENCES conductores(id_conductor) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    hora_salida TIME NOT NULL,
    hora_llegada_estimada TIME NOT NULL,
    estado estado_viaje_enum NOT NULL DEFAULT 'PROGRAMADO',
    asientos_disponibles INTEGER NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    
    CONSTRAINT chk_asientos_no_negativos CHECK (asientos_disponibles >= 0),
    CONSTRAINT chk_precio_viaje_positivo CHECK (precio_base > 0),
    CONSTRAINT chk_hora_salida_llegada CHECK (hora_llegada_estimada > hora_salida),
    CONSTRAINT uq_viaje_vehiculo_fecha_hora UNIQUE (id_vehiculo, fecha, hora_salida)
);

CREATE INDEX idx_viajes_fecha ON viajes(fecha);
CREATE INDEX idx_viajes_ruta ON viajes(id_ruta);
CREATE INDEX idx_viajes_estado ON viajes(estado);
CREATE INDEX idx_viajes_fecha_ruta ON viajes(fecha, id_ruta);

COMMENT ON TABLE viajes IS 'Viajes programados con fecha, hora, vehículo y conductor específicos';
COMMENT ON COLUMN viajes.asientos_disponibles IS 'Se actualiza automáticamente con trigger al vender/anular pasajes';

-- ============================================================================
-- TABLA: VENTAS
-- Transacciones comerciales de pasajes
-- ============================================================================

CREATE TABLE ventas (
    id_venta SERIAL PRIMARY KEY,
    id_pasajero INTEGER NOT NULL REFERENCES pasajeros(id_pasajero) ON DELETE RESTRICT,
    fecha_venta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago metodo_pago_enum NOT NULL DEFAULT 'EFECTIVO',
    estado estado_venta_enum NOT NULL DEFAULT 'COMPLETADA',
    referencia_pago VARCHAR(100),
    observaciones TEXT,
    
    CONSTRAINT chk_total_positivo CHECK (total > 0)
);

CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_pasajero ON ventas(id_pasajero);
CREATE INDEX idx_ventas_estado ON ventas(estado);

COMMENT ON TABLE ventas IS 'Registro de transacciones de venta de pasajes';
COMMENT ON COLUMN ventas.referencia_pago IS 'ID de transacción de pasarela de pago (si aplica)';

-- ============================================================================
-- TABLA: PASAJES
-- Comprobante individual de viaje (ticket)
-- ============================================================================

CREATE TABLE pasajes (
    id_pasaje SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL REFERENCES ventas(id_venta) ON DELETE RESTRICT,
    id_viaje INTEGER NOT NULL REFERENCES viajes(id_viaje) ON DELETE RESTRICT,
    id_pasajero INTEGER NOT NULL REFERENCES pasajeros(id_pasajero) ON DELETE RESTRICT,
    numero_asiento INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado estado_pasaje_enum NOT NULL DEFAULT 'ACTIVO',
    codigo_qr VARCHAR(255),
    fecha_emision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_anulacion TIMESTAMP,
    motivo_anulacion TEXT,
    
    CONSTRAINT chk_numero_asiento_positivo CHECK (numero_asiento > 0),
    CONSTRAINT chk_precio_pasaje_positivo CHECK (precio > 0),
    CONSTRAINT uq_viaje_asiento UNIQUE (id_viaje, numero_asiento)
);

CREATE INDEX idx_pasajes_venta ON pasajes(id_venta);
CREATE INDEX idx_pasajes_viaje ON pasajes(id_viaje);
CREATE INDEX idx_pasajes_pasajero ON pasajes(id_pasajero);
CREATE INDEX idx_pasajes_estado ON pasajes(estado);
CREATE INDEX idx_pasajes_codigo_qr ON pasajes(codigo_qr);

COMMENT ON TABLE pasajes IS 'Pasajes individuales emitidos';
COMMENT ON CONSTRAINT uq_viaje_asiento ON pasajes IS 'CRÍTICO: Un asiento solo puede venderse una vez por viaje';

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Actualizar asientos disponibles al vender pasaje
CREATE OR REPLACE FUNCTION actualizar_asientos_venta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'ACTIVO' THEN
        UPDATE viajes 
        SET asientos_disponibles = asientos_disponibles - 1,
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_viaje = NEW.id_viaje;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_asientos_venta
AFTER INSERT ON pasajes
FOR EACH ROW
EXECUTE FUNCTION actualizar_asientos_venta();

-- Trigger: Liberar asiento al anular pasaje
CREATE OR REPLACE FUNCTION liberar_asiento_anulacion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'ANULADO' AND OLD.estado = 'ACTIVO' THEN
        UPDATE viajes 
        SET asientos_disponibles = asientos_disponibles + 1,
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_viaje = NEW.id_viaje;
        
        NEW.fecha_anulacion = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_liberar_asiento_anulacion
BEFORE UPDATE ON pasajes
FOR EACH ROW
WHEN (OLD.estado IS DISTINCT FROM NEW.estado)
EXECUTE FUNCTION liberar_asiento_anulacion();

-- Trigger: Validar que no se vendan pasajes para viajes finalizados
CREATE OR REPLACE FUNCTION validar_estado_viaje_venta()
RETURNS TRIGGER AS $$
DECLARE
    v_estado estado_viaje_enum;
BEGIN
    SELECT estado INTO v_estado FROM viajes WHERE id_viaje = NEW.id_viaje;
    
    IF v_estado IN ('FINALIZADO', 'CANCELADO') THEN
        RAISE EXCEPTION 'No se puede vender un pasaje para un viaje % o %', 
            v_estado, v_estado;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_estado_viaje_venta
BEFORE INSERT ON pasajes
FOR EACH ROW
EXECUTE FUNCTION validar_estado_viaje_venta();

-- ============================================================================
-- VISTAS
-- ============================================================================

-- Vista: Información completa de viajes
CREATE OR REPLACE VIEW vista_viajes_completos AS
SELECT 
    v.id_viaje,
    v.fecha,
    v.hora_salida,
    v.hora_llegada_estimada,
    v.estado AS estado_viaje,
    v.asientos_disponibles,
    v.precio_base,
    r.origen,
    r.destino,
    r.distancia_km,
    r.duracion_estimada,
    vh.placa AS vehiculo_placa,
    vh.tipo AS vehiculo_tipo,
    vh.marca AS vehiculo_marca,
    vh.modelo AS vehiculo_modelo,
    vh.capacidad_asientos AS vehiculo_capacidad,
    c.nombre || ' ' || c.apellido AS conductor_nombre,
    c.numero_licencia AS conductor_licencia,
    c.telefono AS conductor_telefono,
    ROUND((v.asientos_disponibles::DECIMAL / vh.capacidad_asientos * 100), 2) AS porcentaje_disponibilidad
FROM viajes v
INNER JOIN rutas r ON v.id_ruta = r.id_ruta
INNER JOIN vehiculos vh ON v.id_vehiculo = vh.id_vehiculo
INNER JOIN conductores c ON v.id_conductor = c.id_conductor;

COMMENT ON VIEW vista_viajes_completos IS 'Vista consolidada de viajes con toda la información relacionada';

-- Vista: Pasajes activos con información del viaje
CREATE OR REPLACE VIEW vista_pasajes_activos AS
SELECT 
    p.id_pasaje,
    p.numero_asiento,
    p.precio,
    p.codigo_qr,
    p.fecha_emision,
    pas.nombre || ' ' || pas.apellido AS pasajero_nombre,
    pas.numero_documento AS pasajero_documento,
    pas.email AS pasajero_email,
    pas.telefono AS pasajero_telefono,
    v.fecha AS viaje_fecha,
    v.hora_salida,
    v.hora_llegada_estimada,
    r.origen,
    r.destino,
    vh.placa AS vehiculo_placa,
    c.nombre || ' ' || c.apellido AS conductor_nombre
FROM pasajes p
INNER JOIN pasajeros pas ON p.id_pasajero = pas.id_pasajero
INNER JOIN viajes v ON p.id_viaje = v.id_viaje
INNER JOIN rutas r ON v.id_ruta = r.id_ruta
INNER JOIN vehiculos vh ON v.id_vehiculo = vh.id_vehiculo
INNER JOIN conductores c ON v.id_conductor = c.id_conductor
WHERE p.estado = 'ACTIVO';

COMMENT ON VIEW vista_pasajes_activos IS 'Pasajes activos con información completa del viaje';

-- ============================================================================
-- DATOS INICIALES (SEED DATA)
-- ============================================================================

-- Insertar usuario administrador por defecto
-- Password: Admin123! (debe cambiarse en producción)
INSERT INTO pasajeros (tipo_documento, numero_documento, nombre, apellido, email, telefono, password_hash, rol)
VALUES ('CC', '1234567890', 'Administrador', 'Sistema', 'admin@hacaritama.com', '+573001234567', 
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Insertar rutas principales
INSERT INTO rutas (origen, destino, distancia_km, duracion_estimada, precio_base, activo) VALUES
('Ábrego', 'Cúcuta', 85.5, '2 hours 30 minutes', 18000.00, TRUE),
('Cúcuta', 'Ábrego', 85.5, '2 hours 30 minutes', 18000.00, TRUE),
('Ábrego', 'Ocaña', 45.0, '1 hour 15 minutes', 12000.00, TRUE),
('Ocaña', 'Ábrego', 45.0, '1 hour 15 minutes', 12000.00, TRUE);

-- ============================================================================
-- PERMISOS
-- ============================================================================

-- Crear rol de aplicación (opcional, para producción)
-- CREATE ROLE hacaritama_app WITH LOGIN PASSWORD 'secure_password_here';
-- GRANT CONNECT ON DATABASE hacaritama_db TO hacaritama_app;
-- GRANT USAGE ON SCHEMA public TO hacaritama_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hacaritama_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hacaritama_app;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

-- Verificar la creación de tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verificar la creación de vistas
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;
