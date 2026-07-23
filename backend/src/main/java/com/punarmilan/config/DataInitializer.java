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
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create initial Super Admin if not exists
        if (!adminRepository.existsByEmail("admin@punarmilan.com")) {
            Admin superAdmin = Admin.builder()
                    .name("System Admin")
                    .email("admin@punarmilan.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(AdminRole.ROLE_SUPER_ADMIN)
                    .status(true)
                    .build();
            adminRepository.save(superAdmin);
            log.info("Initial Super Admin created: admin@punarmilan.com / admin123");
        }
    }
}
