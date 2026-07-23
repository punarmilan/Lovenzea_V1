package com.punarmilan.service;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.dto.SearchCriteriaDTO;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProfileService {
    Page<ProfileDTO> searchProfiles(SearchCriteriaDTO criteria, User viewer, Pageable pageable);
    
    Map<String, List<String>> getFilterOptions();

    ProfileDTO getMyProfile(User user);

    ProfileDTO updateProfile(User user, Map<String, Object> updates);

    ProfileDTO uploadPhoto(User user, MultipartFile file, Integer photoIndex);

    ProfileDTO deletePhoto(User user, Integer photoIndex);

    ProfileDTO deletePhotoByProfileId(Long profileId, Integer photoIndex);

    ProfileDTO getProfileByUserId(Long userId, User viewer);

    List<ProfileDTO> mapToDTOs(List<Profile> profiles, User viewer);

    void createDefaultProfile(User user, String firstName, String lastName, String profileCreatedBy, String gender);

    ProfileDTO mapToDTO(Profile profile, User viewer);

    ProfileDTO uploadIdProof(User user, MultipartFile file, String idProofType, String idProofNumber);
}
