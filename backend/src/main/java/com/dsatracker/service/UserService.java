package com.dsatracker.service;

import com.dsatracker.exception.ResourceNotFoundException;
import com.dsatracker.model.User;
import com.dsatracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    public User updateProfile(String id, String fullName, String avatar) {
        User user = getUserById(id);
        if (fullName != null) user.setFullName(fullName);
        if (avatar != null) user.setAvatar(avatar);
        return userRepository.save(user);
    }

    public User toggleBookmark(String userId, String problemId) {
        User user = getUserById(userId);
        if (user.getBookmarkedProblems().contains(problemId)) {
            user.getBookmarkedProblems().remove(problemId);
        } else {
            user.getBookmarkedProblems().add(problemId);
        }
        return userRepository.save(user);
    }

    // Admin methods
    public List<User> getAllUsers() { return userRepository.findAll(); }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User not found: " + id);
        userRepository.deleteById(id);
    }

    public User changeRole(String id, String role) {
        User user = getUserById(id);
        user.setRole(com.dsatracker.model.enums.Role.valueOf(role));
        return userRepository.save(user);
    }
}
