-- Script para agregar contraseñas a los administradores
-- Ejecutar después de schema_v2.sql

-- Agregar columna password a la tabla admin si no existe
ALTER TABLE admin ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Actualizar contraseñas para los administradores existentes
-- Contraseña: admin123 (en producción usar BCrypt)
UPDATE admin SET password = 'admin123' WHERE employee_code = 'ADM001';
UPDATE admin SET password = 'admin123' WHERE employee_code = 'ADM002';

-- Verificar
SELECT e.code, e.name_1, e.last_name_1, a.access, a.password 
FROM admin a
INNER JOIN employee e ON a.employee_code = e.code;
