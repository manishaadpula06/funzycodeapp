package com.funzycode.backend.service.impl;

import com.funzycode.backend.dto.GiftOpenRequest;
import com.funzycode.backend.dto.GiftResponse;
import com.funzycode.backend.entity.*;
import com.funzycode.backend.exception.BadRequestException;
import com.funzycode.backend.repository.GameProgressRepository;
import com.funzycode.backend.repository.GiftRewardRepository;
import com.funzycode.backend.repository.LevelProgressRepository;
import com.funzycode.backend.service.GameService;
import com.funzycode.backend.service.GiftService;
import com.funzycode.backend.util.AppMapper;
import com.funzycode.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class GiftServiceImpl implements GiftService {

    private static final int TOTAL_LEVELS = 50;
    private static final int[] REWARDS = {0, 50, 100};

    private final AuthUtil authUtil;
    private final GameService gameService;
    private final GiftRewardRepository giftRewardRepository;
    private final LevelProgressRepository levelProgressRepository;
    private final GameProgressRepository gameProgressRepository;
    private final AppMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public GiftResponse getGift(int levelNumber) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);
        return giftRewardRepository.findByUserAndLevelNumber(user, levelNumber)
                .map(mapper::toGiftResponse)
                .orElseGet(() -> GiftResponse.builder()
                        .levelNumber(levelNumber)
                        .opened(false)
                        .available(isCompleted(user, levelNumber))
                        .rewardCoins(0)
                        .build());
    }

    @Override
    public GiftResponse openGift(int levelNumber, GiftOpenRequest request) {
        AppUser user = authUtil.currentUser();
        validateLevel(levelNumber);

        giftRewardRepository.findByUserAndLevelNumber(user, levelNumber).ifPresent(existing -> {
            throw new BadRequestException("Gift already opened for this level");
        });

        if (!isCompleted(user, levelNumber)) {
            throw new BadRequestException("Complete this level before opening gift");
        }

        int reward = REWARDS[ThreadLocalRandom.current().nextInt(REWARDS.length)];
        String giftId = request.getGiftId() == null || request.getGiftId().isBlank()
                ? "gift-level-" + levelNumber
                : request.getGiftId().trim();

        GiftReward gift = giftRewardRepository.save(GiftReward.builder()
                .user(user)
                .levelNumber(levelNumber)
                .giftId(giftId)
                .rewardCoins(reward)
                .openedAt(LocalDateTime.now())
                .build());

        GameProgress progress = gameService.getOrCreateProgress(user);
        progress.setCoins(progress.getCoins() + reward);
        gameProgressRepository.save(progress);

        return mapper.toGiftResponse(gift);
    }

    private boolean isCompleted(AppUser user, int levelNumber) {
        return levelProgressRepository.existsByUserAndLevelNumberAndStatus(user, levelNumber, LevelStatus.COMPLETED);
    }

    private void validateLevel(int levelNumber) {
        if (levelNumber < 1 || levelNumber > TOTAL_LEVELS) {
            throw new BadRequestException("Level number must be between 1 and " + TOTAL_LEVELS);
        }
    }
}
