package com.punarmilan.service.impl;

import com.punarmilan.repository.AdminRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.UserActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserActivityServiceImpl implements UserActivityService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    private static final String LAST_ACTIVE_KEY_PREFIX = "user:active:";
    private static final String LAST_SYNC_KEY_PREFIX = "user:sync:";
    private static final long SYNC_THRESHOLD_MINUTES = 1;

    @Override
    public void updateLastActive(String email) {
        String activeKey = LAST_ACTIVE_KEY_PREFIX + email;
        LocalDateTime now = LocalDateTime.now();

        // 1. Update Redis (very fast)
        redisTemplate.opsForValue().set(activeKey, now, 60, TimeUnit.MINUTES);

        // 2. Check if we should sync to DB - synced more often for real-time online status
        String syncKey = LAST_SYNC_KEY_PREFIX + email;
        Object lastSyncObj = redisTemplate.opsForValue().get(syncKey);

        if (lastSyncObj == null) {
            // First time or expired, sync to DB and set sync key
            syncActivityToDb(email);
            redisTemplate.opsForValue().set(syncKey, now, SYNC_THRESHOLD_MINUTES, TimeUnit.MINUTES);
        }
    }

    @Override
    public LocalDateTime getLastActive(String email) {
        String activeKey = LAST_ACTIVE_KEY_PREFIX + email;
        Object redisValue = redisTemplate.opsForValue().get(activeKey);

        if (redisValue instanceof LocalDateTime) {
            return (LocalDateTime) redisValue;
        } else if (redisValue instanceof String) {
            try {
                return LocalDateTime.parse((String) redisValue);
            } catch (Exception e) {
                log.warn("Failed to parse Redis lastActive string for {}: {}", email, redisValue);
            }
        }

        // Fallback to DB if not in Redis
        return userRepository.findByEmail(email)
                .map(u -> u.getLastActive())
                .orElse(null);
    }

    @Override
    public boolean isUserOnline(String email) {
        LocalDateTime lastActive = getLastActive(email);
        if (lastActive == null) return false;
        
        // Use 10 minutes threshold for better "Dynamic" feeling
        return ChronoUnit.MINUTES.between(lastActive, LocalDateTime.now()) < 10;
    }

    @Override
    public void syncActivityToDb(String email) {
        LocalDateTime now = LocalDateTime.now();
        
        // Try User first
        userRepository.findByEmail(email).ifPresentOrElse(user -> {
            user.setLastActive(now);
            userRepository.save(user);
        }, () -> {
            // Then Try Admin
            adminRepository.findByEmail(email).ifPresent(admin -> {
                admin.setLastLogin(now);
                adminRepository.save(admin);
            });
        });
    }

    @Override
    public void clearActivity(String email) {
        redisTemplate.delete(LAST_ACTIVE_KEY_PREFIX + email);
        redisTemplate.delete(LAST_SYNC_KEY_PREFIX + email);
    }
}
