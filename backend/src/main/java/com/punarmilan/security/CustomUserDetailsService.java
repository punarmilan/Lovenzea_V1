package com.punarmilan.security;

import com.punarmilan.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("customUserDetailsService")
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrMobile) throws UsernameNotFoundException {
        com.punarmilan.entity.User user = userRepository.findByEmail(emailOrMobile)
                .orElseGet(() -> userRepository.findByMobileNumber(emailOrMobile)
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "User not found with identifier: " + emailOrMobile)));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getEnabled(),
                true, true, true,
                java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));
    }
}
