package com.punarmilan.repository;

import com.punarmilan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMobileNumber(String mobileNumber);

    long countByCreatedAtAfter(LocalDateTime date);

    Optional<User> findByResetToken(String resetToken);

    Optional<User> findByVerificationToken(String verificationToken);

    Boolean existsByEmail(String email);

    boolean existsByMobileNumber(String mobileNumber);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.lastActive >= :date")
    java.util.List<User> findUsersActiveSince(@org.springframework.data.repository.query.Param("date") LocalDateTime date);
}
