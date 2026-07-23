package com.punarmilan.service.impl;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.Shortlist;
import com.punarmilan.entity.User;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.repository.ShortlistRepository;
import com.punarmilan.service.ShortlistService;
import com.punarmilan.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShortlistServiceImpl implements ShortlistService {

    private final ShortlistRepository shortlistRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    @Override
    @Transactional
    public void addToShortlist(User user, Long profileId) {
        log.info("Adding profile {} to shortlist for user {}", profileId, user.getId());
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));

        if (!shortlistRepository.existsByUserAndShortlistedProfile(user, profile)) {
            Shortlist shortlist = Shortlist.builder()
                    .user(user)
                    .shortlistedProfile(profile)
                    .build();
            shortlistRepository.save(shortlist);
        }
    }

    @Override
    @Transactional
    public void removeFromShortlist(User user, Long profileId) {
        log.info("Removing profile {} from shortlist for user {}", profileId, user.getId());
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));

        shortlistRepository.deleteByUserAndShortlistedProfile(user, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfileDTO> getMyShortlist(User user) {
        log.info("Fetching shortlist for user {}", user.getId());
        return shortlistRepository.findByUser(user).stream()
                .map(shortlist -> profileService.mapToDTO(shortlist.getShortlistedProfile(), user))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isShortlisted(User user, Long profileId) {
        Profile profile = profileRepository.findById(profileId).orElse(null);
        if (profile == null)
            return false;
        return shortlistRepository.existsByUserAndShortlistedProfile(user, profile);
    }
}
