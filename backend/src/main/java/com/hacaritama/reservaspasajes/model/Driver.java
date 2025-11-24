package com.hacaritama.reservaspasajes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "driver")
public class Driver extends Employee {
    @Column(nullable = false, unique = true, length = 20)
    private String license;

    @Column(name = "date_license", nullable = false)
    private LocalDate dateLicense;
}
