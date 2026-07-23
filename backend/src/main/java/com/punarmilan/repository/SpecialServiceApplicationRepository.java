package com.punarmilan.repository;

import com.punarmilan.entity.SpecialServiceApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecialServiceApplicationRepository extends JpaRepository<SpecialServiceApplication, Long> {
    List<SpecialServiceApplication> findByUserId(Long userId);
}
