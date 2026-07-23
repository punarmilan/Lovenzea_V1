package com.punarmilan.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.function.Supplier;

@Component
@RequiredArgsConstructor
public class RateLimitFilter implements Filter {

    private final ProxyManager<byte[]> proxyManager;

    private Supplier<BucketConfiguration> getBucketConfiguration() {
        return () -> BucketConfiguration.builder()
                .addLimit(Bandwidth.classic(30, Refill.intervally(30, Duration.ofMinutes(15))))
                .build();
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        
        String path = request.getRequestURI();
        
        // Only rate limit sensitive auth endpoints
        if (path.contains("/api/auth/login") || path.contains("/api/auth/register") || path.contains("/api/auth/forgot-password")) {
            String clientIp = request.getRemoteAddr();
            String key = "rate-limit:" + clientIp + ":" + path;
            
            if (proxyManager.builder().build(key.getBytes(), getBucketConfiguration()).tryConsume(1)) {
                filterChain.doFilter(servletRequest, servletResponse);
            } else {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many attempts. Please try again later.");
            }
        } else {
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }
}
