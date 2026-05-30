package com.dsatracker.model;

import com.dsatracker.model.enums.NoteCategory;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Note Entity — stores DSA concepts, interview tips, code snippets, and PDF uploads in MySQL.
 */
@Entity
@Table(name = "notes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content; // markdown

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NoteCategory category = NoteCategory.OTHER;

    @Convert(converter = StringListConverter.class)
    @Column(name = "tags", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private boolean pinned = false;

    private boolean isAttachment;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;

    @Column(columnDefinition = "TEXT")
    private String description;

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
