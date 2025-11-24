package com.hacaritama.reservaspasajes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "passage")
@IdClass(Passage.PassageId.class)
public class Passage {
    @Id
    @Column(name = "line_item", nullable = false)
    private Integer lineItem;

    @Id
    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", insertable = false, updatable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_passage_id", nullable = false)
    private StatePassage statePassage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_document", referencedColumnName = "document_passenger", nullable = false)
    private Pasajero passenger;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassageId implements Serializable {
        private Integer lineItem;
        private Long tripId;
    }
}
