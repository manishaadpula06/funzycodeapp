package com.funzycode.backend.dto;

import com.funzycode.backend.entity.LevelStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LevelProgressResponse {
    private Long id;
    private int levelNumber;
    private LevelStatus status;
    private String submittedCode;
    private Integer secondsLeft;
    private int starsEarned;
    private LocalDateTime completedAt;
    private boolean hintUsed;
    private boolean autoFixUsed;
    private int extraTimeUses;
}
