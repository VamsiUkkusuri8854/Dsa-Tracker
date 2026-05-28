package com.dsatracker.model;

import com.dsatracker.model.enums.Difficulty;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Roadmap Entity — defines a DSA topic with recommended problems in MySQL.
 */
@Entity
@Table(name = "roadmaps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Roadmap {

    @Id
    @Column(length = 36)
    private String id;

    private String topic;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int totalProblems;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "roadmap_problems", joinColumns = @JoinColumn(name = "roadmap_id"))
    @Builder.Default
    private List<RoadmapProblem> problems = new ArrayList<>();

    @Column(name = "roadmap_order") // avoid reserved sql keyword 'order'
    private int order;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
    }

    /**
     * Embedded recommended problems within a roadmap topic.
     */
    @Embeddable
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapProblem {
        private String name;
        private String link;
        
        @Enumerated(EnumType.STRING)
        private Difficulty difficulty;
        
        private String platform;
    }
}
