package com.punarmilan.service.impl;

import com.punarmilan.dto.PartnerPreferenceDTO;
import com.punarmilan.entity.PartnerPreference;
import com.punarmilan.entity.User;
import com.punarmilan.repository.PartnerPreferenceRepository;
import com.punarmilan.service.PartnerPreferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PartnerPreferenceServiceImpl implements PartnerPreferenceService {

    private final PartnerPreferenceRepository partnerPreferenceRepository;

    @Override
    @Transactional
    public PartnerPreferenceDTO getMyPreferences(User user) {
        PartnerPreference preferences = partnerPreferenceRepository.findByUser(user)
                .orElseGet(() -> createDefaultPreferences(user));
        return mapToDTO(preferences);
    }

    @Override
    @Transactional
    public PartnerPreferenceDTO updatePreferences(User user, Map<String, Object> updates) {
        PartnerPreference preferences = partnerPreferenceRepository.findByUser(user)
                .orElseGet(() -> createDefaultPreferences(user));

        org.springframework.beans.BeanWrapper beanWrapper = new org.springframework.beans.BeanWrapperImpl(preferences);
        updates.forEach((key, value) -> {
            try {
                if (beanWrapper.isWritableProperty(key)) {
                    if (value == null || (value instanceof String && ((String) value).trim().isEmpty())) {
                        beanWrapper.setPropertyValue(key, null);
                    } else {
                        beanWrapper.setPropertyValue(key, value);
                    }
                }
            } catch (Exception e) {
                log.warn("Field {} could not be updated in PartnerPreference entity: {}", key, e.getMessage());
            }
        });

        PartnerPreference savedPreferences = partnerPreferenceRepository.saveAndFlush(preferences);
        return mapToDTO(savedPreferences);
    }

    private PartnerPreference createDefaultPreferences(User user) {
        PartnerPreference preferences = PartnerPreference.builder()
                .user(user)
                .minAge(18)
                .maxAge(35)
                .minHeight("5ft")
                .maxHeight("6ft")
                .showVerifiedOnly(true)
                .enableAutoMatch(true)
                .matchScoreThreshold(0)
                .build();
        return partnerPreferenceRepository.save(preferences);
    }

    private PartnerPreferenceDTO mapToDTO(PartnerPreference p) {
        return PartnerPreferenceDTO.builder()
                .id(p.getId())
                .minAge(p.getMinAge())
                .maxAge(p.getMaxAge())
                .minHeight(p.getMinHeight())
                .maxHeight(p.getMaxHeight())
                .preferredReligion(p.getPreferredReligion())
                .preferredCaste(p.getPreferredCaste())
                .preferredSubCaste(p.getPreferredSubCaste())
                .preferredMotherTongue(p.getPreferredMotherTongue())
                .minEducationLevel(p.getMinEducationLevel())
                .preferredEducationField(p.getPreferredEducationField())
                .preferredCountry(p.getPreferredCountry())
                .preferredState(p.getPreferredState())
                .preferredCity(p.getPreferredCity())
                .occupation(p.getOccupation())
                .workingWith(p.getWorkingWith())
                .professionArea(p.getProfessionArea())
                .minAnnualIncome(p.getMinAnnualIncome())
                .maritalStatus(p.getMaritalStatus())
                .preferredDiet(p.getPreferredDiet())
                .drinkingHabit(p.getDrinkingHabit())
                .smokingHabit(p.getSmokingHabit())
                .profileManagedBy(p.getProfileManagedBy())
                .preferWorkingProfessional(p.getPreferWorkingProfessional())
                .preferNri(p.getPreferNri())
                .showVerifiedOnly(p.getShowVerifiedOnly())
                .enableAutoMatch(p.getEnableAutoMatch())
                .matchScoreThreshold(p.getMatchScoreThreshold())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
