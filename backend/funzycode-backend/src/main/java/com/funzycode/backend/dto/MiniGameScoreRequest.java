package com.funzycode.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MiniGameScoreRequest {
    @NotBlank(message = "Game name is required")
    private String gameName;

    @Min(value = 0, message = "Score cannot be negative")
    private int score;

    @Min(value = 0, message = "Coins earned cannot be negative")
    private int coinsEarned;

    @Min(value = 0, message = "Stars earned cannot be negative")
    private int starsEarned;

    private Integer durationSeconds;
}
