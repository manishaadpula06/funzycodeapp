package com.funzycode.backend.controller;

import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.response.ApiResponse;
import com.funzycode.backend.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @PostMapping("/whatsapp")
    public ApiResponse<GameProgressResponse> claimWhatsAppReward() {
        return ApiResponse.success("WhatsApp reward claimed", rewardService.claimWhatsAppReward());
    }
}
