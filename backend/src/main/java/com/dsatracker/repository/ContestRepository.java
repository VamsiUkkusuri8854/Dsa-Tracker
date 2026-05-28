package com.dsatracker.repository;

import com.dsatracker.model.Contest;
import com.dsatracker.model.enums.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA repository for Contest Entities.
 */
@Repository
public interface ContestRepository extends JpaRepository<Contest, String> {

    List<Contest> findByUserIdOrderByContestDateDesc(String userId);

    List<Contest> findByUserIdAndUpcoming(String userId, boolean upcoming);

    List<Contest> findByUserIdAndPlatform(String userId, Platform platform);

    List<Contest> findByUserIdAndReminderSet(String userId, boolean reminderSet);

    long countByUserId(String userId);
}
