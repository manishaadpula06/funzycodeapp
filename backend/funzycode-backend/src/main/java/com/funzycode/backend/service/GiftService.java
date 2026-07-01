package com.funzycode.backend.service;

import com.funzycode.backend.dto.GiftOpenRequest;
import com.funzycode.backend.dto.GiftResponse;

public interface GiftService {
    GiftResponse getGift(int levelNumber);
    GiftResponse openGift(int levelNumber, GiftOpenRequest request);
}
