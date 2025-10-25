package com.hacaritama.reservaspasajes.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Pasajero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String correo;
}

