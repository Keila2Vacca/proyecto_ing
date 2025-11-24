package com.hacaritama.reservaspasajes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerResponse {
    private String documentPassenger;
    private String id;
    private String name1;
    private String name2;
    private String lastName1;
    private String lastName2;
    private String phone;
    private String fullName;

    public String getFullName() {
        StringBuilder sb = new StringBuilder();
        sb.append(name1);
        if (name2 != null && !name2.isEmpty()) {
            sb.append(" ").append(name2);
        }
        sb.append(" ").append(lastName1);
        if (lastName2 != null && !lastName2.isEmpty()) {
            sb.append(" ").append(lastName2);
        }
        return sb.toString();
    }
}
