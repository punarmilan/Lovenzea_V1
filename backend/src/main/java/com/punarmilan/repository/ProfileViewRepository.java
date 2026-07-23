package com.punarmilan.repository;

import com.punarmilan.entity.ProfileView;
import com.punarmilan.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileViewRepository extends JpaRepository<ProfileView, Long> {

    Optional<ProfileView> findByViewerAndViewedProfileId(User viewer, Long viewedProfileId);

    // Returns one record per unique visitor (latest visit per viewer)
    @Query("SELECT pv FROM ProfileView pv WHERE pv.viewedProfile = :profile ORDER BY pv.updatedAt DESC")
    List<ProfileView> findRecentVisitors(@Param("profile") com.punarmilan.entity.Profile profile, Pageable pageable);

    // Returns one record per unique viewed profile (latest view per profile)
    @Query("SELECT pv FROM ProfileView pv WHERE pv.viewer = :viewer ORDER BY pv.updatedAt DESC")
    List<ProfileView> findRecentlyViewed(@Param("viewer") User viewer, Pageable pageable);

    @Query("SELECT pv.viewedProfile.id, COUNT(pv) FROM ProfileView pv WHERE pv.viewedProfile.id IN :profileIds GROUP BY pv.viewedProfile.id")
    java.util.List<Object[]> countViewsByProfileIds(@Param("profileIds") java.util.Collection<Long> profileIds);
}
