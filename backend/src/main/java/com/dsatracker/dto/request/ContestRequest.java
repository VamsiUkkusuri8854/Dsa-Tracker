package com.dsatracker.dto.request;

import com.dsatracker.model.enums.Platform;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Contest create/update request payload.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestRequest {

    @NotBlank(message = "Contest name is required")
    private String contestName;

    private Platform platform;

    private LocalDateTime contestDate;

    private int ranking;

    private int rating;

    private int problemsSolved;

    private int totalProblems;

    private String notes;

    private boolean upcoming;

    private boolean reminderSet;
}
