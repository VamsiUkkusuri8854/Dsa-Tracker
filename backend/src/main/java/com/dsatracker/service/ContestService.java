package com.dsatracker.service;

import com.dsatracker.dto.request.ContestRequest;
import com.dsatracker.exception.ResourceNotFoundException;
import com.dsatracker.model.Contest;
import com.dsatracker.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContestService {

    private final ContestRepository contestRepository;

    public Contest createContest(String userId, ContestRequest request) {
        Contest contest = Contest.builder()
                .userId(userId).contestName(request.getContestName())
                .platform(request.getPlatform()).contestDate(request.getContestDate())
                .ranking(request.getRanking()).rating(request.getRating())
                .problemsSolved(request.getProblemsSolved()).totalProblems(request.getTotalProblems())
                .notes(request.getNotes()).upcoming(request.isUpcoming())
                .reminderSet(request.isReminderSet()).build();
        return contestRepository.save(contest);
    }

    public List<Contest> getUserContests(String userId) {
        return contestRepository.findByUserIdOrderByContestDateDesc(userId);
    }

    public Contest getContestById(String id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found: " + id));
    }

    public Contest updateContest(String id, ContestRequest request) {
        Contest c = getContestById(id);
        c.setContestName(request.getContestName()); c.setPlatform(request.getPlatform());
        c.setContestDate(request.getContestDate()); c.setRanking(request.getRanking());
        c.setRating(request.getRating()); c.setProblemsSolved(request.getProblemsSolved());
        c.setTotalProblems(request.getTotalProblems()); c.setNotes(request.getNotes());
        c.setUpcoming(request.isUpcoming()); c.setReminderSet(request.isReminderSet());
        return contestRepository.save(c);
    }

    public void deleteContest(String id) {
        if (!contestRepository.existsById(id)) throw new ResourceNotFoundException("Contest not found: " + id);
        contestRepository.deleteById(id);
    }

    public List<Contest> getUpcomingContests(String userId) {
        return contestRepository.findByUserIdAndUpcoming(userId, true);
    }
}
