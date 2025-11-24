package com.hacaritama.reservaspasajes.service;

import com.hacaritama.reservaspasajes.dto.LoginRequest;
import com.hacaritama.reservaspasajes.dto.LoginResponse;
import com.hacaritama.reservaspasajes.model.Admin;
import com.hacaritama.reservaspasajes.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private AdminRepository adminRepository;

    public LoginResponse login(LoginRequest request) {
        Admin admin = adminRepository.findByCode(request.getCode())
            .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // Por simplicidad, comparación directa. En producción usar BCrypt
        if (admin.getPassword() == null || !admin.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = UUID.randomUUID().toString();
        String fullName = admin.getName1() + " " + admin.getLastName1();

        return new LoginResponse(admin.getCode(), fullName, admin.getAccess(), token);
    }
}
