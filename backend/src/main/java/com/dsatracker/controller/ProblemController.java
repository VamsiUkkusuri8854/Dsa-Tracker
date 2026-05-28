package com.dsatracker.controller;

import com.dsatracker.dto.request.ProblemRequest;
import com.dsatracker.dto.response.ApiResponse;
import com.dsatracker.model.Problem;
import com.dsatracker.model.User;
import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.model.enums.Platform;
import com.dsatracker.model.enums.ProblemStatus;
import com.dsatracker.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping
    public ResponseEntity<ApiResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProblemRequest request) {
        Problem p = problemService.createProblem(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Problem added", p));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(@AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "dateSolved") String sortBy,
            @RequestParam(defaultValue = "desc") String order) {
        Sort sort = order.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<Problem> problems = problemService.getUserProblems(user.getId(), PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Problems retrieved", problems));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Problem found", problemService.getProblemById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable String id, @Valid @RequestBody ProblemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Problem updated", problemService.updateProblem(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(ApiResponse.success("Problem deleted", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(@AuthenticationPrincipal User user, @RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success("Search results", problemService.searchProblems(user.getId(), q)));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse> filter(@AuthenticationPrincipal User user,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) Platform platform,
            @RequestParam(required = false) ProblemStatus status) {
        List<Problem> result = problemService.filterProblems(user.getId(), topic, difficulty, platform, status);
        return ResponseEntity.ok(ApiResponse.success("Filtered results", result));
    }

    @GetMapping("/revision")
    public ResponseEntity<ApiResponse> revision(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Revision list", problemService.getRevisionProblems(user.getId())));
    }
}
