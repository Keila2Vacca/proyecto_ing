-- ============================================================================
-- DATOS DE PRUEBA - Sistema Hacaritama
-- Versión: 1.0.0
-- Propósito: Datos de desarrollo y testing
-- ============================================================================

-- IMPORTANTE: Este script debe ejecutarse DESPUÉS de schema.sql

-- ============================================================================
-- LIMPIAR DATOS EXISTENTES (solo en desarrollo)
-- ============================================================================

TRUNCATE TABLE pasajes, ventas, viajes, conductores, vehiculos, rutas, pasajeros RESTART IDENTITY CASCADE;

-- ============================================================================
-- PASAJEROS (Usuarios del sistema)
-- ============================================================================

-- Administrador (Password: Admin123!)
INSERT INTO pasajeros (tipo_documento, numero_documento, nombre, apellido, email, telefono, password_hash, rol) VALUES
('CC', '1234567890', 'Administrador', 'Sistema', 'admin@hacaritama.com', '+573001234567', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Secretaria (Password: Secretaria123!)
INSERT INTO pasajeros (tipo_documento, numero_documento, nombre, apellido, email, telefono, password_hash, rol) VALUES
('CC', '9876543210', 'María', 'Rodríguez', 'secretaria@hacaritama.com', '+573009876543', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SECRETARIA');

-- Clientes de prueba (Password: Cliente123!)
INSERT INTO pasajeros (tipo_documento, numero_documento, nombre, apellido, email, telefono, password_hash, rol) VALUES
('CC', '1111111111', 'Juan', 'Pérez García', 'juan.perez@email.com', '+573101111111', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENTE'),
('CC', '2222222222', 'Ana', 'Martínez López', 'ana.martinez@email.com', '+573102222222', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENTE'),
('CC', '3333333333', 'Carlos', 'Gómez Ruiz', 'carlos.gomez@email.com', '+573103333333', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENTE'),
('TI', '4444444444', 'Laura', 'Sánchez Torres', 'laura.sanchez@email.com', '+573104444444', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENTE'),
('CC', '5555555555', 'Pedro', 'Ramírez Castro', 'pedro.ramirez@email.com', '+573105555555', 
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENTE');

-- ============================================================================
-- RUTAS
-- ============================================================================

INSERT INTO rutas (origen, destino, distancia_km, duracion_estimada, precio_base, activo) VALUES
('Ábrego', 'Cúcuta', 85.5, '2 hours 30 minutes', 18000.00, TRUE),
('Cúcuta', 'Ábrego', 85.5, '2 hours 30 minutes', 18000.00, TRUE),
('Ábrego', 'Ocaña', 45.0, '1 hour 15 minutes', 12000.00, TRUE),
('Ocaña', 'Ábrego', 45.0, '1 hour 15 minutes', 12000.00, TRUE),
('Ábrego', 'Bucaramanga', 180.0, '4 hours', 35000.00, TRUE),
('Bucaramanga', 'Ábrego', 180.0, '4 hours', 35000.00, TRUE),
('Cúcuta', 'Ocaña', 120.0, '3 hours', 25000.00, TRUE),
('Ocaña', 'Cúcuta', 120.0, '3 hours', 25000.00, TRUE);

-- ============================================================================
-- VEHÍCULOS
-- ============================================================================

INSERT INTO vehiculos (placa, tipo, marca, modelo, anio, capacidad_asientos, estado, ultima_revision) VALUES
('ABC123', 'BUS', 'Mercedes Benz', 'OF-1721', 2020, 40, 'DISPONIBLE', '2025-01-15'),
('XYZ789', 'BUSETA', 'Chevrolet', 'NPR', 2021, 30, 'DISPONIBLE', '2025-01-10'),
('DEF456', 'BUS', 'Volvo', 'B270F', 2019, 40, 'DISPONIBLE', '2025-01-20'),
('GHI789', 'BUSETA', 'Hino', 'AK', 2022, 28, 'DISPONIBLE', '2025-01-18'),
('JKL012', 'BUS', 'Scania', 'K124', 2018, 45, 'MANTENIMIENTO', '2024-12-15'),
('MNO345', 'MICROBUS', 'Volkswagen', 'Crafter', 2023, 20, 'DISPONIBLE', '2025-01-22');

-- ============================================================================
-- CONDUCTORES
-- ============================================================================

INSERT INTO conductores (tipo_documento, numero_documento, nombre, apellido, numero_licencia, categoria_licencia, fecha_vencimiento_licencia, telefono, email, activo, fecha_contratacion) VALUES
('CC', '10111213', 'Carlos', 'Rodríguez Pérez', 'LIC001234', 'C2', '2026-12-31', '+573201111111', 'carlos.conductor@hacaritama.com', TRUE, '2020-01-15'),
('CC', '14151617', 'María', 'González López', 'LIC005678', 'C2', '2027-06-30', '+573202222222', 'maria.conductor@hacaritama.com', TRUE, '2021-03-20'),
('CC', '18192021', 'José', 'Martínez Ruiz', 'LIC009012', 'C2', '2026-09-15', '+573203333333', 'jose.conductor@hacaritama.com', TRUE, '2019-11-10'),
('CC', '22232425', 'Ana', 'Sánchez Torres', 'LIC003456', 'C2', '2027-03-20', '+573204444444', 'ana.conductor@hacaritama.com', TRUE, '2022-05-01'),
('CC', '26272829', 'Luis', 'Ramírez Castro', 'LIC007890', 'C2', '2026-11-30', '+573205555555', 'luis.conductor@hacaritama.com', TRUE, '2020-08-15');

-- ============================================================================
-- VIAJES (Programados para los próximos días)
-- ============================================================================

-- Viajes para HOY
INSERT INTO viajes (id_ruta, id_vehiculo, id_conductor, fecha, hora_salida, hora_llegada_estimada, estado, asientos_disponibles, precio_base) VALUES
(1, 1, 1, CURRENT_DATE, '06:00:00', '08:30:00', 'PROGRAMADO', 40, 18000.00),
(2, 2, 2, CURRENT_DATE, '07:00:00', '09:30:00', 'PROGRAMADO', 30, 18000.00),
(1, 3, 3, CURRENT_DATE, '09:00:00', '11:30:00', 'PROGRAMADO', 40, 18000.00),
(2, 4, 4, CURRENT_DATE, '10:00:00', '12:30:00', 'PROGRAMADO', 28, 18000.00),
(1, 1, 1, CURRENT_DATE, '12:00:00', '14:30:00', 'PROGRAMADO', 40, 18000.00),
(2, 2, 2, CURRENT_DATE, '13:00:00', '15:30:00', 'PROGRAMADO', 30, 18000.00),
(1, 3, 3, CURRENT_DATE, '15:00:00', '17:30:00', 'PROGRAMADO', 40, 18000.00),
(2, 4, 4, CURRENT_DATE, '16:00:00', '18:30:00', 'PROGRAMADO', 28, 18000.00);

-- Viajes para MAÑANA
INSERT INTO viajes (id_ruta, id_vehiculo, id_conductor, fecha, hora_salida, hora_llegada_estimada, estado, asientos_disponibles, precio_base) VALUES
(1, 1, 1, CURRENT_DATE + 1, '06:00:00', '08:30:00', 'PROGRAMADO', 40, 18000.00),
(2, 2, 2, CURRENT_DATE + 1, '07:00:00', '09:30:00', 'PROGRAMADO', 30, 18000.00),
(3, 6, 5, CURRENT_DATE + 1, '08:00:00', '09:15:00', 'PROGRAMADO', 20, 12000.00),
(4, 6, 5, CURRENT_DATE + 1, '10:00:00', '11:15:00', 'PROGRAMADO', 20, 12000.00),
(1, 3, 3, CURRENT_DATE + 1, '12:00:00', '14:30:00', 'PROGRAMADO', 40, 18000.00),
(2, 4, 4, CURRENT_DATE + 1, '13:00:00', '15:30:00', 'PROGRAMADO', 28, 18000.00);

-- Viajes para PASADO MAÑANA
INSERT INTO viajes (id_ruta, id_vehiculo, id_conductor, fecha, hora_salida, hora_llegada_estimada, estado, asientos_disponibles, precio_base) VALUES
(5, 1, 1, CURRENT_DATE + 2, '05:00:00', '09:00:00', 'PROGRAMADO', 40, 35000.00),
(6, 3, 3, CURRENT_DATE + 2, '06:00:00', '10:00:00', 'PROGRAMADO', 40, 35000.00),
(7, 2, 2, CURRENT_DATE + 2, '07:00:00', '10:00:00', 'PROGRAMADO', 30, 25000.00),
(8, 4, 4, CURRENT_DATE + 2, '08:00:00', '11:00:00', 'PROGRAMADO', 28, 25000.00);

-- ============================================================================
-- VENTAS Y PASAJES (Ejemplos de ventas ya realizadas)
-- ============================================================================

-- Venta 1: Juan Pérez compra 1 pasaje para viaje de hoy 06:00
INSERT INTO ventas (id_pasajero, fecha_venta, total, metodo_pago, estado) VALUES
(3, CURRENT_TIMESTAMP - INTERVAL '2 hours', 18000.00, 'TARJETA', 'COMPLETADA');

INSERT INTO pasajes (id_venta, id_viaje, id_pasajero, numero_asiento, precio, codigo_qr) VALUES
(1, 1, 3, 5, 18000.00, 'HAC-2025-000001-QR');

-- Venta 2: Ana Martínez compra 2 pasajes para viaje de hoy 09:00
INSERT INTO ventas (id_pasajero, fecha_venta, total, metodo_pago, estado) VALUES
(4, CURRENT_TIMESTAMP - INTERVAL '1 hour', 36000.00, 'PSE', 'COMPLETADA');

INSERT INTO pasajes (id_venta, id_viaje, id_pasajero, numero_asiento, precio, codigo_qr) VALUES
(2, 3, 4, 10, 18000.00, 'HAC-2025-000002-QR'),
(2, 3, 4, 11, 18000.00, 'HAC-2025-000003-QR');

-- Venta 3: Carlos Gómez compra 1 pasaje para viaje de mañana 06:00
INSERT INTO ventas (id_pasajero, fecha_venta, total, metodo_pago, estado) VALUES
(5, CURRENT_TIMESTAMP - INTERVAL '30 minutes', 18000.00, 'EFECTIVO', 'COMPLETADA');

INSERT INTO pasajes (id_venta, id_viaje, id_pasajero, numero_asiento, precio, codigo_qr) VALUES
(3, 9, 5, 15, 18000.00, 'HAC-2025-000004-QR');

-- Venta 4: Laura Sánchez compra 1 pasaje para viaje de pasado mañana (ruta larga)
INSERT INTO ventas (id_pasajero, fecha_venta, total, metodo_pago, estado) VALUES
(6, CURRENT_TIMESTAMP - INTERVAL '15 minutes', 35000.00, 'NEQUI', 'COMPLETADA');

INSERT INTO pasajes (id_venta, id_viaje, id_pasajero, numero_asiento, precio, codigo_qr) VALUES
(4, 17, 6, 20, 35000.00, 'HAC-2025-000005-QR');

-- Venta 5: Pedro Ramírez compra 3 pasajes para viaje de hoy 12:00
INSERT INTO ventas (id_pasajero, fecha_venta, total, metodo_pago, estado) VALUES
(7, CURRENT_TIMESTAMP - INTERVAL '45 minutes', 54000.00, 'TARJETA', 'COMPLETADA');

INSERT INTO pasajes (id_venta, id_viaje, id_pasajero, numero_asiento, precio, codigo_qr) VALUES
(5, 5, 7, 1, 18000.00, 'HAC-2025-000006-QR'),
(5, 5, 7, 2, 18000.00, 'HAC-2025-000007-QR'),
(5, 5, 7, 3, 18000.00, 'HAC-2025-000008-QR');

-- ============================================================================
-- VERIFICACIÓN DE DATOS
-- ============================================================================

-- Contar registros por tabla
SELECT 'Pasajeros' AS tabla, COUNT(*) AS total FROM pasajeros
UNION ALL
SELECT 'Rutas', COUNT(*) FROM rutas
UNION ALL
SELECT 'Vehículos', COUNT(*) FROM vehiculos
UNION ALL
SELECT 'Conductores', COUNT(*) FROM conductores
UNION ALL
SELECT 'Viajes', COUNT(*) FROM viajes
UNION ALL
SELECT 'Ventas', COUNT(*) FROM ventas
UNION ALL
SELECT 'Pasajes', COUNT(*) FROM pasajes;

-- Verificar viajes con asientos vendidos
SELECT 
    v.id_viaje,
    v.fecha,
    v.hora_salida,
    r.origen || ' → ' || r.destino AS ruta,
    vh.capacidad_asientos AS capacidad_total,
    v.asientos_disponibles,
    (vh.capacidad_asientos - v.asientos_disponibles) AS asientos_vendidos,
    ROUND(((vh.capacidad_asientos - v.asientos_disponibles)::DECIMAL / vh.capacidad_asientos * 100), 2) AS porcentaje_ocupacion
FROM viajes v
INNER JOIN rutas r ON v.id_ruta = r.id_ruta
INNER JOIN vehiculos vh ON v.id_vehiculo = vh.id_vehiculo
WHERE v.asientos_disponibles < vh.capacidad_asientos
ORDER BY v.fecha, v.hora_salida;

-- ============================================================================
-- NOTAS
-- ============================================================================

-- Credenciales de prueba:
-- Admin:      admin@hacaritama.com / Admin123!
-- Secretaria: secretaria@hacaritama.com / Secretaria123!
-- Cliente:    juan.perez@email.com / Cliente123!

-- Los passwords están hasheados con BCrypt (factor 10)
-- En producción, cambiar todas las contraseñas por defecto
