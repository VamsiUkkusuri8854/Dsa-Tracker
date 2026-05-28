package com.dsatracker.repository;

import com.dsatracker.model.Note;
import com.dsatracker.model.enums.NoteCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA repository for Note Entities.
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, String> {

    List<Note> findByUserIdOrderByPinnedDescCreatedAtDesc(String userId);

    List<Note> findByUserIdAndCategory(String userId, NoteCategory category);

    List<Note> findByUserIdAndPinned(String userId, boolean pinned);

    @Query("SELECT n FROM Note n WHERE n.userId = ?1 AND (LOWER(n.title) LIKE LOWER(CONCAT('%', ?2, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', ?2, '%')) OR LOWER(n.description) LIKE LOWER(CONCAT('%', ?2, '%')))")
    List<Note> searchByTitle(String userId, String keyword);

    long countByUserId(String userId);
}
