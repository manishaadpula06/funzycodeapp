package com.funzycode.backend.repository;

import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.LevelProgress;
import com.funzycode.backend.entity.LevelStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LevelProgressRepository extends JpaRepository<LevelProgress, Long> {
    List<LevelProgress> findByUserOrderByLevelNumberAsc(AppUser user);
    Optional<LevelProgress> findByUserAndLevelNumber(AppUser user, int levelNumber);
    boolean existsByUserAndLevelNumberAndStatus(AppUser user, int levelNumber, LevelStatus status);
    long countByUserAndStatus(AppUser user, LevelStatus status);
    void deleteByUser(AppUser user);
}
