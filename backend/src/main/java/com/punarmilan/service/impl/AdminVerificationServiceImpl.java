package com.punarmilan.service.impl;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.enums.NotificationType;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.service.AdminLogService;
import com.punarmilan.service.AdminVerificationService;
import com.punarmilan.service.NotificationService;
import com.punarmilan.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminVerificationServiceImpl implements AdminVerificationService {

        private final ProfileRepository profileRepository;
        private final NotificationService notificationService;
        private final AdminLogService adminLogService;
        private final ProfileService profileService;
        private final org.springframework.cache.CacheManager cacheManager;

        private void evictProfileCache(String email) {
                if (cacheManager != null && cacheManager.getCache("profiles") != null) {
                        cacheManager.getCache("profiles").evict(email);
                }
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getPendingProfiles(Pageable pageable) {
                long total = profileRepository.count();
                long pending = profileRepository.countByVerificationStatus("PENDING");
                long unverified = profileRepository.countByVerificationStatus("UNVERIFIED");
                
                // Count profiles where status might be null or other values
                System.out.println("DEBUG: System Status Counts:");
                System.out.println("DEBUG: - Total Profiles: " + total);
                System.out.println("DEBUG: - PENDING Profiles: " + pending);
                System.out.println("DEBUG: - UNVERIFIED Profiles: " + unverified);
                
                // Temporary: allow both PENDING and UNVERIFIED to see if anything appears
                Specification<Profile> spec = (root, query, cb) -> 
                    cb.or(
                        cb.equal(root.get("verificationStatus"), "PENDING"),
                        cb.equal(root.get("verificationStatus"), "UNVERIFIED")
                    );
                    
                Page<Profile> profiles = profileRepository.findAll(spec, pageable);
                System.out.println("DEBUG: Returning " + profiles.getTotalElements() + " profiles in queue");
                return profiles.map(p -> profileService.mapToDTO(p, null));
        }

        @Override
        @Transactional
        public void approveProfile(Long profileId) {
                Profile profile = profileRepository.findById(profileId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));
                profile.setVerificationStatus("VERIFIED");
                profile.setVerifiedAt(LocalDateTime.now());
                profileRepository.save(profile);

                // Evict cache to reflect changes immediately
                if (profile.getUser() != null) {
                        evictProfileCache(profile.getUser().getEmail());
                }

                adminLogService.logAction("APPROVE_PROFILE",
                                "Approved profile ID: " + profileId + " (" + profile.getProfileId() + ")");

                notificationService.createNotification(
                                profile.getUser(),
                                NotificationType.VERIFICATION_APPROVED,
                                "Profile Verified",
                                "Congratulations! Your profile has been verified by the admin.",
                                "Admin",
                                null,
                                profile.getId());
        }

        @Override
        @Transactional
        public void rejectProfile(Long profileId, String reason) {
                Profile profile = profileRepository.findById(profileId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));
                profile.setVerificationStatus("REJECTED");
                profileRepository.save(profile);

                // Evict cache to reflect changes immediately
                if (profile.getUser() != null) {
                        evictProfileCache(profile.getUser().getEmail());
                }

                adminLogService.logAction("REJECT_PROFILE", "Rejected profile ID: " + profileId + " ("
                                + profile.getProfileId() + "). Reason: " + reason);

                notificationService.createNotification(
                                profile.getUser(),
                                NotificationType.VERIFICATION_REJECTED,
                                "Profile Verification Rejected",
                                "Your profile verification was rejected. Reason: " + reason,
                                "Admin",
                                null,
                                profile.getId());
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProfileDTO> getPendingPhotos(Pageable pageable) {
                Specification<Profile> spec = (root, query, cb) -> cb.equal(root.get("photoVerificationStatus"),
                                "PENDING");
                Page<Profile> profiles = profileRepository.findAll(spec, pageable);
                return profiles.map(p -> profileService.mapToDTO(p, null));
        }

        @Override
        @Transactional
        public void approvePhotos(Long profileId) {
                Profile profile = profileRepository.findById(profileId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));
                profile.setPhotoVerificationStatus("VERIFIED");
                profileRepository.save(profile);

                // Evict cache to reflect changes immediately
                if (profile.getUser() != null) {
                        evictProfileCache(profile.getUser().getEmail());
                }

                adminLogService.logAction("APPROVE_PHOTOS", "Approved photos for profile ID: " + profileId);

                notificationService.createNotification(
                                profile.getUser(),
                                NotificationType.VERIFICATION_APPROVED,
                                "Photos Verified",
                                "Your uploaded photos have been approved by the admin.",
                                "Admin",
                                null,
                                profile.getId());
        }

        @Override
        @Transactional
        public void rejectPhotos(Long profileId, String reason) {
                Profile profile = profileRepository.findById(profileId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));
                profile.setPhotoVerificationStatus("REJECTED");
                profileRepository.save(profile);

                // Evict cache to reflect changes immediately
                if (profile.getUser() != null) {
                        evictProfileCache(profile.getUser().getEmail());
                }

                adminLogService.logAction("REJECT_PHOTOS",
                                "Rejected photos for profile ID: " + profileId + ". Reason: " + reason);

                notificationService.createNotification(
                                profile.getUser(),
                                NotificationType.VERIFICATION_REJECTED,
                                "Photos Rejected",
                                "Your photos were rejected. Reason: " + reason,
                                "Admin",
                                null,
                                profile.getId());
        }

        @Override
        @Transactional
        public void deleteUserPhoto(Long profileId, Integer photoIndex) {
                profileService.deletePhotoByProfileId(profileId, photoIndex);
                adminLogService.logAction("DELETE_USER_PHOTO",
                                "Admin deleted photo at index " + photoIndex + " for profile ID: " + profileId);
        }
}
