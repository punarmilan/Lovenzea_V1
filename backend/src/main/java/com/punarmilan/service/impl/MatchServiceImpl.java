package com.punarmilan.service.impl;

import com.punarmilan.config.MatchWeightConfig;
import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.DailyMatch;
import com.punarmilan.entity.PartnerPreference;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import com.punarmilan.repository.DailyMatchRepository;
import com.punarmilan.repository.PartnerPreferenceRepository;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.service.MatchService;
import com.punarmilan.service.NotificationService;
import com.punarmilan.service.UserActivityService;
import com.punarmilan.repository.ProfileViewRepository;
import com.punarmilan.entity.ProfileView;
import com.punarmilan.repository.ConnectionRequestRepository;
import com.punarmilan.repository.ShortlistRepository;
import com.punarmilan.repository.BlockedUserRepository;
import com.punarmilan.entity.enums.NotificationType;
import com.punarmilan.entity.enums.RequestStatus;
import com.punarmilan.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchServiceImpl implements MatchService {

        private final ProfileRepository profileRepository;
        private final DailyMatchRepository dailyMatchRepository;
        private final PartnerPreferenceRepository partnerPreferenceRepository;
        private final ProfileViewRepository profileViewRepository;
        private final RedisTemplate<String, Object> redisTemplate;
        private final NotificationService notificationService;
        private final ConnectionRequestRepository connectionRequestRepository;
        private final ShortlistRepository shortlistRepository;
        private final ProfileService profileService;
        private final BlockedUserRepository blockedUserRepository;
        private final UserActivityService userActivityService;
        private final MatchScoreCalculator matchScoreCalculator;
        private final MatchWeightConfig matchWeightConfig;

        private static final String SCORED_CACHE_KEY_PREFIX = "match:scored:";

        // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Internal scored-profile holder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        private static class ScoredProfile implements java.io.Serializable {
                private static final long serialVersionUID = 1L;
                Profile profile;
                double score;
                List<String> reasons;
        }

        // ====================================================================
        //  NEW MATCHES â€” Full scoring pipeline
        // ====================================================================

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getNewMatches(User user, Pageable pageable) {
                log.info("Scoring pipeline started for user: {}", user.getId());

                // Check Redis cache first
                String dateStr = LocalDate.now().toString();
                String cacheKey = SCORED_CACHE_KEY_PREFIX + user.getId() + ":" + dateStr;

                @SuppressWarnings("unchecked")
                List<ScoredProfile> cachedScored = (List<ScoredProfile>) redisTemplate.opsForValue().get(cacheKey);

                List<ScoredProfile> scoredList;
                if (cachedScored != null && !cachedScored.isEmpty()) {
                        log.debug("Cache hit for scored matches, user: {}", user.getId());
                        scoredList = cachedScored;
                } else {
                        scoredList = runScoringPipeline(user);

                        // Cache until midnight
                        try {
                                LocalDateTime now = LocalDateTime.now();
                                LocalDateTime midnight = now.toLocalDate().plusDays(1).atStartOfDay();
                                long secondsToMidnight = java.time.Duration.between(now, midnight).getSeconds();
                                redisTemplate.opsForValue().set(cacheKey, scoredList, secondsToMidnight, TimeUnit.SECONDS);
                        } catch (Exception e) {
                                log.warn("Failed to cache scored matches: {}", e.getMessage());
                        }
                }

                // Paginate
                int total = scoredList.size();
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), total);

                List<ScoredProfile> pagedScored = new ArrayList<>();
                if (start < total) {
                        pagedScored = scoredList.subList(start, end);
                }

                // Map to DTOs with score + reasons
                List<Profile> pagedProfiles = pagedScored.stream().map(sp -> sp.profile).collect(Collectors.toList());
                List<ProfileDTO> dtos = profileService.mapToDTOs(pagedProfiles, user);

                for (int i = 0; i < dtos.size(); i++) {
                        ScoredProfile sp = pagedScored.get(i);
                        dtos.get(i).setMatchPercentage(sp.score);
                        dtos.get(i).setTopMatchReasons(sp.reasons);
                }

                log.info("Returning {} scored matches (page {}) for user {}", dtos.size(), pageable.getPageNumber(), user.getId());
                return new PageImpl<>(dtos, pageable, total);
        }

        // ====================================================================
        //  SCORING PIPELINE â€” all DB calls upfront, scoring in-memory
        // ====================================================================

        private List<ScoredProfile> runScoringPipeline(User user) {
                // â”€â”€ Step 1: My profile + preferences â”€â”€
                Profile myProfile = profileRepository.findByUserId(user.getId()).orElse(null);
                if (myProfile == null) {
                        log.warn("No profile found for user {}. Returning empty matches.", user.getId());
                        return Collections.emptyList();
                }

                String targetGender = "Male".equalsIgnoreCase(myProfile.getGender()) ? "Female" : "Male";
                PartnerPreference myPref = partnerPreferenceRepository.findByUser(user).orElse(null);

                // â”€â”€ Step 2: Exclusion sets â”€â”€
                Set<Long> exclusions = new HashSet<>();
                exclusions.addAll(blockedUserRepository.findBlockedUserIdsByBlockerId(user.getId()));
                exclusions.addAll(blockedUserRepository.findBlockerIdsByBlockedUserId(user.getId()));
                exclusions.add(user.getId());
                if (exclusions.isEmpty()) exclusions.add(-1L);

                // â”€â”€ Step 3: Candidate pool (capped) â”€â”€
                int poolSize = matchWeightConfig.getCandidate().getPoolSize();
                List<Profile> candidates = profileRepository.findCandidateProfiles(
                                targetGender, exclusions, PageRequest.of(0, poolSize));

                if (candidates.isEmpty()) {
                        log.info("No candidates found for user {}. Returning empty.", user.getId());
                        return Collections.emptyList();
                }

                // â”€â”€ Step 4: Declined IDs for reject penalty â”€â”€
                Set<Long> declinedIds = new HashSet<>();
                try {
                        declinedIds.addAll(connectionRequestRepository.findDeclinedReceiverIdsBySender(user));
                        declinedIds.addAll(connectionRequestRepository.findDeclinedSenderIdsByReceiver(user));
                } catch (Exception e) {
                        log.warn("Failed to fetch declined IDs: {}", e.getMessage());
                }

                // â”€â”€ Step 5: Batch-fetch candidate preferences â”€â”€
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

                // â”€â”€ Step 6: Batch-fetch engagement data â”€â”€
                List<Long> candidateProfileIds = candidates.stream().map(Profile::getId).collect(Collectors.toList());

                Map<Long, Long> viewCounts = new HashMap<>();
                Map<Long, Long> shortlistCounts = new HashMap<>();
                try {
                        if (!candidateProfileIds.isEmpty()) {
                                for (Object[] row : profileViewRepository.countViewsByProfileIds(candidateProfileIds)) {
                                        viewCounts.put((Long) row[0], (Long) row[1]);
                                }
                                for (Object[] row : shortlistRepository.countShortlistsByProfileIds(candidateProfileIds)) {
                                        shortlistCounts.put((Long) row[0], (Long) row[1]);
                                }
                        }
                } catch (Exception e) {
                        log.warn("Failed to fetch engagement data: {}", e.getMessage());
                }

                // Find max engagement for normalization
                long maxViews = viewCounts.values().stream().mapToLong(v -> v).max().orElse(1);
                long maxShortlists = shortlistCounts.values().stream().mapToLong(v -> v).max().orElse(1);
                double popularityMaxBoost = matchWeightConfig.getBoost().getPopularityMax();

                // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                //  ALL DB CALLS DONE â€” Pure in-memory scoring
                // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

                List<ScoredProfile> scoredList = new ArrayList<>(candidates.size());

                for (Profile candidate : candidates) {
                        if (candidate.getUser() == null) continue;

                        Long candidateUserId = candidate.getUser().getId();
                        PartnerPreference targetPref = prefMap.get(candidateUserId);

                        // â”€â”€ 7a: Two-way match score â”€â”€
                        MatchScoreCalculator.MatchResult result = matchScoreCalculator.computeTwoWayScore(
                                        myProfile, myPref, candidate, targetPref);
                        double score = result.getScore();
                        List<String> reasons = new ArrayList<>(result.getTopReasons());

                        // â”€â”€ 7b: Activity boost â”€â”€
                        try {
                                String candidateEmail = candidate.getUser().getEmail();
                                if (candidateEmail != null) {
                                        if (userActivityService.isUserOnline(candidateEmail)) {
                                                score += matchWeightConfig.getBoost().getActiveNow();
                                                reasons.add("Currently online");
                                        } else {
                                                LocalDateTime lastActive = userActivityService.getLastActive(candidateEmail);
                                                if (lastActive != null && lastActive.toLocalDate().equals(LocalDate.now())) {
                                                        score += matchWeightConfig.getBoost().getActiveToday();
                                                        reasons.add("Active today");
                                                }
                                        }
                                }
                        } catch (Exception e) {
                                // Activity service failure should not break scoring
                        }

                        // â”€â”€ 7c: Popularity boost â”€â”€
                        long views = viewCounts.getOrDefault(candidate.getId(), 0L);
                        long shorts = shortlistCounts.getOrDefault(candidate.getId(), 0L);
                        double normalizedPopularity = ((double) views / maxViews + (double) shorts / maxShortlists) / 2.0;
                        double popularityBoost = normalizedPopularity * popularityMaxBoost;
                        score += popularityBoost;
                        if (popularityBoost >= 3) reasons.add("Popular profile");

                        // â”€â”€ 7d: Reject penalty â”€â”€
                        if (declinedIds.contains(candidateUserId)) {
                                score -= matchWeightConfig.getPenalty().getRejected();
                                reasons.removeIf(r -> r.equals("Popular profile")); // don't highlight penalized
                        }

                        // Clamp and round
                        score = Math.max(0, Math.min(100, score));
                        score = Math.round(score * 10.0) / 10.0;

                        // Keep top 5 reasons
                        if (reasons.size() > 5) {
                                reasons = new ArrayList<>(reasons.subList(0, 5));
                        }

                        scoredList.add(new ScoredProfile(candidate, score, reasons));
                }

                // â”€â”€ Step 8: Sort by score descending â”€â”€
                scoredList.sort(Comparator.comparingDouble((ScoredProfile sp) -> sp.score).reversed());

                log.info("Scoring pipeline complete for user {}. {} candidates scored.", user.getId(), scoredList.size());
                return scoredList;
        }

        // ====================================================================
        //  TODAY'S MATCHES â€” Read pre-computed from DailyMatch
        // ====================================================================

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getTodayMatches(User user, Pageable pageable) {
                log.info("Fetching pre-computed matches for user: {}", user.getId());
                LocalDate today = LocalDate.now();

                List<DailyMatch> matches = dailyMatchRepository.findAllByUserAndMatchDate(user, today);

                if (matches.isEmpty()) {
                        log.info("No pre-computed daily matches for user {}. Falling back to New Matches.", user.getId());
                        return getNewMatches(user, pageable);
                }

                // Sort by stored matchScore descending
                matches.sort(Comparator.comparingDouble((DailyMatch dm) ->
                                dm.getMatchScore() != null ? dm.getMatchScore() : 0.0).reversed());

                int total = matches.size();
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), total);

                List<DailyMatch> pagedMatches = new ArrayList<>();
                if (start < total) {
                        pagedMatches = matches.subList(start, end);
                }

                List<Profile> pagedProfiles = pagedMatches.stream()
                                .map(DailyMatch::getProfile)
                                .collect(Collectors.toList());

                List<ProfileDTO> dtos = profileService.mapToDTOs(pagedProfiles, user);

                // Overlay stored scores & reasons
                for (int i = 0; i < dtos.size(); i++) {
                        DailyMatch dm = pagedMatches.get(i);
                        dtos.get(i).setMatchPercentage(dm.getMatchScore() != null ? dm.getMatchScore() : 0.0);

                        // Deserialize stored reasons
                        if (dm.getTopReasons() != null && !dm.getTopReasons().isEmpty()) {
                                try {
                                        List<String> reasons = new ArrayList<>();
                                        String raw = dm.getTopReasons().replace("[", "").replace("]", "").replace("\"", "");
                                        for (String r : raw.split(",")) {
                                                String trimmed = r.trim();
                                                if (!trimmed.isEmpty()) reasons.add(trimmed);
                                        }
                                        dtos.get(i).setTopMatchReasons(reasons);
                                } catch (Exception e) {
                                        dtos.get(i).setTopMatchReasons(new ArrayList<>());
                                }
                        }
                }

                return new PageImpl<>(dtos, pageable, total);
        }

        // ====================================================================
        //  ALL MATCHES â€” Same scoring pipeline
        // ====================================================================

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getAllMatches(User user, Pageable pageable) {
                // Reuse the same scoring pipeline as getNewMatches
                return getNewMatches(user, pageable);
        }

        // ====================================================================
        //  NEAR-ME MATCHES
        // ====================================================================

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getNearMeMatches(User user, Pageable pageable) {
                Profile userProfile = profileRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User profile not found"));

                String targetGender = "Male".equalsIgnoreCase(userProfile.getGender()) ? "Female" : "Male";

                // Get user's city and state from profile
                String city = userProfile.getCity();
                String state = userProfile.getState();

                // Fallback to partner preferences if profile city/state is empty
                if ((city == null || city.trim().isEmpty()) && (state == null || state.trim().isEmpty())) {
                    PartnerPreference pref = partnerPreferenceRepository.findByUser(user).orElse(null);
                    if (pref != null) {
                        city = pref.getPreferredCity();
                        state = pref.getPreferredState();
                    }
                }

                city = (city != null) ? city.trim() : null;
                state = (state != null) ? state.trim() : null;

                log.info("Fetching near-me matches for user {}. TargetGender: {}, City: {}, State: {}",
                         user.getId(), targetGender, city, state);

                Page<Profile> nearProfiles = null;

                // 1. Try matching by City
                if (city != null && !city.isEmpty()) {
                    nearProfiles = profileRepository.findAllByGenderAndCityIgnoreCaseAndProfileVisibilityNot(targetGender, city, "HIDDEN", pageable);
                    if (nearProfiles.getTotalElements() == 0) {
                        nearProfiles = null;
                    }
                }

                // 2. Try matching by State
                if (nearProfiles == null && state != null && !state.isEmpty()) {
                    nearProfiles = profileRepository.findAllByGenderAndStateIgnoreCaseAndProfileVisibilityNot(targetGender, state, "HIDDEN", pageable);
                    if (nearProfiles.getTotalElements() == 0) {
                        nearProfiles = null;
                    }
                }

                // 3. Fallback
                if (nearProfiles == null) {
                    nearProfiles = profileRepository.findAllByGenderAndProfileVisibilityNot(targetGender, "HIDDEN", pageable);
                }

                List<ProfileDTO> dtos = profileService.mapToDTOs(nearProfiles.getContent(), user);
                return new PageImpl<>(dtos, pageable, nearProfiles.getTotalElements());
        }

        // ====================================================================
        //  PROFILE VIEW LOGGING
        // ====================================================================

        @Override
        @Transactional
        public void logProfileView(User user, Long profileId) {
                log.info("Logging profile view: user {} viewed profile {}", user.getId(), profileId);

                profileRepository.findById(profileId).ifPresent(viewedProfile -> {
                        if (viewedProfile.getUser() != null && viewedProfile.getUser().getId().equals(user.getId())) {
                                return;
                        }

                        ProfileView view = profileViewRepository
                                        .findByViewerAndViewedProfileId(user, profileId)
                                        .orElse(ProfileView.builder()
                                                        .viewer(user)
                                                        .viewedProfile(viewedProfile)
                                                        .build());

                        view.setUpdatedAt(LocalDateTime.now());
                        profileViewRepository.save(view);

                        // Notify profile owner
                        if (viewedProfile.getUser() != null) {
                                try {
                                        Profile viewerProfile = profileRepository.findByUserId(user.getId()).orElse(null);
                                        String viewerName = viewerProfile != null ? viewerProfile.getFullName() : "Someone";
                                        String viewerPhoto = viewerProfile != null ? viewerProfile.getProfilePhotoUrl() : null;
                                        Long refId = viewerProfile != null ? viewerProfile.getId() : null;
                                        notificationService.createNotification(
                                                        viewedProfile.getUser(),
                                                        NotificationType.PROFILE_VIEW,
                                                        "Profile Viewed",
                                                        "viewed your profile.",
                                                        viewerName, viewerPhoto, refId);
                                } catch (Exception e) {
                                        log.warn("Failed to create profile-view notification: {}", e.getMessage());
                                }
                        }
                });
        }

        // ====================================================================
        //  RECENTLY VIEWED / VISITORS
        // ====================================================================

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getRecentlyViewedProfiles(User user, Pageable pageable) {
                log.info("Fetching recently viewed profiles for user {}", user.getId());

                List<ProfileView> views = profileViewRepository.findRecentlyViewed(user, PageRequest.of(0, 50));

                List<Profile> uniqueProfiles = views.stream()
                                .map(ProfileView::getViewedProfile)
                                .filter(distinctByKey(Profile::getId))
                                .collect(Collectors.toList());

                int total = uniqueProfiles.size();
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), total);

                List<Profile> pagedProfiles = new ArrayList<>();
                if (start < total) {
                    pagedProfiles = uniqueProfiles.subList(start, end);
                }

                return new PageImpl<>(profileService.mapToDTOs(pagedProfiles, user), pageable, total);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getRecentVisitors(User user, Pageable pageable) {
                log.info("Fetching recent visitors for user: {}", user.getId());

                Profile profile = profileRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found for user: " + user.getId()));

                List<ProfileView> views = profileViewRepository.findRecentVisitors(profile, PageRequest.of(0, 50));

                List<Profile> uniqueVisitors = views.stream()
                                .map(view -> profileRepository.findByUserId(view.getViewer().getId()))
                                .filter(opt -> opt.isPresent() && !"HIDDEN".equals(opt.get().getProfileVisibility()))
                                .map(java.util.Optional::get)
                                .filter(distinctByKey(Profile::getId))
                                .collect(Collectors.toList());

                int total = uniqueVisitors.size();
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), total);

                List<Profile> pagedProfiles = new ArrayList<>();
                if (start < total) {
                    pagedProfiles = uniqueVisitors.subList(start, end);
                }

                return new PageImpl<>(profileService.mapToDTOs(pagedProfiles, user), pageable, total);
        }

        // ====================================================================
        //  ONLINE / SHORTLISTED MEMBERS
        // ====================================================================

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getOnlineMatches(User user, Pageable pageable) {
                String targetGender = profileRepository.findByUserId(user.getId())
                                .map(p -> "Male".equalsIgnoreCase(p.getGender()) ? "Female" : "Male")
                                .orElse("Female");

                LocalDateTime threshold = LocalDateTime.now().minusMinutes(10);
                List<Profile> onlineProfiles = profileRepository.findOnlineProfiles(targetGender, threshold, user.getId());

                int total = onlineProfiles.size();
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), total);

                List<Profile> pagedProfiles = new ArrayList<>();
                if (start < total) {
                    pagedProfiles = onlineProfiles.subList(start, end);
                }

                return new PageImpl<>(profileService.mapToDTOs(pagedProfiles, user), pageable, total);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getOnlineAcceptedMembers(User user, Pageable pageable) {
                List<com.punarmilan.entity.ConnectionRequest> acceptedRequests = new java.util.ArrayList<>(
                                connectionRequestRepository.findAllBySenderAndStatus(user, RequestStatus.ACCEPTED));
                acceptedRequests.addAll(connectionRequestRepository.findAllByReceiverAndStatus(user, RequestStatus.ACCEPTED));

                List<Profile> onlineMembers = acceptedRequests.stream()
                                .map(req -> req.getSender().getId().equals(user.getId()) ? req.getReceiver() : req.getSender())
                                .filter(u -> userActivityService.isUserOnline(u.getEmail()))
                                .map(u -> profileRepository.findByUserId(u.getId()))
                                .filter(opt -> opt.isPresent() && !"HIDDEN".equals(opt.get().getProfileVisibility()))
                                .map(java.util.Optional::get)
                                .collect(Collectors.toList());

                int total = onlineMembers.size();
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), total);

                List<Profile> pagedProfiles = new ArrayList<>();
                if (start < total) {
                    pagedProfiles = onlineMembers.subList(start, end);
                }

                return new PageImpl<>(profileService.mapToDTOs(pagedProfiles, user), pageable, total);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getShortlistedMembers(User user, Pageable pageable) {
                List<com.punarmilan.entity.Shortlist> shortlist = shortlistRepository.findByUser(user);

                int total = shortlist.size();
                int start = (int) pageable.getOffset();

                List<Profile> pagedProfiles = shortlist.stream()
                        .skip(start)
                        .limit(pageable.getPageSize())
                        .map(com.punarmilan.entity.Shortlist::getShortlistedProfile)
                        .collect(Collectors.toList());

                return new PageImpl<>(profileService.mapToDTOs(pagedProfiles, user), pageable, total);
        }

        // ====================================================================
        //  PREFERENCE MATCH â€” Weighted two-way scoring with field breakdown
        // ====================================================================

        @Override
        @Cacheable(value = "partnerPreferences", key = "#currentUser.email + ':' + #targetProfileId")
        public com.punarmilan.dto.PreferenceMatchDTO getPreferenceMatch(User currentUser, Long targetProfileId) {
                Profile myProfile = profileRepository.findByUserId(currentUser.getId())
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Current user profile not found"));

                Profile targetProfile = profileRepository.findById(targetProfileId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Target profile not found"));

                PartnerPreference myPref = partnerPreferenceRepository.findByUser(currentUser).orElse(null);
                PartnerPreference targetPref = targetProfile.getUser() != null
                                ? partnerPreferenceRepository.findByUser(targetProfile.getUser()).orElse(null)
                                : null;

                // Compute two-way score using the scoring engine
                MatchScoreCalculator.MatchResult result = matchScoreCalculator.computeTwoWayScore(
                                myProfile, myPref, targetProfile, targetPref);

                // Also build the detailed field-by-field breakdown for UI
                List<com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus> matchList = new ArrayList<>();

                // Use target's preference to check how well I match what they want
                if (targetPref != null) {
                        matchList.add(checkAgeMatch(myProfile.getAge(), targetPref.getMinAge(), targetPref.getMaxAge()));
                        matchList.add(checkHeightMatch(myProfile.getHeight(), targetPref.getMinHeight(), targetPref.getMaxHeight()));
                        matchList.add(checkStringMatch("MARITAL STATUS", myProfile.getMaritalStatus(), targetPref.getMaritalStatus()));

                        // Religion / Community compound
                        String myCommunity = buildCommunityString(myProfile.getReligion(), myProfile.getCaste());
                        String prefCommunity = buildCommunityString(targetPref.getPreferredReligion(), targetPref.getPreferredCaste());
                        boolean relMatch = checkStringMatchRaw(myProfile.getReligion(), targetPref.getPreferredReligion());
                        boolean casteMatch = checkStringMatchRaw(myProfile.getCaste(), targetPref.getPreferredCaste());
                        matchList.add(com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus.builder()
                                        .fieldLabel("RELIGION / COMMUNITY")
                                        .prefValue(prefCommunity.isEmpty() ? "Any" : prefCommunity)
                                        .actualValue(myCommunity.isEmpty() ? "Any" : myCommunity)
                                        .isMatch(relMatch && casteMatch)
                                        .build());

                        matchList.add(checkStringMatch("QUALIFICATION", myProfile.getEducationLevel(), targetPref.getMinEducationLevel()));
                        matchList.add(checkStringMatch("WORKING AS", myProfile.getOccupation(), targetPref.getOccupation()));
                        matchList.add(checkIncomeMatch(myProfile.getAnnualIncome(), targetPref.getMinAnnualIncome()));
                } else {
                        // No target preference â€” all fields auto-pass
                        matchList.add(buildAutoPass("AGE", myProfile.getAge() != null ? myProfile.getAge() + " yrs" : "N/A"));
                        matchList.add(buildAutoPass("HEIGHT", myProfile.getHeight() != null ? myProfile.getHeight() : "N/A"));
                        matchList.add(buildAutoPass("MARITAL STATUS", myProfile.getMaritalStatus() != null ? myProfile.getMaritalStatus() : "N/A"));
                        matchList.add(buildAutoPass("RELIGION / COMMUNITY", buildCommunityString(myProfile.getReligion(), myProfile.getCaste())));
                        matchList.add(buildAutoPass("QUALIFICATION", myProfile.getEducationLevel() != null ? myProfile.getEducationLevel() : "N/A"));
                        matchList.add(buildAutoPass("WORKING AS", myProfile.getOccupation() != null ? myProfile.getOccupation() : "N/A"));
                        matchList.add(buildAutoPass("ANNUAL INCOME", myProfile.getAnnualIncome() != null ? myProfile.getAnnualIncome() : "N/A"));
                }

                int matchedCount = (int) matchList.stream().filter(m -> m.isMatch()).count();

                return com.punarmilan.dto.PreferenceMatchDTO.builder()
                                .totalPreferences(matchList.size())
                                .matchedCount(matchedCount)
                                .matchPercentage(result.getScore()) // Use weighted score, not simple ratio
                                .matchList(matchList)
                                .build();
        }

        // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Field-Level Check Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus buildAutoPass(String label, String actualValue) {
                return com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus.builder()
                                .fieldLabel(label)
                                .prefValue("Any")
                                .actualValue(actualValue.isEmpty() ? "Any" : actualValue)
                                .isMatch(true)
                                .build();
        }

        private String buildCommunityString(String religion, String caste) {
                StringBuilder sb = new StringBuilder();
                if (religion != null && !religion.isEmpty() && !"null".equalsIgnoreCase(religion)) {
                        sb.append(religion);
                }
                if (caste != null && !caste.isEmpty() && !"null".equalsIgnoreCase(caste)) {
                        if (sb.length() > 0) sb.append(": ");
                        sb.append(caste);
                }
                return sb.toString();
        }

        private boolean checkStringMatchRaw(String myVal, String prefVal) {
                if (prefVal == null || prefVal.isEmpty() || "Any".equalsIgnoreCase(prefVal)
                                || "Open to All".equalsIgnoreCase(prefVal) || "null".equalsIgnoreCase(prefVal)) {
                        return true;
                }
                if (myVal == null || myVal.isEmpty() || "null".equalsIgnoreCase(myVal)) {
                        return false;
                }
                String[] prefs = prefVal.split(",");
                for (String p : prefs) {
                        if (myVal.trim().equalsIgnoreCase(p.trim())) return true;
                }
                return false;
        }

        private com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus checkAgeMatch(Integer myAge, Integer min, Integer max) {
                boolean match = true;
                if (myAge != null) {
                        if (min != null && myAge < min) match = false;
                        if (max != null && myAge > max) match = false;
                } else if (min != null || max != null) {
                        match = false;
                }

                String prefVal = (min != null ? min : "18") + " to " + (max != null ? max : "70");
                return com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus.builder()
                                .fieldLabel("AGE")
                                .prefValue(prefVal)
                                .actualValue(myAge != null ? myAge + " yrs" : "N/A")
                                .isMatch(match)
                                .build();
        }

        private com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus checkHeightMatch(String myHeight, String min, String max) {
                String effectiveMin = (min == null || "null".equalsIgnoreCase(min)) ? null : min;
                String effectiveMax = (max == null || "null".equalsIgnoreCase(max)) ? null : max;

                int myInches = parseHeightToInches(myHeight);
                int minInches = parseHeightToInches(effectiveMin);
                int maxInches = parseHeightToInches(effectiveMax);

                boolean match = true;
                if (myInches > 0) {
                        if (minInches > 0 && myInches < minInches) match = false;
                        if (maxInches > 0 && myInches > maxInches) match = false;
                } else if (minInches > 0 || maxInches > 0) {
                        match = false;
                }

                String prefDisplay = (effectiveMin != null ? effectiveMin : "Any") + " to "
                                + (effectiveMax != null ? effectiveMax : "Any");

                return com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus.builder()
                                .fieldLabel("HEIGHT")
                                .prefValue(prefDisplay)
                                .actualValue(myHeight != null && !"null".equalsIgnoreCase(myHeight) ? myHeight : "N/A")
                                .isMatch(match)
                                .build();
        }

        private com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus checkStringMatch(String label, String myVal, String prefVal) {
                String effectivePref = (prefVal == null || "null".equalsIgnoreCase(prefVal)) ? "Any" : prefVal;
                String effectiveMy = (myVal == null || "null".equalsIgnoreCase(myVal)) ? "" : myVal;

                boolean match = true;
                if (!"Any".equalsIgnoreCase(effectivePref) && !"Open to All".equalsIgnoreCase(effectivePref)
                                && !effectivePref.isEmpty()) {
                        if (effectiveMy.isEmpty()) {
                                match = false;
                        } else {
                                String[] prefs = effectivePref.split(",");
                                boolean found = false;
                                for (String p : prefs) {
                                        if (effectiveMy.trim().equalsIgnoreCase(p.trim())) { found = true; break; }
                                }
                                match = found;
                        }
                }

                return com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus.builder()
                                .fieldLabel(label)
                                .prefValue(effectivePref)
                                .actualValue(effectiveMy.isEmpty() ? "Any" : effectiveMy)
                                .isMatch(match)
                                .build();
        }

        private com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus checkIncomeMatch(String myIncome, String minIncome) {
                String effectivePref = (minIncome == null || "null".equalsIgnoreCase(minIncome)) ? "Any" : minIncome;
                String effectiveMy = (myIncome == null || "null".equalsIgnoreCase(myIncome)) ? "" : myIncome;

                boolean match = true;
                if (!"Any".equalsIgnoreCase(effectivePref) && !effectivePref.isEmpty()) {
                        if (effectiveMy.isEmpty()) {
                                match = false;
                        } else {
                                match = effectiveMy.toLowerCase().contains(effectivePref.toLowerCase()) ||
                                                effectivePref.toLowerCase().contains(effectiveMy.toLowerCase());
                        }
                }

                return com.punarmilan.dto.PreferenceMatchDTO.FieldMatchStatus.builder()
                                .fieldLabel("ANNUAL INCOME")
                                .prefValue(effectivePref)
                                .actualValue(effectiveMy.isEmpty() ? "Any" : effectiveMy)
                                .isMatch(match)
                                .build();
        }

        private int parseHeightToInches(String heightStr) {
                if (heightStr == null || heightStr.isEmpty()) return 0;
                try {
                        if (heightStr.contains("'")) {
                                String[] parts = heightStr.split("'");
                                int ft = Integer.parseInt(parts[0].replaceAll("[^0-9]", ""));
                                int inch = 0;
                                if (parts.length > 1) {
                                        String inchPart = parts[1].replaceAll("[^0-9]", "");
                                        if (!inchPart.isEmpty()) inch = Integer.parseInt(inchPart);
                                }
                                return (ft * 12) + inch;
                        } else if (heightStr.toLowerCase().contains("cm")) {
                                int cm = Integer.parseInt(heightStr.replaceAll("[^0-9]", ""));
                                return (int) Math.round(cm / 2.54);
                        }
                } catch (Exception e) {
                        log.warn("Failed to parse height string: {}", heightStr);
                }
                return 0;
        }

        // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Utility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
                Map<Object, Boolean> seen = new ConcurrentHashMap<>();
                return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
        }
}