package com.hacaritama.reservaspasajes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "passenger")
public class Pasajero {
    @Id
    @Column(name = "document_passenger", length = 20)
    private String documentPassenger;

    @Column(nullable = false, unique = true, length = 20)
    private String id;

    @Column(name = "name_1", nullable = false, length = 50)
    private String name1;

    @Column(name = "name_2", length = 50)
    private String name2;

    @Column(name = "last_name_1", nullable = false, length = 50)
    private String lastName1;

    @Column(name = "last_name_2", length = 50)
    private String lastName2;

    @Column(nullable = false, length = 20)
    private String phone;
}

