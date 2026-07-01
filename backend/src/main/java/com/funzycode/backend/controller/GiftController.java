package com.funzycode.backend.controller;

import com.funzycode.backend.dto.GiftOpenRequest;
import com.funzycode.backend.dto.GiftResponse;
import com.funzycode.backend.response.ApiResponse;
import com.funzycode.backend.service.GiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gifts")
@RequiredArgsConstructor
public class GiftController {

    private final GiftService giftService;

    @GetMapping("/{levelNumber}")
    public ApiResponse<GiftResponse> getGift(@PathVariable int levelNumber) {
        return ApiResponse.success("Gift status fetched", giftService.getGift(levelNumber));
    }

    @PostMapping("/{levelNumber}/open")
    public ApiResponse<GiftResponse> openGift(
            @PathVariable int levelNumber,
            @RequestBody(required = false) GiftOpenRequest request
    ) {
        if (request == null) {
            request = new GiftOpenRequest();
        }
        return ApiResponse.success("Gift opened", giftService.openGift(levelNumber, request));
    }
}
