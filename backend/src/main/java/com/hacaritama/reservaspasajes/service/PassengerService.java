package com.hacaritama.reservaspasajes.service;

import com.hacaritama.reservaspasajes.dto.PassengerRequest;
import com.hacaritama.reservaspasajes.dto.PassengerResponse;
import com.hacaritama.reservaspasajes.model.Pasajero;
import com.hacaritama.reservaspasajes.repository.PasajeroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PassengerService {
    
    @Autowired
    private PasajeroRepository pasajeroRepository;

    @Transactional
    public PassengerResponse createPassenger(PassengerRequest request) {
        // Verificar si ya existe
        if (pasajeroRepository.existsById(request.getDocumentPassenger())) {
            throw new RuntimeException("El pasajero con documento " + request.getDocumentPassenger() + " ya existe");
        }

        Pasajero pasajero = new Pasajero();
        pasajero.setDocumentPassenger(request.getDocumentPassenger());
        pasajero.setId(request.getId());
        pasajero.setName1(request.getName1());
        pasajero.setName2(request.getName2());
        pasajero.setLastName1(request.getLastName1());
        pasajero.setLastName2(request.getLastName2());
        pasajero.setPhone(request.getPhone());

        Pasajero saved = pasajeroRepository.save(pasajero);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<PassengerResponse> getAllPassengers() {
        return pasajeroRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PassengerResponse getPassengerById(String documentPassenger) {
        Pasajero pasajero = pasajeroRepository.findById(documentPassenger)
            .orElseThrow(() -> new RuntimeException("Pasajero no encontrado"));
        return mapToResponse(pasajero);
    }

    @Transactional
    public PassengerResponse updatePassenger(String documentPassenger, PassengerRequest request) {
        Pasajero pasajero = pasajeroRepository.findById(documentPassenger)
            .orElseThrow(() -> new RuntimeException("Pasajero no encontrado"));

        pasajero.setId(request.getId());
        pasajero.setName1(request.getName1());
        pasajero.setName2(request.getName2());
        pasajero.setLastName1(request.getLastName1());
        pasajero.setLastName2(request.getLastName2());
        pasajero.setPhone(request.getPhone());

        Pasajero updated = pasajeroRepository.save(pasajero);
        return mapToResponse(updated);
    }

    @Transactional
    public void deletePassenger(String documentPassenger) {
        if (!pasajeroRepository.existsById(documentPassenger)) {
            throw new RuntimeException("Pasajero no encontrado");
        }
        pasajeroRepository.deleteById(documentPassenger);
    }

    private PassengerResponse mapToResponse(Pasajero pasajero) {
        PassengerResponse response = new PassengerResponse();
        response.setDocumentPassenger(pasajero.getDocumentPassenger());
        response.setId(pasajero.getId());
        response.setName1(pasajero.getName1());
        response.setName2(pasajero.getName2());
        response.setLastName1(pasajero.getLastName1());
        response.setLastName2(pasajero.getLastName2());
        response.setPhone(pasajero.getPhone());
        return response;
    }
}
