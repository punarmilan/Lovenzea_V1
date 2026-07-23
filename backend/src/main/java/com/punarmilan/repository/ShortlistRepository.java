package com.punarmilan.repository;

import com.punarmilan.entity.Shortlist;
import com.punarmilan.entity.User;
import com.punarmilan.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShortlistRepository extends JpaRepository<Shortlist, Long> {

    List<Shortlist> findByUser(User user);

    Optional<Shortlist> findByUserAndShortlistedProfile(User user, Profile profile);

    boolean existsByUserAndShortlistedProfile(User user, Profile profile);

    void deleteByUserAndShortlistedProfile(User user, Profile profile);

    @org.springframework.data.jpa.repository.Query("SELECT s.shortlistedProfile.id, COUNT(s) FROM Shortlist s WHERE s.shortlistedProfile.id IN :profileIds GROUP BY s.shortlistedProfile.id")
    java.util.List<Object[]> countShortlistsByProfileIds(@org.springframework.data.repository.query.Param("profileIds") java.util.Collection<Long> profileIds);
}
