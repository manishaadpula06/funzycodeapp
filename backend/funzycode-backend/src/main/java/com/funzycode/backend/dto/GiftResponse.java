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
public class GiftResponse {
    private Long id;
    private int levelNumber;
    private String giftId;
    private int rewardCoins;
    private boolean opened;
    private boolean available;
    private LocalDateTime openedAt;
}
