package com.hacaritama.reservaspasajes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String code;
    private String name;
    private String access;
    private String token;
}
