package com.funzycode.backend.service.impl;

import com.funzycode.backend.dto.CompleteLevelRequest;
import com.funzycode.backend.dto.LevelProgressResponse;
import com.funzycode.backend.dto.SaveCodeRequest;
import com.funzycode.backend.entity.*;
import com.funzycode.backend.exception.BadRequestException;
import com.funzycode.backend.repository.GameProgressRepository;
import com.funzycode.backend.repository.LevelProgressRepository;
import com.funzycode.backend.service.GameService;
import com.funzycode.backend.service.LevelService;
import com.funzycode.backend.util.AppMapper;
import com.funzycode.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LevelServiceImpl implements LevelService {

    private static final int TOTAL_LEVELS = 50;
    private static final int DEFAULT_COMPLETE_COINS = 100;
    private static final int HINT_COST_COINS = 50;
    private static final int EXTRA_TIME_COST_COINS = 100;
    private static final int AUTO_FIX_COST_STARS = 1;

    private final AuthUtil authUtil;
    private final GameService gameService;
    private final LevelProgressRepository levelProgressRepository;
    private final GameProgressRepository gameProgressRepository;
    private final AppMapper mapper;

    @Override
    public List<LevelProgressResponse> getLevels() {
        AppUser user = authUtil.currentUser();
        gameService.initializeLevelsIfMissing(user);
        return levelProgressRepository.findByUserOrderByLevelNumberAsc(user)
                .stream()
                .map(mapper::toLevelResponse)
                .toList();
    }

    @Override
    public LevelProgressResponse getLevel(int levelNumber) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        gameService.initializeLevelsIfMissing(user);
        return mapper.toLevelResponse(getOrCreateLevel(user, levelNumber));
    }

    @Override
    public LevelProgressResponse startLevel(int levelNumber) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        gameService.initializeLevelsIfMissing(user);
        LevelProgress level = getOrCreateLevel(user, levelNumber);

        if (level.getStatus() == LevelStatus.LOCKED) {
            throw new BadRequestException("This level is locked. Complete previous levels first.");
        }
        if (level.getStatus() == LevelStatus.OPEN) {
            level.setStatus(LevelStatus.CURRENT);
        }
        return mapper.toLevelResponse(levelProgressRepository.save(level));
    }

    @Override
    public LevelProgressResponse saveCode(int levelNumber, SaveCodeRequest request) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        gameService.initializeLevelsIfMissing(user);
        LevelProgress level = getOrCreateLevel(user, levelNumber);
        if (level.getStatus() == LevelStatus.LOCKED) {
            throw new BadRequestException("Cannot save code for a locked level");
        }
        level.setSubmittedCode(request.getSubmittedCode());
        level.setSecondsLeft(request.getSecondsLeft());
        return mapper.toLevelResponse(levelProgressRepository.save(level));
    }

    @Override
    public LevelProgressResponse completeLevel(int levelNumber, CompleteLevelRequest request) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        gameService.initializeLevelsIfMissing(user);
        LevelProgress level = getOrCreateLevel(user, levelNumber);
        if (level.getStatus() == LevelStatus.LOCKED) {
            throw new BadRequestException("Cannot complete a locked level");
        }

        boolean firstCompletion = level.getStatus() != LevelStatus.COMPLETED;
        level.setStatus(LevelStatus.COMPLETED);
        level.setSubmittedCode(request.getSubmittedCode());
        level.setSecondsLeft(request.getSecondsLeft());
        int starsEarned = clamp(request.getStarsEarned() == null ? 3 : request.getStarsEarned(), 1, 3);
        level.setStarsEarned(Math.max(level.getStarsEarned(), starsEarned));
        if (level.getCompletedAt() == null) {
            level.setCompletedAt(LocalDateTime.now());
        }
        level = levelProgressRepository.save(level);

        GameProgress progress = gameService.getOrCreateProgress(user);
        if (firstCompletion) {
            int coinsEarned = request.getCoinsEarned() == null ? DEFAULT_COMPLETE_COINS : Math.max(0, request.getCoinsEarned());
            progress.setCoins(progress.getCoins() + coinsEarned);
            progress.setStars(progress.getStars() + starsEarned);
            progress.setCompletedCount((int) levelProgressRepository.countByUserAndStatus(user, LevelStatus.COMPLETED));

            if (levelNumber >= progress.getCurrentLevel() && levelNumber < TOTAL_LEVELS) {
                progress.setCurrentLevel(levelNumber + 1);
                LevelProgress next = getOrCreateLevel(user, levelNumber + 1);
                if (next.getStatus() == LevelStatus.LOCKED) {
                    next.setStatus(LevelStatus.CURRENT);
                    levelProgressRepository.save(next);
                }
            }
            gameProgressRepository.save(progress);
        }

        return mapper.toLevelResponse(level);
    }

    @Override
    public LevelProgressResponse buyHint(int levelNumber) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        gameService.initializeLevelsIfMissing(user);
        LevelProgress level = getOrCreateLevel(user, levelNumber);
        if (level.getStatus() == LevelStatus.LOCKED) {
            throw new BadRequestException("Cannot buy hint for a locked level");
        }
        if (!level.isHintUsed()) {
            GameProgress progress = gameService.getOrCreateProgress(user);
            requireCoins(progress, HINT_COST_COINS);
            progress.setCoins(progress.getCoins() - HINT_COST_COINS);
            level.setHintUsed(true);
            gameProgressRepository.save(progress);
        }
        return mapper.toLevelResponse(levelProgressRepository.save(level));
    }

    @Override
    public LevelProgressResponse autoFix(int levelNumber) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        gameService.initializeLevelsIfMissing(user);
        LevelProgress level = getOrCreateLevel(user, levelNumber);
        if (level.getStatus() == LevelStatus.LOCKED) {
            throw new BadRequestException("Cannot use auto-fix for a locked level");
        }
        if (!level.isAutoFixUsed()) {
            GameProgress progress = gameService.getOrCreateProgress(user);
            if (progress.getStars() < AUTO_FIX_COST_STARS) {
                throw new BadRequestException("Not enough stars to use auto-fix");
            }
            progress.setStars(progress.getStars() - AUTO_FIX_COST_STARS);
            level.setAutoFixUsed(true);
            gameProgressRepository.save(progress);
        }
        return mapper.toLevelResponse(levelProgressRepository.save(level));
    }

    @Override
    public LevelProgressResponse extraTime(int levelNumber) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        gameService.initializeLevelsIfMissing(user);
        LevelProgress level = getOrCreateLevel(user, levelNumber);
        if (level.getStatus() == LevelStatus.LOCKED) {
            throw new BadRequestException("Cannot add extra time for a locked level");
        }
        GameProgress progress = gameService.getOrCreateProgress(user);
        requireCoins(progress, EXTRA_TIME_COST_COINS);
        progress.setCoins(progress.getCoins() - EXTRA_TIME_COST_COINS);
        level.setExtraTimeUses(level.getExtraTimeUses() + 1);
        gameProgressRepository.save(progress);
        return mapper.toLevelResponse(levelProgressRepository.save(level));
    }

    private LevelProgress getOrCreateLevel(AppUser user, int levelNumber) {
        return levelProgressRepository.findByUserAndLevelNumber(user, levelNumber).orElseGet(() -> levelProgressRepository.save(
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

    private void requireCoins(GameProgress progress, int amount) {
        if (progress.getCoins() < amount) {
            throw new BadRequestException("Not enough coins. Required: " + amount);
        }
    }

    private void validateLevel(int levelNumber) {
        if (levelNumber < 1 || levelNumber > TOTAL_LEVELS) {
            throw new BadRequestException("Level number must be between 1 and " + TOTAL_LEVELS);
        }
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }
}
