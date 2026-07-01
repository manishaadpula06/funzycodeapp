package com.funzycode.backend.service;

import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.dto.MiniGameScoreResponse;
import com.funzycode.backend.dto.UserResponse;

import java.util.List;

public interface AdminService {
    List<UserResponse> users();
    UserResponse userById(Long id);
    GameProgressResponse userProgress(Long id);
    List<MiniGameScoreResponse> leaderboard();
    void deleteUser(Long id);
}
