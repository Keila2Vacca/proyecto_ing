package com.hacaritama.reservaspasajes.controller;

import com.hacaritama.reservaspasajes.dto.PassengerRequest;
import com.hacaritama.reservaspasajes.dto.PassengerResponse;
import com.hacaritama.reservaspasajes.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "*")
public class PassengerController {
    
    @Autowired
    private PassengerService passengerService;

    @PostMapping
    public ResponseEntity<?> createPassenger(@Valid @RequestBody PassengerRequest request) {
        try {
            PassengerResponse response = passengerService.createPassenger(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<PassengerResponse>> getAllPassengers() {
        List<PassengerResponse> passengers = passengerService.getAllPassengers();
        return ResponseEntity.ok(passengers);
    }

    @GetMapping("/{documentPassenger}")
    public ResponseEntity<?> getPassengerById(@PathVariable String documentPassenger) {
        try {
            PassengerResponse response = passengerService.getPassengerById(documentPassenger);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{documentPassenger}")
    public ResponseEntity<?> updatePassenger(
            @PathVariable String documentPassenger,
            @Valid @RequestBody PassengerRequest request) {
        try {
            PassengerResponse response = passengerService.updatePassenger(documentPassenger, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{documentPassenger}")
    public ResponseEntity<?> deletePassenger(@PathVariable String documentPassenger) {
        try {
            passengerService.deletePassenger(documentPassenger);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
