package com.dsatracker.model;

import com.dsatracker.model.enums.Difficulty;
import com.dsatracker.model.enums.Platform;
import com.dsatracker.model.enums.ProblemStatus;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Problem Entity — tracks each DSA problem a user has solved/attempted in MySQL.
 */
@Entity
@Table(name = "problems")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Problem {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false)
    private String problemName;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private String topic;

    @Convert(converter = StringListConverter.class)
    @Column(name = "tags", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private LocalDate dateSolved;

    private int timeTaken; // minutes

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String problemLink;

    @Builder.Default
    private boolean revisionNeeded = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProblemStatus status = ProblemStatus.SOLVED;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
