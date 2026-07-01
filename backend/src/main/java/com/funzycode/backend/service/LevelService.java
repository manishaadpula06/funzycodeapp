package com.funzycode.backend.service;

import com.funzycode.backend.dto.CompleteLevelRequest;
import com.funzycode.backend.dto.LevelProgressResponse;
import com.funzycode.backend.dto.SaveCodeRequest;

import java.util.List;

public interface LevelService {
    List<LevelProgressResponse> getLevels();
    LevelProgressResponse getLevel(int levelNumber);
    LevelProgressResponse startLevel(int levelNumber);
    LevelProgressResponse saveCode(int levelNumber, SaveCodeRequest request);
    LevelProgressResponse completeLevel(int levelNumber, CompleteLevelRequest request);
    LevelProgressResponse buyHint(int levelNumber);
    LevelProgressResponse autoFix(int levelNumber);
    LevelProgressResponse extraTime(int levelNumber);
}
