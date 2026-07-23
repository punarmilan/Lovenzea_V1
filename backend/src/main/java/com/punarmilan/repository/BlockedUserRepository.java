package com.punarmilan.repository;

import com.punarmilan.entity.BlockedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {

    @Query("SELECT b.blockedUser.id FROM BlockedUser b WHERE b.blocker.id = :blockerId")
    List<Long> findBlockedUserIdsByBlockerId(@Param("blockerId") Long blockerId);

    @Query("SELECT b.blocker.id FROM BlockedUser b WHERE b.blockedUser.id = :blockedUserId")
    List<Long> findBlockerIdsByBlockedUserId(@Param("blockedUserId") Long blockedUserId);
}
