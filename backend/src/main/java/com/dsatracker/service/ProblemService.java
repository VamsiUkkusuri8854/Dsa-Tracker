package com.dsatracker.service;

import com.dsatracker.dto.request.ProblemRequest;
import com.dsatracker.exception.ResourceNotFoundException;
import com.dsatracker.model.Problem;
import com.dsatracker.model.User;
import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.model.enums.Platform;
import com.dsatracker.model.enums.ProblemStatus;
import com.dsatracker.repository.ProblemRepository;
import com.dsatracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Problem service — CRUD operations and business logic for DSA problems.
 */
@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    /**
     * Create a new problem entry and update user streak.
     */
    public Problem createProblem(String userId, ProblemRequest request) {
        Problem problem = Problem.builder()
                .userId(userId)
                .problemName(request.getProblemName())
                .platform(request.getPlatform())
                .difficulty(request.getDifficulty())
                .topic(request.getTopic())
                .tags(request.getTags())
                .dateSolved(request.getDateSolved() != null ? request.getDateSolved() : LocalDate.now())
                .timeTaken(request.getTimeTaken())
                .notes(request.getNotes())
                .problemLink(request.getProblemLink())
                .revisionNeeded(request.isRevisionNeeded())
                .status(request.getStatus() != null ? request.getStatus() : ProblemStatus.SOLVED)
                .build();

        Problem saved = problemRepository.save(problem);

        // Update user streak
        updateStreak(userId);

        return saved;
    }

    /**
     * Get all problems for a user with pagination.
     */
    public Page<Problem> getUserProblems(String userId, Pageable pageable) {
        return problemRepository.findByUserId(userId, pageable);
    }

    /**
     * Get all problems for a user (no pagination).
     */
    public List<Problem> getAllUserProblems(String userId) {
        return problemRepository.findByUserIdOrderByDateSolvedDesc(userId);
    }

    /**
     * Get a single problem by ID.
     */
    public Problem getProblemById(String id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));
    }

    /**
     * Update an existing problem.
     */
    public Problem updateProblem(String id, ProblemRequest request) {
        Problem problem = getProblemById(id);
        problem.setProblemName(request.getProblemName());
        problem.setPlatform(request.getPlatform());
        problem.setDifficulty(request.getDifficulty());
        problem.setTopic(request.getTopic());
        problem.setTags(request.getTags());
        problem.setDateSolved(request.getDateSolved());
        problem.setTimeTaken(request.getTimeTaken());
        problem.setNotes(request.getNotes());
        problem.setProblemLink(request.getProblemLink());
        problem.setRevisionNeeded(request.isRevisionNeeded());
        problem.setStatus(request.getStatus());
        return problemRepository.save(problem);
    }

    /**
     * Delete a problem.
     */
    public void deleteProblem(String id) {
        if (!problemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Problem not found with id: " + id);
        }
        problemRepository.deleteById(id);
    }

    /**
     * Search problems by name keyword.
     */
    public List<Problem> searchProblems(String userId, String keyword) {
        return problemRepository.searchByName(userId, keyword);
    }

    /**
     * Filter problems by various criteria.
     */
    public List<Problem> filterProblems(String userId, String topic, Difficulty difficulty,
                                         Platform platform, ProblemStatus status) {
        if (topic != null) return problemRepository.findByUserIdAndTopic(userId, topic);
        if (difficulty != null) return problemRepository.findByUserIdAndDifficulty(userId, difficulty);
        if (platform != null) return problemRepository.findByUserIdAndPlatform(userId, platform);
        if (status != null) return problemRepository.findByUserIdAndStatus(userId, status);
        return problemRepository.findByUserId(userId);
    }

    /**
     * Get problems marked for revision.
     */
    public List<Problem> getRevisionProblems(String userId) {
        return problemRepository.findByUserIdAndRevisionNeeded(userId, true);
    }

    /**
     * Update user's streak based on their solve activity.
     */
    private void updateStreak(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null || lastActive.isBefore(today.minusDays(1))) {
            // Streak broken or first solve
            user.setStreakCount(1);
        } else if (lastActive.equals(today.minusDays(1))) {
            // Consecutive day
            user.setStreakCount(user.getStreakCount() + 1);
        }
        // Same day — don't increment

        user.setLastActiveDate(today);
        if (user.getStreakCount() > user.getLongestStreak()) {
            user.setLongestStreak(user.getStreakCount());
        }

        userRepository.save(user);
    }
}
