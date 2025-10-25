package com.hacaritama.reservaspasajes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hacaritama.reservaspasajes.model.Pasajero;

public interface PasajeroRepository extends JpaRepository<Pasajero, Long> {
}
