package com.funzycode.backend.service.impl;

import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.dto.GiftResponse;
import com.funzycode.backend.dto.LevelProgressResponse;
import com.funzycode.backend.dto.MiniGameScoreResponse;
import com.funzycode.backend.dto.UserResponse;
import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.GameProgress;
import com.funzycode.backend.exception.ResourceNotFoundException;
import com.funzycode.backend.repository.*;
import com.funzycode.backend.service.AdminService;
import com.funzycode.backend.service.GameService;
import com.funzycode.backend.util.AppMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AppUserRepository userRepository;
    private final GameProgressRepository gameProgressRepository;
    private final LevelProgressRepository levelProgressRepository;
    private final GiftRewardRepository giftRewardRepository;
    private final MiniGameScoreRepository scoreRepository;
    private final GameService gameService;
    private final AppMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> users() {
        return userRepository.findAll()
                .stream()
                .map(mapper::toUserResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse userById(Long id) {
        return mapper.toUserResponse(findUser(id));
    }

    @Override
    public GameProgressResponse userProgress(Long id) {
        AppUser user = findUser(id);
        GameProgress progress = gameProgressRepository.findByUser(user)
                .orElseGet(() -> gameService.getOrCreateProgress(user));
        gameService.initializeLevelsIfMissing(user);

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

    @Override
    @Transactional(readOnly = true)
    public List<MiniGameScoreResponse> leaderboard() {
        return scoreRepository.findTop50ByOrderByScoreDescCreatedAtAsc()
                .stream()
                .map(mapper::toMiniGameScoreResponse)
                .toList();
    }

    @Override
    public void deleteUser(Long id) {
        AppUser user = findUser(id);
        scoreRepository.deleteByUser(user);
        giftRewardRepository.deleteByUser(user);
        levelProgressRepository.deleteByUser(user);
        gameProgressRepository.findByUser(user).ifPresent(gameProgressRepository::delete);
        userRepository.delete(user);
    }

    private AppUser findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
