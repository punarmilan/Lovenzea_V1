package com.punarmilan.service.impl;

import com.punarmilan.dto.DashboardSummaryDTO;
import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.RequestStatus;
import com.punarmilan.repository.ConnectionRequestRepository;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.repository.ProfileViewRepository;
import com.punarmilan.service.DashboardService;
import com.punarmilan.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProfileService profileService;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final ProfileViewRepository profileViewRepository;
    private final ProfileRepository profileRepository;

    @Override
    public DashboardSummaryDTO getDashboardSummary(User user) {
        ProfileDTO profileDTO = profileService.getMyProfile(user);

        // Count pending invitations (requests received by user, status=PENDING)
        long pendingCount = connectionRequestRepository.findAllByReceiverAndStatus(user, RequestStatus.PENDING).size();

        // Count accepted invitations (connections accepted, sent or received by user)
        long acceptedByMeCount = connectionRequestRepository.findAllBySenderAndStatus(user, RequestStatus.ACCEPTED)
                .size();
        long acceptedByHerCount = connectionRequestRepository.findAllByReceiverAndStatus(user, RequestStatus.ACCEPTED)
                .size();
        long acceptedCount = acceptedByMeCount + acceptedByHerCount;
        
        // Count interests sent by user
        long sentCount = connectionRequestRepository.findAllBySender(user).size();

        // Count recent visitors (profiles who recently viewed this user's profile)
        long visitorsCount = 0;
        try {
            Optional<Profile> profileOpt = profileRepository.findByUser(user);
            if (profileOpt.isPresent()) {
                visitorsCount = profileViewRepository.findRecentVisitors(
                        profileOpt.get(), PageRequest.of(0, 50)).size();
            }
        } catch (Exception e) {
            visitorsCount = 0;
        }

        return DashboardSummaryDTO.builder()
                .user(profileDTO)
                .pendingInvitations(pendingCount)
                .acceptedInvitations(acceptedCount)
                .recentVisitorsCount(visitorsCount)
                .interestsSentCount(sentCount)
                .profileCompletionPercentage(profileDTO.getProfileComplete() != null && profileDTO.getProfileComplete() ? 100 : 85) // Simplified for now, can be more complex
                .build();
    }
}
