package com.dsatracker.controller;

import com.dsatracker.dto.response.ApiResponse;
import com.dsatracker.model.User;
import com.dsatracker.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Roadmaps", roadmapService.getAllRoadmaps()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Roadmap", roadmapService.getRoadmapById(id)));
    }

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse> getWithProgress(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Roadmaps with progress", roadmapService.getRoadmapsWithProgress(user.getId())));
    }
}
