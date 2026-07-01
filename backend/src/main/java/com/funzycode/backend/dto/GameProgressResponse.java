package com.funzycode.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameProgressResponse {
    private Long id;
    private int coins;
    private int stars;
    private int currentLevel;
    private int completedCount;
    private boolean soundEnabled;
    private boolean shareRewardClaimed;
    private List<LevelProgressResponse> levels;
    private List<GiftResponse> gifts;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
