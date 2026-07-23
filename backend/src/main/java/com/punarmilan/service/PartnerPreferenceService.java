package com.punarmilan.service;

import com.punarmilan.dto.PartnerPreferenceDTO;
import com.punarmilan.entity.User;

import java.util.Map;

public interface PartnerPreferenceService {
    PartnerPreferenceDTO getMyPreferences(User user);

    PartnerPreferenceDTO updatePreferences(User user, Map<String, Object> updates);
}
