package com.dsatracker.controller;

import com.dsatracker.dto.request.ContestRequest;
import com.dsatracker.dto.response.ApiResponse;
import com.dsatracker.model.User;
import com.dsatracker.service.ContestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
public class ContestController {

    private final ContestService contestService;

    @PostMapping
    public ResponseEntity<ApiResponse> create(@AuthenticationPrincipal User user, @Valid @RequestBody ContestRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Contest added", contestService.createContest(user.getId(), req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Contests", contestService.getUserContests(user.getId())));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse> upcoming(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Upcoming", contestService.getUpcomingContests(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Contest", contestService.getContestById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable String id, @Valid @RequestBody ContestRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Updated", contestService.updateContest(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String id) {
        contestService.deleteContest(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
