-- ============================================================================
-- AGREGAR AUTENTICACIÓN AL MODELO HACARITAMA
-- Este script agrega campos de email y password para login
-- ============================================================================

-- 1. Agregar email y password a la tabla EMPLOYEE
ALTER TABLE employee 
ADD COLUMN email VARCHAR(100) UNIQUE,
ADD COLUMN password VARCHAR(255);

-- 2. Agregar email y password a la tabla PASSENGER
ALTER TABLE passenger 
ADD COLUMN email VARCHAR(100) UNIQUE,
ADD COLUMN password VARCHAR(255);

-- 3. Actualizar empleados con emails y passwords
-- Password: "Admin123!" hasheado con BCrypt
UPDATE employee SET 
    email = 'karen.bayona@hacaritama.com',
    password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE code = 'ADM001';

UPDATE employee SET 
    email = 'keila.vacca@hacaritama.com',
    password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE code = 'ADM002';

-- Conductores (password: "Driver123!")
UPDATE employee SET 
    email = 'carlos.rodriguez@hacaritama.com',
    password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE code = 'DRV001';

UPDATE employee SET 
    email = 'maria.gonzalez@hacaritama.com',
    password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE code = 'DRV002';

UPDATE employee SET 
    email = 'jose.martinez@hacaritama.com',
    password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE code = 'DRV003';

UPDATE employee SET 
    email = 'ana.sanchez@hacaritama.com',
    password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE code = 'DRV004';

UPDATE employee SET 
    email = 'luis.ramirez@hacaritama.com',
    password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE code = 'DRV005';

-- Secretarias (password: "Staff123!")
UPDATE employee SET 
    email = 'laura.diaz@hacaritama.com',
    password = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGQRQXXSvfMhNI7HI8K6FcK'
WHERE code = 'OTH001';

UPDATE employee SET 
    email = 'pedro.vargas@hacaritama.com',
    password = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGQRQXXSvfMhNI7HI8K6FcK'
WHERE code = 'OTH002';

-- 4. Actualizar pasajeros con emails y passwords
-- Password: "Cliente123!"
UPDATE passenger SET 
    email = 'juan.perez@email.com',
    password = '$2a$10$DOwnh7Eh4hCz7vFLVtEqNOJ8vXdQRdYMJP.RGnEw5WxJvXQKKJe3u'
WHERE document_passenger = 'PSG001';

UPDATE passenger SET 
    email = 'ana.martinez@email.com',
    password = '$2a$10$DOwnh7Eh4hCz7vFLVtEqNOJ8vXdQRdYMJP.RGnEw5WxJvXQKKJe3u'
WHERE document_passenger = 'PSG002';

UPDATE passenger SET 
    email = 'carlos.gomez@email.com',
    password = '$2a$10$DOwnh7Eh4hCz7vFLVtEqNOJ8vXdQRdYMJP.RGnEw5WxJvXQKKJe3u'
WHERE document_passenger = 'PSG003';

UPDATE passenger SET 
    email = 'laura.sanchez@email.com',
    password = '$2a$10$DOwnh7Eh4hCz7vFLVtEqNOJ8vXdQRdYMJP.RGnEw5WxJvXQKKJe3u'
WHERE document_passenger = 'PSG004';

UPDATE passenger SET 
    email = 'pedro.ramirez@email.com',
    password = '$2a$10$DOwnh7Eh4hCz7vFLVtEqNOJ8vXdQRdYMJP.RGnEw5WxJvXQKKJe3u'
WHERE document_passenger = 'PSG005';

-- 5. Crear índices para búsquedas rápidas
CREATE INDEX idx_employee_email ON employee(email);
CREATE INDEX idx_passenger_email ON passenger(email);

-- 6. Verificar usuarios creados
SELECT 'EMPLEADOS' AS tipo, code AS id, email, 
       CASE employee_type 
           WHEN 'ADMIN' THEN 'Administrador'
           WHEN 'DRIVER' THEN 'Conductor'
           WHEN 'OTHER' THEN 'Secretaria'
       END AS rol
FROM employee
WHERE email IS NOT NULL
UNION ALL
SELECT 'PASAJEROS', document_passenger, email, 'Cliente'
FROM passenger
WHERE email IS NOT NULL
ORDER BY tipo, id;

-- ============================================================================
-- CREDENCIALES DE ACCESO
-- ============================================================================
/*
ADMINISTRADORES:
- Email: karen.bayona@hacaritama.com
  Password: Admin123!

- Email: keila.vacca@hacaritama.com
  Password: Admin123!

CONDUCTORES:
- Email: carlos.rodriguez@hacaritama.com
  Password: Driver123!

SECRETARIAS:
- Email: laura.diaz@hacaritama.com
  Password: Staff123!

CLIENTES:
- Email: juan.perez@email.com
  Password: Cliente123!

- Email: ana.martinez@email.com
  Password: Cliente123!
*/
