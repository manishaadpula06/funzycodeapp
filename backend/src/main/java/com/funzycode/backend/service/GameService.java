package com.funzycode.backend.service;

import com.funzycode.backend.dto.GameProgressRequest;
import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.GameProgress;

public interface GameService {
    GameProgress getOrCreateProgress(AppUser user);
    void initializeLevelsIfMissing(AppUser user);
    GameProgressResponse getProgress();
    GameProgressResponse updateProgress(GameProgressRequest request);
    GameProgressResponse resetGame();
}
