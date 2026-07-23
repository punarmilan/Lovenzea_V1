package com.punarmilan.service;

import java.time.LocalDateTime;

public interface UserActivityService {
    /**
     * Updates the last active timestamp for a user.
     * Uses Redis for efficiency and only syncs to DB periodically.
     */
    void updateLastActive(String email);

    /**
     * Gets the last active timestamp for a user, checking Redis first.
     */
    LocalDateTime getLastActive(String email);

    /**
     * Checks if a user is currently online (active within the last 2 minutes).
     */
    boolean isUserOnline(String email);
    
    /**
     * Force sync activity from Redis to DB (e.g., on logout).
     */
    void syncActivityToDb(String email);

    /**
     * Clear activity from Redis.
     */
    void clearActivity(String email);
}
