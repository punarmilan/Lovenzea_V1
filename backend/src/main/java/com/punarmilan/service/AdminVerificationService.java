package com.punarmilan.service;

import com.punarmilan.dto.ProfileDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminVerificationService {
    Page<ProfileDTO> getPendingProfiles(Pageable pageable);

    void approveProfile(Long profileId);

    void rejectProfile(Long profileId, String reason);

    Page<ProfileDTO> getPendingPhotos(Pageable pageable);

    void approvePhotos(Long profileId);

    void rejectPhotos(Long profileId, String reason);

    void deleteUserPhoto(Long profileId, Integer photoIndex);
}
