package com.punarmilan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_views", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"viewer_id", "viewed_profile_id"})
       },
       indexes = {
           @Index(name = "idx_viewer_profile", columnList = "viewer_id, viewed_profile_id")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "viewer_id", nullable = false)
    private User viewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "viewed_profile_id", nullable = false)
    private Profile viewedProfile;

    @CreationTimestamp
    @Column(name = "viewed_at", nullable = false, updatable = false)
    private LocalDateTime viewedAt;
}
