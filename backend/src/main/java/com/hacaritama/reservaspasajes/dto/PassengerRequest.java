package com.hacaritama.reservaspasajes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerRequest {
    @NotBlank(message = "El documento del pasajero es requerido")
    private String documentPassenger;

    @NotBlank(message = "El número de identificación es requerido")
    private String id;

    @NotBlank(message = "El primer nombre es requerido")
    private String name1;

    private String name2;

    @NotBlank(message = "El primer apellido es requerido")
    private String lastName1;

    private String lastName2;

    @NotBlank(message = "El teléfono es requerido")
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Formato de teléfono inválido")
    private String phone;
}
