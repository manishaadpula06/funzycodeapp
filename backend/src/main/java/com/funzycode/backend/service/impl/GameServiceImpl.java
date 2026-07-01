package com.funzycode.backend.service.impl;

import com.funzycode.backend.dto.GameProgressRequest;
import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.dto.GiftResponse;
import com.funzycode.backend.dto.LevelProgressResponse;
import com.funzycode.backend.entity.*;
import com.funzycode.backend.exception.BadRequestException;
import com.funzycode.backend.repository.GameProgressRepository;
import com.funzycode.backend.repository.GiftRewardRepository;
import com.funzycode.backend.repository.LevelProgressRepository;
import com.funzycode.backend.service.GameService;
import com.funzycode.backend.util.AppMapper;
import com.funzycode.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GameServiceImpl implements GameService {

    private static final int TOTAL_LEVELS = 50;

    private final GameProgressRepository gameProgressRepository;
    private final LevelProgressRepository levelProgressRepository;
    private final GiftRewardRepository giftRewardRepository;
    private final AuthUtil authUtil;
    private final AppMapper mapper;

    @Override
    public GameProgress getOrCreateProgress(AppUser user) {
        return gameProgressRepository.findByUser(user).orElseGet(() -> gameProgressRepository.save(
                GameProgress.builder()
                        .user(user)
                        .coins(0)
                        .stars(0)
                        .currentLevel(1)
                        .completedCount(0)
                        .soundEnabled(true)
                        .shareRewardClaimed(false)
                        .build()
        ));
    }

    @Override
    public void initializeLevelsIfMissing(AppUser user) {
        List<LevelProgress> existing = levelProgressRepository.findByUserOrderByLevelNumberAsc(user);
        if (existing.size() >= TOTAL_LEVELS) {
            return;
        }

        for (int i = 1; i <= TOTAL_LEVELS; i++) {
            final int levelNumber = i;
            levelProgressRepository.findByUserAndLevelNumber(user, levelNumber).orElseGet(() -> levelProgressRepository.save(
                    LevelProgress.builder()
                            .user(user)
                            .levelNumber(levelNumber)
                            .status(levelNumber == 1 ? LevelStatus.CURRENT : LevelStatus.LOCKED)
                            .starsEarned(0)
                            .hintUsed(false)
                            .autoFixUsed(false)
                            .extraTimeUses(0)
                            .build()
            ));
        }
    }

    @Override
    public GameProgressResponse getProgress() {
        AppUser user = authUtil.currentUser();
        GameProgress progress = getOrCreateProgress(user);
        initializeLevelsIfMissing(user);
        return toResponse(user, progress);
    }

    @Override
    public GameProgressResponse updateProgress(GameProgressRequest request) {
        AppUser user = authUtil.currentUser();
        GameProgress progress = getOrCreateProgress(user);

        if (request.getCoins() != null) {
            progress.setCoins(Math.max(0, request.getCoins()));
        }
        if (request.getStars() != null) {
            progress.setStars(Math.max(0, request.getStars()));
        }
        if (request.getCurrentLevel() != null) {
            validateLevel(request.getCurrentLevel());
            progress.setCurrentLevel(request.getCurrentLevel());
        }
        if (request.getCompletedCount() != null) {
            progress.setCompletedCount(Math.max(0, Math.min(TOTAL_LEVELS, request.getCompletedCount())));
        }
        if (request.getSoundEnabled() != null) {
            progress.setSoundEnabled(request.getSoundEnabled());
        }
        if (request.getShareRewardClaimed() != null) {
            progress.setShareRewardClaimed(request.getShareRewardClaimed());
        }

        gameProgressRepository.save(progress);
        initializeLevelsIfMissing(user);
        return toResponse(user, progress);
    }

    @Override
    public GameProgressResponse resetGame() {
        AppUser user = authUtil.currentUser();
        giftRewardRepository.deleteByUser(user);
        levelProgressRepository.deleteByUser(user);

        GameProgress progress = getOrCreateProgress(user);
        progress.setCoins(0);
        progress.setStars(0);
        progress.setCurrentLevel(1);
        progress.setCompletedCount(0);
        progress.setSoundEnabled(true);
        progress.setShareRewardClaimed(false);
        gameProgressRepository.save(progress);

        initializeLevelsIfMissing(user);
        return toResponse(user, progress);
    }

    private GameProgressResponse toResponse(AppUser user, GameProgress progress) {
        List<LevelProgressResponse> levels = levelProgressRepository.findByUserOrderByLevelNumberAsc(user)
                .stream()
                .map(mapper::toLevelResponse)
                .toList();

        List<GiftResponse> gifts = giftRewardRepository.findByUserOrderByLevelNumberAsc(user)
                .stream()
                .map(mapper::toGiftResponse)
                .toList();

        return GameProgressResponse.builder()
                .id(progress.getId())
                .coins(progress.getCoins())
                .stars(progress.getStars())
                .currentLevel(progress.getCurrentLevel())
                .completedCount(progress.getCompletedCount())
                .soundEnabled(progress.isSoundEnabled())
                .shareRewardClaimed(progress.isShareRewardClaimed())
                .levels(levels)
                .gifts(gifts)
                .createdAt(progress.getCreatedAt())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }

    private void validateLevel(int levelNumber) {
        if (levelNumber < 1 || levelNumber > TOTAL_LEVELS) {
            throw new BadRequestException("Level number must be between 1 and " + TOTAL_LEVELS);
        }
    }
}
