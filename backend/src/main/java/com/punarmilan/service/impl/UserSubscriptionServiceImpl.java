package com.punarmilan.service.impl;

import com.punarmilan.dto.SubscriptionDetailsDTO;
import com.punarmilan.exception.UnauthorizedException;
import com.punarmilan.exception.BadRequestException;
import com.punarmilan.entity.ContactView;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.SubscriptionPlan;
import com.punarmilan.entity.User;
import com.punarmilan.entity.UserSubscription;
import com.punarmilan.repository.ContactViewRepository;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.repository.SubscriptionPlanRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.repository.UserSubscriptionRepository;
import com.punarmilan.service.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSubscriptionServiceImpl implements UserSubscriptionService {

    private final UserSubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ContactViewRepository contactViewRepository;

    @Override
    @Transactional
    public UserSubscription subscribe(Long planId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Plan not found"));

        // Deactivate old subscription
        subscriptionRepository.findByUserIdAndActiveTrue(user.getId())
                .ifPresent(sub -> {
                    sub.setActive(false);
                    subscriptionRepository.save(sub);
                });

        UserSubscription sub = UserSubscription.builder()
                .user(user)
                .plan(plan)
                .startDate(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusDays(plan.getDurationInDays()))
                .active(true)
                .build();

        // Update User entity as well
        user.setIsPremium(true);
        user.setPremiumExpiry(sub.getExpiryDate());
        userRepository.save(user);

        // Update Profile entity as well
        profileRepository.findByUser(user).ifPresent(p -> {
            p.setIsPremium(true);
            profileRepository.save(p);
        });

        return subscriptionRepository.save(sub);
    }

    @Override
    public UserSubscription getCurrentSubscription() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));
        return subscriptionRepository.findByUserIdAndActiveTrue(user.getId()).orElse(null);
    }

    @Override
    @Transactional
    public SubscriptionDetailsDTO getSubscriptionDetails() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        UserSubscription sub = subscriptionRepository.findByUserIdAndActiveTrue(user.getId())
                .orElse(null);

        if (sub == null) {
            // No active subscription record found
            if (Boolean.TRUE.equals(user.getIsPremium())) {
                user.setIsPremium(false);
                userRepository.save(user);
                profileRepository.findByUser(user).ifPresent(p -> {
                    p.setIsPremium(false);
                    profileRepository.save(p);
                });
            }
            return SubscriptionDetailsDTO.builder()
                    .active(false)
                    .build();
        }

        // Logic check: If user has an active record but it's expired, they are FREE
        boolean isNowPremium = (sub.getExpiryDate() == null || sub.getExpiryDate().isAfter(LocalDateTime.now()));

        // Handle expired record case
        if (!isNowPremium) {
            if (Boolean.TRUE.equals(user.getIsPremium())) {
                user.setIsPremium(false);
                userRepository.save(user);
                profileRepository.findByUser(user).ifPresent(p -> {
                    p.setIsPremium(false);
                    profileRepository.save(p);
                });
            }
            return SubscriptionDetailsDTO.builder()
                    .active(false)
                    .build();
        }

        // Now we know sub is non-null AND isNowPremium is true
        // Data Healing: If flags are out of sync, update them
        if (!Boolean.TRUE.equals(user.getIsPremium())) {
            user.setIsPremium(true);
            user.setPremiumExpiry(sub.getExpiryDate());
            userRepository.save(user);

            profileRepository.findByUser(user).ifPresent(p -> {
                p.setIsPremium(true);
                profileRepository.save(p);
            });
        }

        long used = contactViewRepository.countByViewerId(user.getId());
        int totalAllowed = sub.getPlan().getConnects() != null ? sub.getPlan().getConnects() : 0;
        int balance = Math.max(0, totalAllowed - (int) used);

        return SubscriptionDetailsDTO.builder()
                .active(true)
                .planName(sub.getPlan().getName())
                .expiryDate(sub.getExpiryDate())
                .totalConnects(totalAllowed)
                .usedConnects((int) used)
                .balance(balance)
                .build();
    }

    @Override
    @Transactional
    public SubscriptionDetailsDTO trackContactView(Long profileId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        // 1. Check if Premium Active
        if (!Boolean.TRUE.equals(user.getIsPremium()) ||
                (user.getPremiumExpiry() != null && user.getPremiumExpiry().isBefore(LocalDateTime.now()))) {
            throw new UnauthorizedException("Your premium subscription is not active.");
        }

        Profile targetProfile = profileRepository.findById(profileId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Profile not found"));

        // Don't count self-views
        if (targetProfile.getUser() != null && targetProfile.getUser().getId().equals(user.getId())) {
            return getSubscriptionDetails();
        }

        // 2. Check if already viewed (Duplicate Prevention)
        boolean alreadyViewed = contactViewRepository.existsByViewerAndViewedProfile(user, targetProfile);
        if (alreadyViewed) {
            return getSubscriptionDetails();
        }

        // 3. Check Balance (Optimized)
        UserSubscription sub = subscriptionRepository.findByUserIdAndActiveTrue(user.getId()).orElse(null);
        if (sub == null) {
            throw new UnauthorizedException("No active subscription found.");
        }
        long used = contactViewRepository.countByViewerId(user.getId());
        int totalAllowed = sub.getPlan().getConnects() != null ? sub.getPlan().getConnects() : 0;
        if (used >= totalAllowed) {
            throw new BadRequestException("You have exhausted your contact views balance. Please upgrade your plan.");
        }

        // 4. Record View
        ContactView view = ContactView.builder()
                .viewer(user)
                .viewedProfile(targetProfile)
                .build();
        contactViewRepository.save(view);

        // 5. Return updated balance immediately
        return getSubscriptionDetails();
    }

    @Override
    @org.springframework.cache.annotation.Cacheable(value = "subscription_plans")
    public List<SubscriptionPlan> getAllPlans() {
        List<SubscriptionPlan> plans = planRepository.findAll();

        System.out.println("Plans count = " + plans.size());

        return plans;
    }
    @Override
    public boolean isPremiumUser(User user) {
        if (user == null)
            return false;

        return Boolean.TRUE.equals(user.getIsPremium()) &&
                (user.getPremiumExpiry() == null || user.getPremiumExpiry().isAfter(LocalDateTime.now()));
    }
}
