package com.dsatracker.model;

import com.dsatracker.model.enums.Platform;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Contest Entity — tracks competitive programming contests and ratings in MySQL.
 */
@Entity
@Table(name = "contests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contest {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false)
    private String contestName;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    private LocalDateTime contestDate;

    private int ranking;

    private int rating;

    private int problemsSolved;

    private int totalProblems;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    private boolean upcoming = false;

    @Builder.Default
    private boolean reminderSet = false;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
    }
}
