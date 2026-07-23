package com.punarmilan.service;

import com.punarmilan.dto.SubscriptionDetailsDTO;
import com.punarmilan.entity.UserSubscription;

public interface UserSubscriptionService {
	UserSubscription subscribe(Long planId);

	UserSubscription getCurrentSubscription();

	SubscriptionDetailsDTO getSubscriptionDetails();

	SubscriptionDetailsDTO trackContactView(Long profileId);

	java.util.List<com.punarmilan.entity.SubscriptionPlan> getAllPlans();

	boolean isPremiumUser(com.punarmilan.entity.User user);
}
