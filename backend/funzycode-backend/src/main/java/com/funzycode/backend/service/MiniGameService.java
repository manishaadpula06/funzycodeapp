package com.funzycode.backend.service;

import com.funzycode.backend.dto.MiniGameScoreRequest;
import com.funzycode.backend.dto.MiniGameScoreResponse;

import java.util.List;

public interface MiniGameService {
    MiniGameScoreResponse saveScore(MiniGameScoreRequest request);
    List<MiniGameScoreResponse> myScores();
    List<MiniGameScoreResponse> leaderboard(String gameName);
}
