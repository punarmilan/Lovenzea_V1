package com.punarmilan.repository;

import com.punarmilan.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    long countByActiveTrue();

    @Query("SELECT SUM(s.plan.price) FROM UserSubscription s")
    Double calculateTotalRevenue();

    Optional<UserSubscription> findByUserIdAndActiveTrue(Long userId);
}
