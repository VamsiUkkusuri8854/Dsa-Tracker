package com.dsatracker.controller;

import com.dsatracker.dto.response.ApiResponse;
import com.dsatracker.model.User;
import com.dsatracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Profile", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Updated",
                userService.updateProfile(user.getId(), body.get("fullName"), body.get("avatar"))));
    }

    @PostMapping("/bookmark/{problemId}")
    public ResponseEntity<ApiResponse> toggleBookmark(@AuthenticationPrincipal User user, @PathVariable String problemId) {
        return ResponseEntity.ok(ApiResponse.success("Bookmark toggled",
                userService.toggleBookmark(user.getId(), problemId)));
    }
}
