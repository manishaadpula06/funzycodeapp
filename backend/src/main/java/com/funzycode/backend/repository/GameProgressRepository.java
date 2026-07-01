package com.funzycode.backend.repository;

import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.GameProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameProgressRepository extends JpaRepository<GameProgress, Long> {
    Optional<GameProgress> findByUser(AppUser user);
    Optional<GameProgress> findByUserId(Long userId);
}
