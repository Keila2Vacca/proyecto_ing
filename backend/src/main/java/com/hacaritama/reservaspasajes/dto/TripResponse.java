package com.hacaritama.reservaspasajes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private LocalDate date;
    private LocalTime departureTime;
    private String tripState;
    private BigDecimal routePrice;
    private String originCity;
    private String originState;
    private String destinationCity;
    private String destinationState;
    private String vehiclePlate;
    private String vehicleModel;
    private Integer vehicleCapacity;
    private String driverName;
    private Integer seatsSold;
    private Integer seatsAvailable;
}
