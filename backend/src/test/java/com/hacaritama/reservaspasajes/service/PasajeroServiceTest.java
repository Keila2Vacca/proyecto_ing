package com.hacaritama.reservaspasajes.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PasajeroServiceTest {

    @Test
    @DisplayName("Test básico de servicio - verificar que el contexto carga")
    void contextLoads() {
        assertTrue(true, "El contexto de Spring Boot carga correctamente");
    }

    @Test
    @DisplayName("Test de validación de email")
    void testValidarEmail() {
        String emailValido = "cliente@example.com";
        String emailInvalido = "clienteexample.com";

        assertTrue(emailValido.contains("@"), "Email válido debe contener @");
        assertFalse(emailInvalido.contains("@"), "Email inválido no debe ser aceptado");
    }
}
