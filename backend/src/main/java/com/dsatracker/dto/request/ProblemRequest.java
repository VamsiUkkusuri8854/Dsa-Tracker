package com.dsatracker.dto.request;

import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.model.enums.Platform;
import com.dsatracker.model.enums.ProblemStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Problem create/update request payload.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemRequest {

    @NotBlank(message = "Problem name is required")
    private String problemName;

    @NotNull(message = "Platform is required")
    private Platform platform;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @NotBlank(message = "Topic is required")
    private String topic;

    private List<String> tags;

    private LocalDate dateSolved;

    private int timeTaken;

    private String notes;

    private String problemLink;

    private boolean revisionNeeded;

    private ProblemStatus status;
}
