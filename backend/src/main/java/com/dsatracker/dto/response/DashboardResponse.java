package com.dsatracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Dashboard analytics response — aggregated stats for the user dashboard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalSolved;
    private long easySolved;
    private long mediumSolved;
    private long hardSolved;
    private int currentStreak;
    private int longestStreak;
    private Map<String, Long> topicWiseCount;
    private Map<String, Long> platformWiseCount;
    private List<Map<String, Object>> weeklyData;
    private Map<String, Integer> heatmapData; // date string -> count
    private List<Map<String, Object>> recentActivity;
}
