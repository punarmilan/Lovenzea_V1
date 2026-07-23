package com.punarmilan.repository;

import com.punarmilan.entity.DailyMatch;
import com.punarmilan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Repository
public interface DailyMatchRepository extends JpaRepository<DailyMatch, Long> {

    List<DailyMatch> findAllByUserAndMatchDate(User user, LocalDate matchDate);

    @org.springframework.data.jpa.repository.Query("SELECT dm.profile.id FROM DailyMatch dm WHERE dm.user = :user")
    Set<Long> findAllMatchProfileIdsByUser(@Param("user") User user);

    void deleteByMatchDateBefore(LocalDate date);

    @org.springframework.data.jpa.repository.Query("SELECT dm.profile.id FROM DailyMatch dm WHERE dm.user = :user AND dm.matchDate >= :since")
    Set<Long> findRecentlyShownProfileIds(@Param("user") User user, @Param("since") LocalDate since);
}
