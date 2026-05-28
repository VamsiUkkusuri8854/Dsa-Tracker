package com.dsatracker.repository;

import com.dsatracker.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository for Roadmap Entities.
 */
@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, String> {

    List<Roadmap> findAllByOrderByOrderAsc();

    Optional<Roadmap> findByTopic(String topic);
}
