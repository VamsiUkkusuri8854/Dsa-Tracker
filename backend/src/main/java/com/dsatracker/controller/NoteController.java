package com.dsatracker.controller;

import com.dsatracker.dto.request.NoteRequest;
import com.dsatracker.dto.response.ApiResponse;
import com.dsatracker.model.User;
import com.dsatracker.model.enums.NoteCategory;
import com.dsatracker.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<ApiResponse> create(@AuthenticationPrincipal User user, @Valid @RequestBody NoteRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Note created", noteService.createNote(user.getId(), req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Notes retrieved", noteService.getUserNotes(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Note found", noteService.getNoteById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable String id, @Valid @RequestBody NoteRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Note updated", noteService.updateNote(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.success("Note deleted", null));
    }

    @PatchMapping("/{id}/pin")
    public ResponseEntity<ApiResponse> togglePin(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Pin toggled", noteService.togglePin(id)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse> byCategory(@AuthenticationPrincipal User user, @PathVariable NoteCategory category) {
        return ResponseEntity.ok(ApiResponse.success("Notes by category", noteService.getNotesByCategory(user.getId(), category)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(@AuthenticationPrincipal User user, @RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success("Search results", noteService.searchNotes(user.getId(), q)));
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> uploadFile(
            @AuthenticationPrincipal User user,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "category", required = false) com.dsatracker.model.enums.NoteCategory category,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "tags", required = false) java.util.List<String> tags
    ) {
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", 
            noteService.uploadNoteAttachment(user.getId(), file, title, category, description, tags)));
    }
}
