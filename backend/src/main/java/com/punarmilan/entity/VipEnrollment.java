package com.punarmilan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vip_enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VipEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "package_type", nullable = false)
    private String packageType; // e.g. "Silver", "Gold", "Platinum", "Diamond Elite"

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "status")
    private String status = "PENDING"; // "PENDING", "CONTACTED", "ENROLLED"

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
