package com.hacaritama.reservaspasajes.repository;

import com.hacaritama.reservaspasajes.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByDateGreaterThanEqualOrderByDateAscDepartureTimeAsc(LocalDate date);
    
    @Query("SELECT t FROM Trip t WHERE t.date >= :date AND t.stateTrip.name = 'Programado'")
    List<Trip> findAvailableTrips(LocalDate date);
}
