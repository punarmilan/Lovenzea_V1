package com.punarmilan.service.impl;

import com.punarmilan.config.MatchWeightConfig;
import com.punarmilan.entity.PartnerPreference;
import com.punarmilan.entity.Profile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Core scoring engine for the matchmaking system.
 *
 * Features:
 * - Weighted soft scoring (partial credit, never binary)
 * - Two-way matching (my pref vs target profile AND target pref vs my profile)
 * - Cold-start handling for users with missing/incomplete preferences
 * - Explainability via topReasons list
 * - All weights externalized via MatchWeightConfig
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MatchScoreCalculator {

    private final MatchWeightConfig config;

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Public API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Holds the result of a compatibility computation.
     */
    public static class MatchResult {
        private final double score;
        private final List<String> topReasons;

        public MatchResult(double score, List<String> topReasons) {
            this.score = Math.max(0, Math.min(100, score));
            this.topReasons = topReasons;
        }

        public double getScore() { return score; }
        public List<String> getTopReasons() { return topReasons; }
    }

    /**
     * Compute the two-way match score between two users.
     *
     * @return MatchResult with score (0â€“100) and human-readable reasons
     */
    public MatchResult computeTwoWayScore(Profile myProfile, PartnerPreference myPref,
                                           Profile targetProfile, PartnerPreference targetPref) {
        boolean myColdStart = isColdStartUser(myPref);
        boolean targetColdStart = isColdStartUser(targetPref);

        List<String> allReasons = new ArrayList<>();

        double myToTarget;
        if (targetColdStart) {
            myToTarget = scoreColdStart(myProfile, targetProfile, allReasons);
        } else {
            myToTarget = scoreOneWay(myProfile, targetPref, allReasons);
        }

        List<String> reverseReasons = new ArrayList<>();
        double targetToMe;
        if (myColdStart) {
            targetToMe = scoreColdStart(targetProfile, myProfile, reverseReasons);
        } else {
            targetToMe = scoreOneWay(targetProfile, myPref, reverseReasons);
        }

        // Merge unique reasons
        for (String r : reverseReasons) {
            if (!allReasons.contains(r)) {
                allReasons.add(r);
            }
        }

        double finalScore = (myToTarget + targetToMe) / 2.0;
        finalScore = Math.round(finalScore * 10.0) / 10.0;

        // Keep top 5 reasons
        if (allReasons.size() > 5) {
            allReasons = new ArrayList<>(allReasons.subList(0, 5));
        }

        return new MatchResult(finalScore, allReasons);
    }

    /**
     * One-way scoring: how well does candidateProfile match the given preference?
     */
    public double scoreOneWay(Profile candidateProfile, PartnerPreference pref, List<String> reasons) {
        if (pref == null) {
            return 50.0; // No preference â†’ neutral score
        }

        MatchWeightConfig.Weight w = config.getWeight();
        double totalScore = 0;

        // 1. AGE (weighted)
        double ageScore = scoreAge(candidateProfile.getAge(), pref.getMinAge(), pref.getMaxAge());
        totalScore += ageScore * w.getAge() / 100.0;
        if (ageScore >= 80) reasons.add("Age within preference");

        // 2. HEIGHT (weighted)
        double heightScore = scoreHeight(candidateProfile.getHeight(), pref.getMinHeight(), pref.getMaxHeight());
        totalScore += heightScore * w.getHeight() / 100.0;
        if (heightScore >= 80) reasons.add("Height matches");

        // 3. RELIGION + CASTE (weighted together)
        double religionScore = scoreReligionCaste(
                candidateProfile.getReligion(), candidateProfile.getCaste(),
                pref.getPreferredReligion(), pref.getPreferredCaste());
        totalScore += religionScore * w.getReligion() / 100.0;
        if (religionScore >= 80) reasons.add("Religion & community match");

        // 4. LOCATION (weighted)
        double locationScore = scoreLocation(
                candidateProfile.getCity(), candidateProfile.getState(), candidateProfile.getCountry(),
                pref.getPreferredCity(), pref.getPreferredState(), pref.getPreferredCountry());
        totalScore += locationScore * w.getLocation() / 100.0;
        if (locationScore >= 70) reasons.add(locationScore >= 100 ? "Same city" : "Same state");

        // 5. EDUCATION (weighted)
        double educationScore = scoreStringMatch(candidateProfile.getEducationLevel(), pref.getMinEducationLevel());
        totalScore += educationScore * w.getEducation() / 100.0;
        if (educationScore >= 80) reasons.add("Education matches");

        // 6. OCCUPATION (weighted)
        double occupationScore = scoreStringMatch(candidateProfile.getOccupation(), pref.getOccupation());
        totalScore += occupationScore * w.getOccupation() / 100.0;
        if (occupationScore >= 80) reasons.add("Occupation matches");

        // 7. INCOME (weighted)
        double incomeScore = scoreIncome(candidateProfile.getAnnualIncome(), pref.getMinAnnualIncome());
        totalScore += incomeScore * w.getIncome() / 100.0;
        if (incomeScore >= 80) reasons.add("Income meets preference");

        // 8. LIFESTYLE (weighted)
        double lifestyleScore = scoreLifestyle(
                candidateProfile.getDiet(), candidateProfile.getSmokingHabit(), candidateProfile.getDrinkingHabit(),
                pref.getPreferredDiet(), pref.getSmokingHabit(), pref.getDrinkingHabit());
        totalScore += lifestyleScore * w.getLifestyle() / 100.0;
        if (lifestyleScore >= 80) reasons.add("Similar lifestyle");

        return totalScore;
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Cold Start â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Checks if user has no/incomplete partner preferences (â‰¤2 meaningful fields filled).
     */
    public boolean isColdStartUser(PartnerPreference pref) {
        if (pref == null) return true;

        int filledCount = 0;
        if (pref.getMinAge() != null || pref.getMaxAge() != null) filledCount++;
        if (isNotEmpty(pref.getPreferredReligion())) filledCount++;
        if (isNotEmpty(pref.getPreferredCaste())) filledCount++;
        if (isNotEmpty(pref.getMinEducationLevel())) filledCount++;
        if (isNotEmpty(pref.getOccupation())) filledCount++;
        if (isNotEmpty(pref.getMinAnnualIncome())) filledCount++;
        if (isNotEmpty(pref.getPreferredCity()) || isNotEmpty(pref.getPreferredState())) filledCount++;
        if (isNotEmpty(pref.getMinHeight()) || isNotEmpty(pref.getMaxHeight())) filledCount++;

        return filledCount <= 2;
    }

    /**
     * Simplified scoring for cold-start users. Only uses Age + Location + basic profile quality.
     * Ignores strict cultural/economic filters.
     */
    private double scoreColdStart(Profile candidateProfile, Profile referenceProfile, List<String> reasons) {
        double score = 0;

        // Age proximity (30% weight) â€” score based on how close ages are
        if (candidateProfile.getAge() != null && referenceProfile.getAge() != null) {
            int ageDiff = Math.abs(candidateProfile.getAge() - referenceProfile.getAge());
            if (ageDiff <= 3) {
                score += 30;
                reasons.add("Similar age");
            } else if (ageDiff <= 7) {
                score += 20;
                reasons.add("Close in age");
            } else if (ageDiff <= 12) {
                score += 10;
            }
        } else {
            score += 15; // neutral if unknown
        }

        // Location proximity (40% weight)
        String myCity = normalize(referenceProfile.getCity());
        String myState = normalize(referenceProfile.getState());
        String targetCity = normalize(candidateProfile.getCity());
        String targetState = normalize(candidateProfile.getState());

        if (!myCity.isEmpty() && myCity.equalsIgnoreCase(targetCity)) {
            score += 40;
            reasons.add("Same city");
        } else if (!myState.isEmpty() && myState.equalsIgnoreCase(targetState)) {
            score += 25;
            reasons.add("Same state");
        } else {
            score += 10;
        }

        // Profile completeness (30% weight) â€” reward profiles with photos & details
        double completeness = 0;
        if (candidateProfile.getProfilePhotoUrl() != null) completeness += 10;
        if (candidateProfile.getAboutMe() != null && !candidateProfile.getAboutMe().isEmpty()) completeness += 5;
        if (candidateProfile.getEducationLevel() != null) completeness += 5;
        if (candidateProfile.getOccupation() != null) completeness += 5;
        if (candidateProfile.getAge() != null) completeness += 5;
        score += completeness;
        if (completeness >= 20) reasons.add("Complete profile");

        return score;
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Per-Field Soft Scoring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private double scoreAge(Integer candidateAge, Integer minAge, Integer maxAge) {
        if (candidateAge == null) return 50; // unknown â†’ neutral
        if (minAge == null && maxAge == null) return 100; // no pref â†’ full score

        int effectiveMin = minAge != null ? minAge : 18;
        int effectiveMax = maxAge != null ? maxAge : 70;

        if (candidateAge >= effectiveMin && candidateAge <= effectiveMax) {
            return 100; // within range
        }

        // Soft scoring: partial credit for being close
        int distanceFromRange;
        if (candidateAge < effectiveMin) {
            distanceFromRange = effectiveMin - candidateAge;
        } else {
            distanceFromRange = candidateAge - effectiveMax;
        }

        if (distanceFromRange <= 2) return 50; // within 2 years â†’ 50%
        if (distanceFromRange <= 5) return 20; // within 5 years â†’ 20%
        return 0;
    }

    private double scoreHeight(String candidateHeight, String minHeight, String maxHeight) {
        String effectiveMin = sanitize(minHeight);
        String effectiveMax = sanitize(maxHeight);

        if (effectiveMin == null && effectiveMax == null) return 100; // no pref

        int candidateInches = parseHeightToInches(candidateHeight);
        if (candidateInches <= 0) return 50; // unknown â†’ neutral

        int minInches = parseHeightToInches(effectiveMin);
        int maxInches = parseHeightToInches(effectiveMax);

        boolean inRange = true;
        int distance = 0;

        if (minInches > 0 && candidateInches < minInches) {
            inRange = false;
            distance = minInches - candidateInches;
        }
        if (maxInches > 0 && candidateInches > maxInches) {
            inRange = false;
            distance = Math.max(distance, candidateInches - maxInches);
        }

        if (inRange) return 100;
        if (distance <= 2) return 50; // within 2 inches â†’ 50%
        return 0;
    }

    private double scoreReligionCaste(String candidateReligion, String candidateCaste,
                                       String prefReligion, String prefCaste) {
        boolean relMatch = matchesPreference(candidateReligion, prefReligion);
        boolean casteMatch = matchesPreference(candidateCaste, prefCaste);

        if (relMatch && casteMatch) return 100;
        if (relMatch && !casteMatch) return 50; // Same religion, different caste â†’ partial
        return 0;
    }

    private double scoreLocation(String candidateCity, String candidateState, String candidateCountry,
                                  String prefCity, String prefState, String prefCountry) {
        String normCandCity = normalize(candidateCity);
        String normCandState = normalize(candidateState);
        String normCandCountry = normalize(candidateCountry);
        String normPrefCity = normalize(prefCity);
        String normPrefState = normalize(prefState);
        String normPrefCountry = normalize(prefCountry);

        // No preference â†’ full score
        if (normPrefCity.isEmpty() && normPrefState.isEmpty() && normPrefCountry.isEmpty()) {
            return 100;
        }

        // City match (best)
        if (!normPrefCity.isEmpty() && normPrefCity.equalsIgnoreCase(normCandCity)) {
            return 100;
        }

        // State match
        if (!normPrefState.isEmpty() && normPrefState.equalsIgnoreCase(normCandState)) {
            return 70;
        }

        // Country match
        if (!normPrefCountry.isEmpty() && normPrefCountry.equalsIgnoreCase(normCandCountry)) {
            return 30;
        }

        return 0;
    }

    private double scoreStringMatch(String candidateValue, String prefValue) {
        String effective = sanitize(prefValue);
        if (effective == null || "Any".equalsIgnoreCase(effective) || "Open to All".equalsIgnoreCase(effective)) {
            return 100; // no pref â†’ full score
        }

        String candidateNorm = normalize(candidateValue);
        if (candidateNorm.isEmpty()) return 30; // unknown â†’ low score

        // Multi-value support (comma-separated)
        String[] prefs = effective.split(",");
        for (String p : prefs) {
            if (candidateNorm.equalsIgnoreCase(p.trim())) {
                return 100; // exact match
            }
        }

        // Partial match: check substring containment for similar categories
        for (String p : prefs) {
            if (candidateNorm.contains(p.trim().toLowerCase()) || p.trim().toLowerCase().contains(candidateNorm.toLowerCase())) {
                return 50; // partial/similar match
            }
        }

        return 0;
    }

    private double scoreIncome(String candidateIncome, String minIncome) {
        String effective = sanitize(minIncome);
        if (effective == null || "Any".equalsIgnoreCase(effective)) return 100;

        String candidateNorm = normalize(candidateIncome);
        if (candidateNorm.isEmpty()) return 30;

        // Try numeric comparison
        double candidateVal = parseIncomeToNumber(candidateIncome);
        double minVal = parseIncomeToNumber(minIncome);

        if (candidateVal > 0 && minVal > 0) {
            if (candidateVal >= minVal) return 100;
            double ratio = candidateVal / minVal;
            if (ratio >= 0.8) return 50; // within 20% of minimum â†’ partial credit
            return 0;
        }

        // Fallback: string containment
        if (candidateNorm.contains(effective.toLowerCase()) ||
            effective.toLowerCase().contains(candidateNorm)) {
            return 70;
        }

        return 0;
    }

    private double scoreLifestyle(String candidateDiet, String candidateSmoking, String candidateDrinking,
                                   String prefDiet, String prefSmoking, String prefDrinking) {
        int total = 0;
        int count = 0;

        if (sanitize(prefDiet) != null) {
            count++;
            total += matchesPreference(candidateDiet, prefDiet) ? 100 : 0;
        }
        if (sanitize(prefSmoking) != null) {
            count++;
            total += matchesPreference(candidateSmoking, prefSmoking) ? 100 : 0;
        }
        if (sanitize(prefDrinking) != null) {
            count++;
            total += matchesPreference(candidateDrinking, prefDrinking) ? 100 : 0;
        }

        if (count == 0) return 100; // no lifestyle prefs
        return (double) total / count;
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ Helper Methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private boolean matchesPreference(String actual, String pref) {
        String p = sanitize(pref);
        if (p == null || "Any".equalsIgnoreCase(p) || "Open to All".equalsIgnoreCase(p)) return true;

        String a = normalize(actual);
        if (a.isEmpty()) return false;

        String[] values = p.split(",");
        for (String v : values) {
            if (a.equalsIgnoreCase(v.trim())) return true;
        }
        return false;
    }

    private String normalize(String s) {
        if (s == null || "null".equalsIgnoreCase(s)) return "";
        return s.trim();
    }

    private String sanitize(String s) {
        if (s == null || s.isEmpty() || "null".equalsIgnoreCase(s)) return null;
        return s.trim();
    }

    private boolean isNotEmpty(String s) {
        return s != null && !s.isEmpty() && !"null".equalsIgnoreCase(s) &&
               !"Any".equalsIgnoreCase(s) && !"Open to All".equalsIgnoreCase(s);
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
            log.trace("Failed to parse height: {}", heightStr);
        }
        return 0;
    }

    private double parseIncomeToNumber(String income) {
        if (income == null || income.isEmpty()) return 0;
        try {
            String cleaned = income.replaceAll("[^0-9.]", "");
            if (cleaned.isEmpty()) return 0;
            double val = Double.parseDouble(cleaned);
            String lower = income.toLowerCase();
            if (lower.contains("lakh") || lower.contains("lac")) val *= 100000;
            else if (lower.contains("crore") || lower.contains("cr")) val *= 10000000;
            else if (lower.contains("k")) val *= 1000;
            return val;
        } catch (Exception e) {
            return 0;
        }
    }
}
