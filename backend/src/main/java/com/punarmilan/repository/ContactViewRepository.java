package com.punarmilan.repository;

import com.punarmilan.entity.ContactView;

import com.punarmilan.entity.User;
import com.punarmilan.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactViewRepository extends JpaRepository<ContactView, Long> {
    boolean existsByViewerAndViewedProfile(User viewer, Profile viewedProfile);
    long countByViewerId(Long viewerId);

    @org.springframework.data.jpa.repository.Query("SELECT cv.viewedProfile.id FROM ContactView cv WHERE cv.viewer.id = :viewerId AND cv.viewedProfile.id IN :profileIds")
    java.util.List<Long> findViewedProfileIdsByViewerAndProfileIds(@org.springframework.data.repository.query.Param("viewerId") Long viewerId, @org.springframework.data.repository.query.Param("profileIds") java.util.List<Long> profileIds);
}
