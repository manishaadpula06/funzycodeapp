package com.funzycode.backend.dto;

import lombok.Data;

@Data
public class GameProgressRequest {
    private Integer coins;
    private Integer stars;
    private Integer currentLevel;
    private Integer completedCount;
    private Boolean soundEnabled;
    private Boolean shareRewardClaimed;
}
