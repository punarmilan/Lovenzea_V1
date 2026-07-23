package com.punarmilan.service;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.User;

import java.util.List;

public interface ShortlistService {
    void addToShortlist(User user, Long profileId);

    void removeFromShortlist(User user, Long profileId);

    List<ProfileDTO> getMyShortlist(User user);

    boolean isShortlisted(User user, Long profileId);
}
