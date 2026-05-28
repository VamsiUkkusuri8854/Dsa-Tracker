package com.dsatracker.service;

import com.dsatracker.exception.ResourceNotFoundException;
import com.dsatracker.model.Roadmap;
import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.repository.ProblemRepository;
import com.dsatracker.repository.RoadmapRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Roadmap service — manages DSA learning roadmaps with pre-seeded data.
 */
@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final ProblemRepository problemRepository;

    /**
     * Get all roadmaps ordered by sequence.
     */
    public List<Roadmap> getAllRoadmaps() {
        return roadmapRepository.findAllByOrderByOrderAsc();
    }

    /**
     * Get roadmap by topic.
     */
    public Roadmap getRoadmapByTopic(String topic) {
        return roadmapRepository.findByTopic(topic)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found for topic: " + topic));
    }

    /**
     * Get roadmap by ID.
     */
    public Roadmap getRoadmapById(String id) {
        return roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found with id: " + id));
    }

    /**
     * Calculate user's completion percentage for a roadmap topic.
     */
    public double getCompletionPercentage(String userId, String topic) {
        Roadmap roadmap = getRoadmapByTopic(topic);
        long solvedCount = problemRepository.countByUserIdAndTopic(userId, topic);
        if (roadmap.getTotalProblems() == 0) return 0;
        return Math.min(100.0, (solvedCount * 100.0) / roadmap.getTotalProblems());
    }

    /**
     * Get roadmaps with user progress.
     */
    public List<Map<String, Object>> getRoadmapsWithProgress(String userId) {
        List<Roadmap> roadmaps = getAllRoadmaps();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Roadmap roadmap : roadmaps) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("roadmap", roadmap);
            long solved = problemRepository.countByUserIdAndTopic(userId, roadmap.getTopic());
            entry.put("solved", solved);
            entry.put("percentage", roadmap.getTotalProblems() > 0
                    ? Math.min(100.0, (solved * 100.0) / roadmap.getTotalProblems()) : 0);
            result.add(entry);
        }
        return result;
    }

    /**
     * Admin: Create a roadmap.
     */
    public Roadmap createRoadmap(Roadmap roadmap) {
        return roadmapRepository.save(roadmap);
    }

    /**
     * Admin: Update a roadmap.
     */
    public Roadmap updateRoadmap(String id, Roadmap updated) {
        Roadmap existing = getRoadmapById(id);
        existing.setTopic(updated.getTopic());
        existing.setDescription(updated.getDescription());
        existing.setTotalProblems(updated.getTotalProblems());
        existing.setProblems(updated.getProblems());
        existing.setOrder(updated.getOrder());
        return roadmapRepository.save(existing);
    }

    /**
     * Admin: Delete a roadmap.
     */
    public void deleteRoadmap(String id) {
        roadmapRepository.deleteById(id);
    }

    /**
     * Seed default roadmap data if the collection is empty.
     */
    @PostConstruct
    public void seedRoadmaps() {
        if (roadmapRepository.count() > 0) return;

        List<Roadmap> defaults = List.of(
            Roadmap.builder().topic("Arrays").description("Master array manipulation, sliding window, two pointers, and prefix sums")
                .totalProblems(30).order(1).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Two Sum").link("https://leetcode.com/problems/two-sum/").difficulty(Difficulty.EASY).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Best Time to Buy and Sell Stock").link("https://leetcode.com/problems/best-time-to-buy-and-sell-stock/").difficulty(Difficulty.EASY).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Container With Most Water").link("https://leetcode.com/problems/container-with-most-water/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("3Sum").link("https://leetcode.com/problems/3sum/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Trapping Rain Water").link("https://leetcode.com/problems/trapping-rain-water/").difficulty(Difficulty.HARD).platform("LeetCode").build()
                )).build(),
            Roadmap.builder().topic("Strings").description("String manipulation, pattern matching, and palindromes")
                .totalProblems(25).order(2).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Valid Anagram").link("https://leetcode.com/problems/valid-anagram/").difficulty(Difficulty.EASY).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Longest Substring Without Repeating").link("https://leetcode.com/problems/longest-substring-without-repeating-characters/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Longest Palindromic Substring").link("https://leetcode.com/problems/longest-palindromic-substring/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build()
                )).build(),
            Roadmap.builder().topic("Linked Lists").description("Singly, doubly linked lists, fast/slow pointers, and reversal")
                .totalProblems(20).order(3).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Reverse Linked List").link("https://leetcode.com/problems/reverse-linked-list/").difficulty(Difficulty.EASY).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Merge Two Sorted Lists").link("https://leetcode.com/problems/merge-two-sorted-lists/").difficulty(Difficulty.EASY).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Linked List Cycle").link("https://leetcode.com/problems/linked-list-cycle/").difficulty(Difficulty.EASY).platform("LeetCode").build()
                )).build(),
            Roadmap.builder().topic("Trees").description("Binary trees, BST, traversals, and tree construction")
                .totalProblems(25).order(4).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Maximum Depth of Binary Tree").link("https://leetcode.com/problems/maximum-depth-of-binary-tree/").difficulty(Difficulty.EASY).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Validate BST").link("https://leetcode.com/problems/validate-binary-search-tree/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Binary Tree Level Order Traversal").link("https://leetcode.com/problems/binary-tree-level-order-traversal/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build()
                )).build(),
            Roadmap.builder().topic("Graphs").description("BFS, DFS, topological sort, shortest paths, and union-find")
                .totalProblems(25).order(5).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Number of Islands").link("https://leetcode.com/problems/number-of-islands/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Clone Graph").link("https://leetcode.com/problems/clone-graph/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Course Schedule").link("https://leetcode.com/problems/course-schedule/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build()
                )).build(),
            Roadmap.builder().topic("Dynamic Programming").description("Memoization, tabulation, classic DP patterns")
                .totalProblems(30).order(6).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Climbing Stairs").link("https://leetcode.com/problems/climbing-stairs/").difficulty(Difficulty.EASY).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Coin Change").link("https://leetcode.com/problems/coin-change/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Longest Increasing Subsequence").link("https://leetcode.com/problems/longest-increasing-subsequence/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build()
                )).build(),
            Roadmap.builder().topic("Recursion").description("Recursive thinking, divide and conquer, and backtracking basics")
                .totalProblems(15).order(7).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Pow(x, n)").link("https://leetcode.com/problems/powx-n/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Subsets").link("https://leetcode.com/problems/subsets/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build()
                )).build(),
            Roadmap.builder().topic("Greedy").description("Greedy algorithms and interval scheduling")
                .totalProblems(15).order(8).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("Jump Game").link("https://leetcode.com/problems/jump-game/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Activity Selection").link("https://practice.geeksforgeeks.org/problems/activity-selection/").difficulty(Difficulty.EASY).platform("GFG").build()
                )).build(),
            Roadmap.builder().topic("Backtracking").description("N-Queens, permutations, combinations, and constraint satisfaction")
                .totalProblems(15).order(9).problems(List.of(
                    Roadmap.RoadmapProblem.builder().name("N-Queens").link("https://leetcode.com/problems/n-queens/").difficulty(Difficulty.HARD).platform("LeetCode").build(),
                    Roadmap.RoadmapProblem.builder().name("Combination Sum").link("https://leetcode.com/problems/combination-sum/").difficulty(Difficulty.MEDIUM).platform("LeetCode").build()
                )).build()
        );

        roadmapRepository.saveAll(defaults);
    }
}
