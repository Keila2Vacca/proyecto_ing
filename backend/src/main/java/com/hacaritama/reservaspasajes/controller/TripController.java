package com.hacaritama.reservaspasajes.controller;

import com.hacaritama.reservaspasajes.dto.TripResponse;
import com.hacaritama.reservaspasajes.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {
    
    @Autowired
    private TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripResponse>> getAllTrips() {
        List<TripResponse> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/available")
    public ResponseEntity<List<TripResponse>> getAvailableTrips() {
        List<TripResponse> trips = tripService.getAvailableTrips();
        return ResponseEntity.ok(trips);
    }
}
