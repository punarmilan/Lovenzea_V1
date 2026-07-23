package com.punarmilan.repository;

import com.punarmilan.entity.VipEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VipEnrollmentRepository extends JpaRepository<VipEnrollment, Long> {
}
