package com.dsatracker.controller;

import com.dsatracker.dto.response.ApiResponse;
import com.dsatracker.model.User;
import com.dsatracker.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> dashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Dashboard data", analyticsService.getDashboardData(user.getId())));
    }
}
