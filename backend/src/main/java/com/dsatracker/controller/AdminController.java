package com.dsatracker.controller;

import com.dsatracker.dto.response.ApiResponse;
import com.dsatracker.model.Roadmap;
import com.dsatracker.service.RoadmapService;
import com.dsatracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final RoadmapService roadmapService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("All users", userService.getAllUsers()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> changeRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Role changed", userService.changeRole(id, body.get("role"))));
    }

    @PostMapping("/roadmaps")
    public ResponseEntity<ApiResponse> createRoadmap(@RequestBody Roadmap roadmap) {
        return ResponseEntity.ok(ApiResponse.success("Roadmap created", roadmapService.createRoadmap(roadmap)));
    }

    @PutMapping("/roadmaps/{id}")
    public ResponseEntity<ApiResponse> updateRoadmap(@PathVariable String id, @RequestBody Roadmap roadmap) {
        return ResponseEntity.ok(ApiResponse.success("Roadmap updated", roadmapService.updateRoadmap(id, roadmap)));
    }

    @DeleteMapping("/roadmaps/{id}")
    public ResponseEntity<ApiResponse> deleteRoadmap(@PathVariable String id) {
        roadmapService.deleteRoadmap(id);
        return ResponseEntity.ok(ApiResponse.success("Roadmap deleted", null));
    }
}
