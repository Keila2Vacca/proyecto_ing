package com.hacaritama.reservaspasajes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "passage_detail", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"passage_trip_id", "seat_number"})
})
public class PassageDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detail")
    private Long idDetail;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @Column(name = "price_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePaid;

    @Column(name = "passage_line_item", nullable = false)
    private Integer passageLineItem;

    @Column(name = "passage_trip_id", nullable = false)
    private Long passageTripId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "passage_line_item", referencedColumnName = "line_item", insertable = false, updatable = false),
        @JoinColumn(name = "passage_trip_id", referencedColumnName = "trip_id", insertable = false, updatable = false)
    })
    private Passage passage;
}
