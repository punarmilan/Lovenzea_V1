package com.punarmilan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "daily_matches", indexes = {
        @Index(name = "idx_user_date", columnList = "user_id, match_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(name = "match_date", nullable = false)
    private LocalDate matchDate;

    @Column(name = "match_score")
    private Double matchScore;

    @Column(name = "top_reasons", columnDefinition = "TEXT")
    private String topReasons;
}
