package com.punarmilan.service.impl;

import com.punarmilan.dto.AdminUserDetailDTO;
import com.punarmilan.dto.AdminUserSearchCriteria;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import com.punarmilan.entity.UserSubscription;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.repository.UserSubscriptionRepository;
import com.punarmilan.service.AdminLogService;
import com.punarmilan.service.AdminUserService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final AdminLogService adminLogService;
    private final UserSubscriptionRepository subscriptionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<User> getAllUsers(AdminUserSearchCriteria criteria, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getEmail() != null && !criteria.getEmail().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + criteria.getEmail().toLowerCase() + "%"));
            }
            if (criteria.getMobileNumber() != null && !criteria.getMobileNumber().isEmpty()) {
                predicates.add(cb.like(root.get("mobileNumber"), "%" + criteria.getMobileNumber() + "%"));
            }
            if (criteria.getEnabled() != null) {
                predicates.add(cb.equal(root.get("enabled"), criteria.getEnabled()));
            }

            // Profile filters
            if (criteria.getGender() != null || criteria.getCity() != null || criteria.getReligion() != null) {
                Join<User, Profile> profileJoin = root.join("profile", JoinType.LEFT);
                if (criteria.getGender() != null && !criteria.getGender().isEmpty()) {
                    predicates.add(cb.equal(cb.upper(profileJoin.get("gender")), criteria.getGender().toUpperCase()));
                }
                if (criteria.getCity() != null && !criteria.getCity().isEmpty()) {
                    predicates.add(
                            cb.like(cb.lower(profileJoin.get("city")), "%" + criteria.getCity().toLowerCase() + "%"));
                }
                if (criteria.getReligion() != null && !criteria.getReligion().isEmpty()) {
                    predicates
                            .add(cb.equal(cb.upper(profileJoin.get("religion")), criteria.getReligion().toUpperCase()));
                }
            }

            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserDetailDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        UserSubscription subscription = subscriptionRepository.findByUserIdAndActiveTrue(userId).orElse(null);

        return AdminUserDetailDTO.builder()
                .user(user)
                .activeSubscription(subscription)
                .build();
    }

    @Override
    @Transactional
    public void blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
        adminLogService.logAction("BLOCK_USER", "Blocked user ID: " + userId + ", Email: " + user.getEmail());
    }

    @Override
    @Transactional
    public void unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
        adminLogService.logAction("UNBLOCK_USER", "Unblocked user ID: " + userId + ", Email: " + user.getEmail());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));
        userRepository.deleteById(userId);
        adminLogService.logAction("DELETE_USER", "Deleted user ID: " + userId + ", Email: " + user.getEmail());
    }
}
