package com.hacaritama.reservaspasajes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "El código de empleado es requerido")
    private String code;

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}
