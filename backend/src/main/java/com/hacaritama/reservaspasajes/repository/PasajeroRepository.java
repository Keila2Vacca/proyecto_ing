package com.hacaritama.reservaspasajes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hacaritama.reservaspasajes.model.Pasajero;

@Repository
public interface PasajeroRepository extends JpaRepository<Pasajero, String> {
}
