package com.dsatracker.service;

import com.dsatracker.dto.response.DashboardResponse;
import com.dsatracker.model.Problem;
import com.dsatracker.model.User;
import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.repository.ProblemRepository;
import com.dsatracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboardData(String userId) {
        List<Problem> allProblems = problemRepository.findByUserId(userId);
        List<Problem> problems = allProblems.stream()
                .filter(p -> p.getStatus() != null && p.getStatus() != com.dsatracker.model.enums.ProblemStatus.UNSOLVED)
                .collect(Collectors.toList());
        User user = userRepository.findById(userId).orElse(null);

        Map<String, Long> topicWise = problems.stream()
                .filter(p -> p.getTopic() != null)
                .collect(Collectors.groupingBy(Problem::getTopic, Collectors.counting()));

        Map<String, Long> platformWise = problems.stream()
                .filter(p -> p.getPlatform() != null)
                .collect(Collectors.groupingBy(p -> p.getPlatform().name(), Collectors.counting()));

        // Heatmap: date -> count for last 365 days
        Map<String, Integer> heatmap = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 364; i >= 0; i--) {
            heatmap.put(today.minusDays(i).toString(), 0);
        }
        problems.stream().filter(p -> p.getDateSolved() != null)
                .forEach(p -> {
                    String key = p.getDateSolved().toString();
                    heatmap.computeIfPresent(key, (k, v) -> v + 1);
                });

        // Weekly data (last 7 days)
        List<Map<String, Object>> weeklyData = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            long count = problems.stream()
                    .filter(p -> p.getDateSolved() != null && p.getDateSolved().equals(day))
                    .count();
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", day.toString());
            entry.put("day", day.getDayOfWeek().toString().substring(0, 3));
            entry.put("count", count);
            weeklyData.add(entry);
        }

        // Recent activity (last 10)
        List<Map<String, Object>> recent = problems.stream()
                .sorted(Comparator.comparing(Problem::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", p.getProblemName());
                    m.put("difficulty", p.getDifficulty());
                    m.put("topic", p.getTopic());
                    m.put("date", p.getDateSolved());
                    m.put("platform", p.getPlatform());
                    return m;
                }).collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalSolved(problemRepository.countByUserId(userId))
                .easySolved(problemRepository.countByUserIdAndDifficulty(userId, Difficulty.EASY))
                .mediumSolved(problemRepository.countByUserIdAndDifficulty(userId, Difficulty.MEDIUM))
                .hardSolved(problemRepository.countByUserIdAndDifficulty(userId, Difficulty.HARD))
                .currentStreak(user != null ? user.getStreakCount() : 0)
                .longestStreak(user != null ? user.getLongestStreak() : 0)
                .topicWiseCount(topicWise)
                .platformWiseCount(platformWise)
                .weeklyData(weeklyData)
                .heatmapData(heatmap)
                .recentActivity(recent)
                .build();
    }
}
