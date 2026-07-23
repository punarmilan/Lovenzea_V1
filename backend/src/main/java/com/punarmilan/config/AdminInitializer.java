package com.punarmilan.config;

import com.punarmilan.entity.Admin;
import com.punarmilan.entity.enums.AdminRole;
import com.punarmilan.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${ADMIN_DEFAULT_PASSWORD:admin123}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            log.info("No admin users found. Creating default admin user...");
            
            Admin defaultAdmin = Admin.builder()
                    .name("System Admin")
                    .email("admin@punarmilan.com")
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .role(AdminRole.ROLE_SUPER_ADMIN)
                    .status(true)
                    .build();
            
            adminRepository.save(defaultAdmin);
            log.info("Default admin user created successfully.");
        } else {
            log.info("Admin users already exist in the database. Skipping default admin creation.");
        }
    }
}
