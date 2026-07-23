package com.punarmilan.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.punarmilan.service.UserActivityService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;
    private final AdminDetailsService adminDetailsService;
    private final UserActivityService userActivityService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String jwt;
        final String email;

        String jwtToken = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwtToken = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    jwtToken = cookie.getValue();
                    break;
                }
            }
        }

        if (jwtToken != null) {
            logger.debug("JWT Token found in request: " + request.getRequestURI());
        }

        if (jwtToken == null) {
            logger.debug("No JWT Token found for request: " + request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        jwt = jwtToken;
        String userEmail = null;
        try {
            userEmail = jwtUtils.extractUsername(jwt);
            logger.debug("Extracted email from token: " + userEmail);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            logger.warn("JWT token expired: " + e.getMessage());
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            logger.warn("Malformed JWT token: " + e.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException e) {
            logger.warn("Invalid JWT signature: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing JWT token: " + e.getMessage());
        }
        email = userEmail;

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            boolean isAdminRequest = request.getRequestURI().startsWith("/api/admin");
            logger.debug("Processing request for " + email + ". Is admin request: " + isAdminRequest);

            UserDetails userDetails = null;
            
            // First attempt based on URI prefix
            try {
                if (isAdminRequest) {
                    logger.debug("Attempting to load admin details for: " + email);
                    userDetails = this.adminDetailsService.loadUserByUsername(email);
                    logger.debug("Successfully loaded admin details for: " + email + " with authorities: " + userDetails.getAuthorities());
                } else {
                    logger.debug("Attempting to load user details for: " + email);
                    userDetails = this.userDetailsService.loadUserByUsername(email);
                    logger.debug("Successfully loaded user details for: " + email + " with authorities: " + userDetails.getAuthorities());
                }
            } catch (Exception e) {
                logger.debug("Primary lookup failed for " + email + ": " + e.getMessage());
                // Secondary attempt: try the other service because some endpoints like /ping are shared
                try {
                    if (isAdminRequest) {
                        logger.debug("Fallback: Attempting to load user details for admin request " + email);
                        userDetails = this.userDetailsService.loadUserByUsername(email);
                    } else {
                        logger.debug("Fallback: Attempting to load admin details for non-admin request " + email);
                        userDetails = this.adminDetailsService.loadUserByUsername(email);
                    }
                    if (userDetails != null) {
                        logger.debug("Fallback successful for " + email + " with authorities: " + userDetails.getAuthorities());
                    }
                } catch (Exception e2) {
                    logger.warn("Both lookups failed for " + email + ": " + e2.getMessage());
                    // Both failed, continue filter chain
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            if (userDetails != null) {
                logger.debug("UserDetails found for " + email + ". Checking token validity...");
                if (jwtUtils.validateToken(jwt, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    logger.info("Successfully authenticated " + email + 
                               " with authorities: " + userDetails.getAuthorities());

                    // Update last active status via optimized service
                    try {
                        userActivityService.updateLastActive(email);
                    } catch (Exception e) {
                        // Log error but don't block the request
                    }
                } else {
                    logger.warn("JWT token validation failed for " + email);
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
