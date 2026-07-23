package com.punarmilan.service;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MatchService {
    Page<ProfileDTO> getNewMatches(User user, Pageable pageable);

    Page<ProfileDTO> getTodayMatches(User user, Pageable pageable);

    Page<ProfileDTO> getAllMatches(User user, Pageable pageable);

    Page<ProfileDTO> getNearMeMatches(User user, Pageable pageable);

    void logProfileView(User user, Long profileId);

    Page<ProfileDTO> getRecentlyViewedProfiles(User user, Pageable pageable);

    Page<ProfileDTO> getRecentVisitors(User user, Pageable pageable);

    Page<ProfileDTO> getOnlineMatches(User user, Pageable pageable);

    Page<ProfileDTO> getOnlineAcceptedMembers(User user, Pageable pageable);

    Page<ProfileDTO> getShortlistedMembers(User user, Pageable pageable);

    com.punarmilan.dto.PreferenceMatchDTO getPreferenceMatch(User currentUser, Long targetProfileId);
}
