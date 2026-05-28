package com.dsatracker.service;

import com.dsatracker.dto.request.NoteRequest;
import com.dsatracker.exception.ResourceNotFoundException;
import com.dsatracker.model.Note;
import com.dsatracker.model.enums.NoteCategory;
import com.dsatracker.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Note service — CRUD operations for DSA notes, interview tips, and code snippets.
 */
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;

    public Note createNote(String userId, NoteRequest request) {
        Note note = Note.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory() != null ? request.getCategory() : NoteCategory.OTHER)
                .tags(request.getTags())
                .pinned(request.isPinned())
                .build();
        return noteRepository.save(note);
    }

    public List<Note> getUserNotes(String userId) {
        return noteRepository.findByUserIdOrderByPinnedDescCreatedAtDesc(userId);
    }

    public Note getNoteById(String id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
    }

    public Note updateNote(String id, NoteRequest request) {
        Note note = getNoteById(id);
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setCategory(request.getCategory());
        note.setTags(request.getTags());
        note.setPinned(request.isPinned());
        return noteRepository.save(note);
    }

    public void deleteNote(String id) {
        Note note = getNoteById(id);
        if (note.isAttachment() && note.getFileUrl() != null) {
            String relativePath = note.getFileUrl();
            if (relativePath.startsWith("/")) {
                relativePath = relativePath.substring(1);
            }
            java.io.File file = new java.io.File(relativePath);
            if (file.exists()) {
                file.delete();
            }
        }
        noteRepository.delete(note);
    }

    public Note togglePin(String id) {
        Note note = getNoteById(id);
        note.setPinned(!note.isPinned());
        return noteRepository.save(note);
    }

    public List<Note> getNotesByCategory(String userId, NoteCategory category) {
        return noteRepository.findByUserIdAndCategory(userId, category);
    }

    public List<Note> searchNotes(String userId, String keyword) {
        return noteRepository.searchByTitle(userId, keyword);
    }

    public Note uploadNoteAttachment(
            String userId,
            org.springframework.web.multipart.MultipartFile file,
            String title,
            NoteCategory category,
            String description,
            List<String> tags
    ) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        if (file.getSize() > 15 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds limit of 15MB");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Invalid file name");
        }
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }
        List<String> allowedExtensions = List.of(".pdf", ".doc", ".docx", ".txt", ".png", ".jpg", ".jpeg");
        if (!allowedExtensions.contains(extension)) {
            throw new IllegalArgumentException("Unsupported file type. Allowed types: PDF, Word, TXT, Images.");
        }
        java.io.File uploadDir = new java.io.File("uploads");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        String uniqueName = java.util.UUID.randomUUID().toString() + extension;
        java.io.File targetFile = new java.io.File(uploadDir, uniqueName).getAbsoluteFile();
        try {
            file.transferTo(targetFile);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to save uploaded file locally on server", e);
        }

        Note note = Note.builder()
                .userId(userId)
                .title(title)
                .content("")
                .category(category != null ? category : NoteCategory.OTHER)
                .tags(tags != null ? tags : new java.util.ArrayList<>())
                .pinned(false)
                .isAttachment(true)
                .fileName(originalFilename)
                .fileType(file.getContentType())
                .fileUrl("/uploads/" + uniqueName)
                .fileSize(file.getSize())
                .description(description != null ? description : "")
                .build();

        return noteRepository.save(note);
    }
}
