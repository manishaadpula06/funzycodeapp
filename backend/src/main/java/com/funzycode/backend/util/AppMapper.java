package com.funzycode.backend.util;

import com.funzycode.backend.dto.*;
import com.funzycode.backend.entity.*;
import org.springframework.stereotype.Component;

@Component
public class AppMapper {

    public UserResponse toUserResponse(AppUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public LevelProgressResponse toLevelResponse(LevelProgress level) {
        return LevelProgressResponse.builder()
                .id(level.getId())
                .levelNumber(level.getLevelNumber())
                .status(level.getStatus())
                .submittedCode(level.getSubmittedCode())
                .secondsLeft(level.getSecondsLeft())
                .starsEarned(level.getStarsEarned())
                .completedAt(level.getCompletedAt())
                .hintUsed(level.isHintUsed())
                .autoFixUsed(level.isAutoFixUsed())
                .extraTimeUses(level.getExtraTimeUses())
                .build();
    }

    public GiftResponse toGiftResponse(GiftReward gift) {
        return GiftResponse.builder()
                .id(gift.getId())
                .levelNumber(gift.getLevelNumber())
                .giftId(gift.getGiftId())
                .rewardCoins(gift.getRewardCoins())
                .opened(true)
                .available(false)
                .openedAt(gift.getOpenedAt())
                .build();
    }

    public MiniGameScoreResponse toMiniGameScoreResponse(MiniGameScore score) {
        return MiniGameScoreResponse.builder()
                .id(score.getId())
                .gameName(score.getGameName())
                .score(score.getScore())
                .coinsEarned(score.getCoinsEarned())
                .starsEarned(score.getStarsEarned())
                .durationSeconds(score.getDurationSeconds())
                .userId(score.getUser().getId())
                .fullName(score.getUser().getFullName())
                .createdAt(score.getCreatedAt())
                .build();
    }
}
