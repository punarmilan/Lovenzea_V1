package com.punarmilan.controller;

import com.punarmilan.entity.VipEnrollment;
import com.punarmilan.repository.VipEnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vip-enrollments")
public class VipEnrollmentController {

    @Autowired
    private VipEnrollmentRepository repository;

    @PostMapping
    public ResponseEntity<?> createEnrollment(@RequestBody VipEnrollment enrollment) {
        try {
            enrollment.setStatus("PENDING");
            VipEnrollment saved = repository.save(enrollment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving enrollment: " + e.getMessage());
        }
    }
}
