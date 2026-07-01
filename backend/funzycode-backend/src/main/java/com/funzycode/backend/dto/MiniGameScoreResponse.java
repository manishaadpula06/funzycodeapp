package com.funzycode.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MiniGameScoreResponse {
    private Long id;
    private String gameName;
    private int score;
    private int coinsEarned;
    private int starsEarned;
    private Integer durationSeconds;
    private Long userId;
    private String fullName;
    private LocalDateTime createdAt;
}
