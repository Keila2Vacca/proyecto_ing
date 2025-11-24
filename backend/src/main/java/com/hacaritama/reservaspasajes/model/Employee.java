package com.hacaritama.reservaspasajes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employee")
@Inheritance(strategy = InheritanceType.JOINED)
public class Employee {
    @Id
    @Column(length = 20)
    private String code;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type", nullable = false)
    private EmployeeType employeeType;

    public enum EmployeeType {
        DRIVER, ADMIN, OTHER
    }
}
