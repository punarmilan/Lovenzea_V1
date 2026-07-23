package com.punarmilan.service;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.HashMap;
import java.util.Map;

@SpringBootTest
public class ProfileServiceTest {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testUpdateProfile() {
        User user = userRepository.findByEmail("ss@gmail.com").orElseThrow();
        Map<String, Object> updates = new HashMap<>();
        updates.put("fullName", "Sakshi Patil");
        updates.put("bloodGroup", "O+");
        updates.put("aboutMe", "Hello World Test");
        
        ProfileDTO dto = profileService.updateProfile(user, updates);
        System.out.println("--- TEST RESULT ---");
        System.out.println("UPDATED PROFILE DTO: Name=" + dto.getFullName() + ", Blood=" + dto.getBloodGroup() + ", About=" + dto.getAboutMe());
        System.out.println("-------------------");
    }
}
