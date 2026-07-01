package com.funzycode.backend.service.impl;

import com.funzycode.backend.dto.MiniGameScoreRequest;
import com.funzycode.backend.dto.MiniGameScoreResponse;
import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.GameProgress;
import com.funzycode.backend.entity.MiniGameScore;
import com.funzycode.backend.repository.GameProgressRepository;
import com.funzycode.backend.repository.MiniGameScoreRepository;
import com.funzycode.backend.service.GameService;
import com.funzycode.backend.service.MiniGameService;
import com.funzycode.backend.util.AppMapper;
import com.funzycode.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MiniGameServiceImpl implements MiniGameService {

    private final AuthUtil authUtil;
    private final GameService gameService;
    private final GameProgressRepository gameProgressRepository;
    private final MiniGameScoreRepository scoreRepository;
    private final AppMapper mapper;

    @Override
    public MiniGameScoreResponse saveScore(MiniGameScoreRequest request) {
        AppUser user = authUtil.currentUser();
        MiniGameScore score = scoreRepository.save(MiniGameScore.builder()
                .user(user)
                .gameName(request.getGameName().trim())
                .score(Math.max(0, request.getScore()))
                .coinsEarned(Math.max(0, request.getCoinsEarned()))
                .starsEarned(Math.max(0, request.getStarsEarned()))
                .durationSeconds(request.getDurationSeconds())
                .build());

        GameProgress progress = gameService.getOrCreateProgress(user);
        progress.setCoins(progress.getCoins() + score.getCoinsEarned());
        progress.setStars(progress.getStars() + score.getStarsEarned());
        gameProgressRepository.save(progress);

        return mapper.toMiniGameScoreResponse(score);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MiniGameScoreResponse> myScores() {
        AppUser user = authUtil.currentUser();
        return scoreRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(mapper::toMiniGameScoreResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MiniGameScoreResponse> leaderboard(String gameName) {
        return scoreRepository.findTop20ByGameNameOrderByScoreDescCreatedAtAsc(gameName.trim())
                .stream()
                .map(mapper::toMiniGameScoreResponse)
                .toList();
    }
}
