package com.hacaritama.reservaspasajes.service;

import com.hacaritama.reservaspasajes.dto.TripResponse;
import com.hacaritama.reservaspasajes.model.Trip;
import com.hacaritama.reservaspasajes.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;

    @Transactional(readOnly = true)
    public List<TripResponse> getAvailableTrips() {
        LocalDate today = LocalDate.now();
        return tripRepository.findAvailableTrips(today).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TripResponse> getAllTrips() {
        return tripRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private TripResponse mapToResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setDate(trip.getDate());
        response.setDepartureTime(trip.getDepartureTime());
        response.setTripState(trip.getStateTrip().getName());
        response.setRoutePrice(trip.getRoute().getPrice());
        response.setOriginCity(trip.getRoute().getOriginCity().getName());
        response.setOriginState(trip.getRoute().getOriginCity().getState().getName());
        response.setDestinationCity(trip.getRoute().getDestinationCity().getName());
        response.setDestinationState(trip.getRoute().getDestinationCity().getState().getName());
        response.setVehiclePlate(trip.getVehicle().getPlate());
        response.setVehicleModel(trip.getVehicle().getModel());
        response.setVehicleCapacity(trip.getVehicle().getCapacity());
        
        String driverName = trip.getDriver().getName1() + " " + trip.getDriver().getLastName1();
        response.setDriverName(driverName);
        
        // TODO: Calcular asientos vendidos y disponibles
        response.setSeatsSold(0);
        response.setSeatsAvailable(trip.getVehicle().getCapacity());
        
        return response;
    }
}
