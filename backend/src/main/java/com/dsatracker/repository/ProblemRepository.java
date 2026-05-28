package com.dsatracker.repository;

import com.dsatracker.model.Problem;
import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.model.enums.Platform;
import com.dsatracker.model.enums.ProblemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * JPA repository for Problem Entities with relational search queries.
 */
@Repository
public interface ProblemRepository extends JpaRepository<Problem, String> {

    List<Problem> findByUserId(String userId);

    Page<Problem> findByUserId(String userId, Pageable pageable);

    List<Problem> findByUserIdAndTopic(String userId, String topic);

    List<Problem> findByUserIdAndDifficulty(String userId, Difficulty difficulty);

    List<Problem> findByUserIdAndPlatform(String userId, Platform platform);

    List<Problem> findByUserIdAndStatus(String userId, ProblemStatus status);

    List<Problem> findByUserIdAndRevisionNeeded(String userId, boolean revisionNeeded);

    List<Problem> findByUserIdAndDateSolvedBetween(String userId, LocalDate start, LocalDate end);

    @Query("SELECT COUNT(p) FROM Problem p WHERE p.userId = ?1 AND p.status <> com.dsatracker.model.enums.ProblemStatus.UNSOLVED")
    long countByUserId(String userId);

    @Query("SELECT COUNT(p) FROM Problem p WHERE p.userId = ?1 AND p.difficulty = ?2 AND p.status <> com.dsatracker.model.enums.ProblemStatus.UNSOLVED")
    long countByUserIdAndDifficulty(String userId, Difficulty difficulty);

    @Query("SELECT COUNT(p) FROM Problem p WHERE p.userId = ?1 AND p.topic = ?2 AND p.status <> com.dsatracker.model.enums.ProblemStatus.UNSOLVED")
    long countByUserIdAndTopic(String userId, String topic);

    @Query("SELECT COUNT(p) FROM Problem p WHERE p.userId = ?1 AND p.platform = ?2 AND p.status <> com.dsatracker.model.enums.ProblemStatus.UNSOLVED")
    long countByUserIdAndPlatform(String userId, Platform platform);

    @Query("SELECT p FROM Problem p WHERE p.userId = ?1 AND LOWER(p.problemName) LIKE LOWER(CONCAT('%', ?2, '%'))")
    List<Problem> searchByName(String userId, String keyword);

    List<Problem> findByUserIdOrderByDateSolvedDesc(String userId);
}
