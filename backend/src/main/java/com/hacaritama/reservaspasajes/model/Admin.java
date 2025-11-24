package com.hacaritama.reservaspasajes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "admin")
public class Admin extends Employee {
    @Column(nullable = false, length = 100)
    private String access;

    @Column(length = 255)
    private String password;
}
