package com.funzycode.backend.repository;

import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.MiniGameScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MiniGameScoreRepository extends JpaRepository<MiniGameScore, Long> {
    List<MiniGameScore> findByUserOrderByCreatedAtDesc(AppUser user);
    List<MiniGameScore> findTop20ByGameNameOrderByScoreDescCreatedAtAsc(String gameName);
    List<MiniGameScore> findTop50ByOrderByScoreDescCreatedAtAsc();
    void deleteByUser(AppUser user);
}
