package com.punarmilan.repository;

import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>,
                org.springframework.data.jpa.repository.JpaSpecificationExecutor<Profile> {
        Optional<Profile> findFirstByUserOrderByIdDesc(User user);

        default Optional<Profile> findByUser(User user) {
            return findFirstByUserOrderByIdDesc(user);
        }

        Optional<Profile> findFirstByUserIdOrderByIdDesc(Long userId);

        default Optional<Profile> findByUserId(Long userId) {
            return findFirstByUserIdOrderByIdDesc(userId);
        }

        Optional<Profile> findByProfileId(String profileId);

        List<Profile> findAllByGenderAndProfileVisibilityNotAndCreatedAtBetween(String gender, String visibility,
                        LocalDateTime start, LocalDateTime end);

        Page<Profile> findAllByGenderAndProfileVisibilityNot(String gender, String visibility, Pageable pageable);

        List<Profile> findAllByGenderAndProfileVisibilityNot(String gender, String visibility);

        Page<Profile> findAllByGenderAndCityIgnoreCaseAndProfileVisibilityNot(String gender, String city, String visibility, Pageable pageable);

        List<Profile> findAllByGenderAndCityIgnoreCaseAndProfileVisibilityNot(String gender, String city, String visibility);

        Page<Profile> findAllByGenderAndStateIgnoreCaseAndProfileVisibilityNot(String gender, String state, String visibility, Pageable pageable);

        List<Profile> findAllByGenderAndStateIgnoreCaseAndProfileVisibilityNot(String gender, String state, String visibility);

        List<Profile> findAllByGenderAndCountryAndProfileVisibilityNot(String gender, String country,
                        String visibility);

        List<Profile> findTop5ByGenderAndProfileVisibilityNotOrderByCreatedAtDesc(String gender, String visibility);

        @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM profiles p WHERE p.user_id != :userId AND p.gender = :gender AND (p.profile_visibility != 'HIDDEN' OR p.profile_visibility IS NULL) AND p.id NOT IN (:excludedIds) ORDER BY RAND()", nativeQuery = true)
        List<Profile> findRandomProfilesExcluding(
                        @org.springframework.data.repository.query.Param("userId") Long userId,
                        @org.springframework.data.repository.query.Param("gender") String gender,
                        @org.springframework.data.repository.query.Param("excludedIds") java.util.Collection<Long> excludedIds,
                        org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT p FROM Profile p JOIN p.user u WHERE p.gender = :gender AND (p.profileVisibility != 'HIDDEN' OR p.profileVisibility IS NULL) AND u.lastActive > :threshold AND u.id != :currentUserId")
        List<Profile> findOnlineProfiles(@org.springframework.data.repository.query.Param("gender") String gender,
                        @org.springframework.data.repository.query.Param("threshold") LocalDateTime threshold,
                        @org.springframework.data.repository.query.Param("currentUserId") Long currentUserId);

        long countByVerificationStatus(String status);

        long countByPhotoVerificationStatus(String status);

        long countByGender(String gender);

        @org.springframework.data.jpa.repository.Query("SELECT p FROM Profile p JOIN p.user u WHERE p.gender = :gender "
                        + "AND (p.profileVisibility IS NULL OR p.profileVisibility != 'HIDDEN') "
                        + "AND u.enabled = true "
                        + "ORDER BY p.createdAt DESC")
        List<Profile> findLatestActiveByGender(@org.springframework.data.repository.query.Param("gender") String gender,
                        org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT p FROM Profile p JOIN FETCH p.user u WHERE p.gender = :gender "
                        + "AND (p.profileVisibility IS NULL OR p.profileVisibility != 'HIDDEN') "
                        + "AND u.enabled = true AND u.id NOT IN :excludedIds "
                        + "ORDER BY p.createdAt DESC")
        List<Profile> findCandidateProfiles(
                        @org.springframework.data.repository.query.Param("gender") String gender,
                        @org.springframework.data.repository.query.Param("excludedIds") java.util.Collection<Long> excludedIds,
                        org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.religion FROM Profile p WHERE p.religion IS NOT NULL AND p.religion != ''")
        List<String> findDistinctReligion();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.caste FROM Profile p WHERE p.caste IS NOT NULL AND p.caste != ''")
        List<String> findDistinctCaste();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.subCaste FROM Profile p WHERE p.subCaste IS NOT NULL AND p.subCaste != ''")
        List<String> findDistinctSubCaste();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.state FROM Profile p WHERE p.state IS NOT NULL AND p.state != ''")
        List<String> findDistinctState();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.city FROM Profile p WHERE p.city IS NOT NULL AND p.city != ''")
        List<String> findDistinctCity();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.country FROM Profile p WHERE p.country IS NOT NULL AND p.country != ''")
        List<String> findDistinctCountry();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.educationLevel FROM Profile p WHERE p.educationLevel IS NOT NULL AND p.educationLevel != ''")
        List<String> findDistinctEducationLevel();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.educationField FROM Profile p WHERE p.educationField IS NOT NULL AND p.educationField != ''")
        List<String> findDistinctEducationField();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.occupation FROM Profile p WHERE p.occupation IS NOT NULL AND p.occupation != ''")
        List<String> findDistinctOccupation();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.company FROM Profile p WHERE p.company IS NOT NULL AND p.company != ''")
        List<String> findDistinctCompany();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.motherTongue FROM Profile p WHERE p.motherTongue IS NOT NULL AND p.motherTongue != ''")
        List<String> findDistinctMotherTongue();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.maritalStatus FROM Profile p WHERE p.maritalStatus IS NOT NULL AND p.maritalStatus != ''")
        List<String> findDistinctMaritalStatus();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.workingWith FROM Profile p WHERE p.workingWith IS NOT NULL AND p.workingWith != ''")
        List<String> findDistinctWorkingWith();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.annualIncome FROM Profile p WHERE p.annualIncome IS NOT NULL AND p.annualIncome != ''")
        List<String> findDistinctAnnualIncome();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.diet FROM Profile p WHERE p.diet IS NOT NULL AND p.diet != ''")
        List<String> findDistinctDiet();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.bloodGroup FROM Profile p WHERE p.bloodGroup IS NOT NULL AND p.bloodGroup != ''")
        List<String> findDistinctBloodGroup();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.rashi FROM Profile p WHERE p.rashi IS NOT NULL AND p.rashi != ''")
        List<String> findDistinctRashi();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.gotra FROM Profile p WHERE p.gotra IS NOT NULL AND p.gotra != ''")
        List<String> findDistinctGotra();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.nakshatra FROM Profile p WHERE p.nakshatra IS NOT NULL AND p.nakshatra != ''")
        List<String> findDistinctNakshatra();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.manglikStatus FROM Profile p WHERE p.manglikStatus IS NOT NULL AND p.manglikStatus != ''")
        List<String> findDistinctManglikStatus();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.familyFinancialStatus FROM Profile p WHERE p.familyFinancialStatus IS NOT NULL AND p.familyFinancialStatus != ''")
        List<String> findDistinctFamilyFinancialStatus();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.fatherStatus FROM Profile p WHERE p.fatherStatus IS NOT NULL AND p.fatherStatus != ''")
        List<String> findDistinctFatherStatus();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.motherStatus FROM Profile p WHERE p.motherStatus IS NOT NULL AND p.motherStatus != ''")
        List<String> findDistinctMotherStatus();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.drinkingHabit FROM Profile p WHERE p.drinkingHabit IS NOT NULL AND p.drinkingHabit != ''")
        List<String> findDistinctDrinkingHabit();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.smokingHabit FROM Profile p WHERE p.smokingHabit IS NOT NULL AND p.smokingHabit != ''")
        List<String> findDistinctSmokingHabit();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.disability FROM Profile p WHERE p.disability IS NOT NULL AND p.disability != ''")
        List<String> findDistinctDisability();

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.verificationStatus FROM Profile p WHERE p.verificationStatus IS NOT NULL AND p.verificationStatus != ''")
        List<String> findDistinctVerificationStatus();
}
