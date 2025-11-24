-- Script para verificar los datos de administradores

-- Ver todos los empleados
SELECT * FROM employee WHERE employee_type = 'ADMIN';

-- Ver todos los administradores con sus contraseñas
SELECT 
    e.code,
    e.name_1,
    e.name_2,
    e.last_name_1,
    e.last_name_2,
    e.phone,
    e.employee_type,
    a.access,
    a.password
FROM admin a
INNER JOIN employee e ON a.employee_code = e.code;

-- Si no hay contraseñas, ejecutar:
-- UPDATE admin SET password = 'admin123' WHERE employee_code = 'ADM001';
-- UPDATE admin SET password = 'admin123' WHERE employee_code = 'ADM002';
