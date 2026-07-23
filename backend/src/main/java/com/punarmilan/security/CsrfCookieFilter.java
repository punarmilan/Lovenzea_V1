package com.punarmilan.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to ensure CSRF token is sent as a cookie to the client on every request.
 * This is necessary for Single Page Applications (SPAs) to have the token available
 * for state-changing requests (POST, PUT, DELETE).
 */
public class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            // Render the token value to a cookie by causing the deferred token to be loaded
            csrfToken.getToken();
        }
        filterChain.doFilter(request, response);
    }
}
