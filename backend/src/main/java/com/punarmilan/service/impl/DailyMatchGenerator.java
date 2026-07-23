package com.punarmilan.service.impl;

import com.punarmilan.config.MatchWeightConfig;
import com.punarmilan.entity.DailyMatch;
import com.punarmilan.entity.PartnerPreference;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import com.punarmilan.repository.BlockedUserRepository;
import com.punarmilan.repository.DailyMatchRepository;
import com.punarmilan.repository.PartnerPreferenceRepository;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Nightly batch job that pre-computes daily matches for active users.
 *
 * Improvements over the original:
 * - Score-based selection (top candidates by compatibility, not random)
 * - Match rotation (excludes profiles shown in the last N days)
 * - Variety via random pick from top-50 scored candidates
 * - Pre-persists matchScore and topReasons for zero-cost reads
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DailyMatchGenerator {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final DailyMatchRepository dailyMatchRepository;
    private final PartnerPreferenceRepository partnerPreferenceRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final MatchScoreCalculator matchScoreCalculator;
    private final MatchWeightConfig matchWeightConfig;

    private static final int DAILY_MATCH_COUNT = 10;
    private static final int TOP_POOL_SIZE = 50;

    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    @Transactional
    public void onApplicationEvent() {
        log.info("Application ready. Running initial match generation check...");
        generateDailyMatchesForAll();
    }

    /**
     * Nightly job at 00:00 to pre-generate scored matches for active users.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void generateDailyMatchesForAll() {
        log.info("Starting background daily match generation (scored)...");

        List<User> activeUsers = userRepository.findUsersActiveSince(java.time.LocalDateTime.now().minusDays(7));
        log.info("Generating scored matches for {} active users", activeUsers.size());

        int successCount = 0;
        for (User user : activeUsers) {
            try {
                generateForUser(user);
                successCount++;
            } catch (Exception e) {
                log.error("Failed to generate matches for user {}: {}", user.getId(), e.getMessage());
            }
        }

        // Cleanup matches older than rotation window + 1 day
        int cleanupDays = matchWeightConfig.getRotation().getExcludeDays() + 1;
        LocalDate cutoff = LocalDate.now().minusDays(cleanupDays);
        dailyMatchRepository.deleteByMatchDateBefore(cutoff);

        log.info("Daily match generation completed. {}/{} users processed.", successCount, activeUsers.size());
    }

    public void generateForUser(User user) {
        LocalDate today = LocalDate.now();
        List<DailyMatch> existing = dailyMatchRepository.findAllByUserAndMatchDate(user, today);

        if (existing.size() >= DAILY_MATCH_COUNT) return;
        int needed = DAILY_MATCH_COUNT - existing.size();

        // â”€â”€ Step 1: Build exclusion set â”€â”€
        Set<Long> exclusions = new HashSet<>();

        // Already matched today
        exclusions.addAll(existing.stream()
                .map(dm -> dm.getProfile().getId())
                .collect(Collectors.toSet()));

        // Recently shown (rotation)
        int rotateDays = matchWeightConfig.getRotation().getExcludeDays();
        LocalDate rotationCutoff = today.minusDays(rotateDays);
        Set<Long> recentlyShown = dailyMatchRepository.findRecentlyShownProfileIds(user, rotationCutoff);
        exclusions.addAll(recentlyShown);

        // Blocked users
        exclusions.addAll(blockedUserRepository.findBlockedUserIdsByBlockerId(user.getId()));
        exclusions.addAll(blockedUserRepository.findBlockerIdsByBlockedUserId(user.getId()));
        exclusions.add(user.getId());
        if (exclusions.isEmpty()) exclusions.add(-1L);

        // â”€â”€ Step 2: Fetch my profile + preferences â”€â”€
        Profile myProfile = profileRepository.findByUserId(user.getId()).orElse(null);
        if (myProfile == null) return;

        String targetGender = "Male".equalsIgnoreCase(myProfile.getGender()) ? "Female" : "Male";
        PartnerPreference myPref = partnerPreferenceRepository.findByUser(user).orElse(null);

        // â”€â”€ Step 3: Fetch candidate pool â”€â”€
        int poolSize = matchWeightConfig.getCandidate().getPoolSize();
        List<Profile> candidates = profileRepository.findCandidateProfiles(
                targetGender, exclusions, PageRequest.of(0, poolSize));

        if (candidates.isEmpty()) {
            log.debug("No candidates available for user {}", user.getId());
            return;
        }

        // â”€â”€ Step 4: Batch-fetch candidate preferences â”€â”€
        List<Long> candidateUserIds = candidates.stream()
                .filter(p -> p.getUser() != null)
                .map(p -> p.getUser().getId())
                .collect(Collectors.toList());

        Map<Long, PartnerPreference> prefMap = new HashMap<>();
        if (!candidateUserIds.isEmpty()) {
            List<PartnerPreference> allPrefs = partnerPreferenceRepository.findAllByUserIdIn(candidateUserIds);
            for (PartnerPreference pp : allPrefs) {
                if (pp.getUser() != null) {
                    prefMap.put(pp.getUser().getId(), pp);
                }
            }
        }

        // â”€â”€ Step 5: Score all candidates in-memory â”€â”€
        List<ScoredCandidate> scored = new ArrayList<>(candidates.size());

        for (Profile candidate : candidates) {
            if (candidate.getUser() == null) continue;

            PartnerPreference targetPref = prefMap.get(candidate.getUser().getId());
            MatchScoreCalculator.MatchResult result = matchScoreCalculator.computeTwoWayScore(
                    myProfile, myPref, candidate, targetPref);

            scored.add(new ScoredCandidate(candidate, result.getScore(), result.getTopReasons()));
        }

        // Sort by score descending
        scored.sort(Comparator.comparingDouble((ScoredCandidate sc) -> sc.score).reversed());

        // â”€â”€ Step 6: Pick randomly from top-50 for variety â”€â”€
        int topPoolEnd = Math.min(TOP_POOL_SIZE, scored.size());
        List<ScoredCandidate> topPool = new ArrayList<>(scored.subList(0, topPoolEnd));
        Collections.shuffle(topPool);

        List<ScoredCandidate> selected = topPool.subList(0, Math.min(needed, topPool.size()));

        // â”€â”€ Step 7: Persist DailyMatch with scores â”€â”€
        List<DailyMatch> newMatches = selected.stream()
                .map(sc -> DailyMatch.builder()
                        .user(user)
                        .profile(sc.profile)
                        .matchDate(today)
                        .matchScore(Math.round(sc.score * 10.0) / 10.0)
                        .topReasons(serializeReasons(sc.reasons))
                        .build())
                .collect(Collectors.toList());

        dailyMatchRepository.saveAll(newMatches);
        log.debug("Pre-computed {} scored matches for user {} (avg score: {:.1f})",
                newMatches.size(), user.getEmail(),
                selected.stream().mapToDouble(sc -> sc.score).average().orElse(0));
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Internal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private static class ScoredCandidate {
        final Profile profile;
        final double score;
        final List<String> reasons;

        ScoredCandidate(Profile profile, double score, List<String> reasons) {
            this.profile = profile;
            this.score = score;
            this.reasons = reasons;
        }
    }

    private String serializeReasons(List<String> reasons) {
        if (reasons == null || reasons.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < reasons.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("\"").append(reasons.get(i).replace("\"", "'")).append("\"");
        }
        sb.append("]");
        return sb.toString();
    }
}
