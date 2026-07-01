package com.funzycode.backend.repository;

import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.GiftReward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GiftRewardRepository extends JpaRepository<GiftReward, Long> {
    Optional<GiftReward> findByUserAndLevelNumber(AppUser user, int levelNumber);
    List<GiftReward> findByUserOrderByLevelNumberAsc(AppUser user);
    boolean existsByUserAndLevelNumber(AppUser user, int levelNumber);
    void deleteByUser(AppUser user);
}
