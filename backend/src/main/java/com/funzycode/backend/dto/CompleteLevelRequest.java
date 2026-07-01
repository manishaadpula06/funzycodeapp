package com.funzycode.backend.dto;

import lombok.Data;

@Data
public class CompleteLevelRequest {
    private String submittedCode;
    private Integer secondsLeft;
    private Integer starsEarned;
    private Integer coinsEarned;
}
