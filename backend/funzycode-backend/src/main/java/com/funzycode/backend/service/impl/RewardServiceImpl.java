package com.funzycode.backend.service.impl;

import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.GameProgress;
import com.funzycode.backend.exception.BadRequestException;
import com.funzycode.backend.repository.GameProgressRepository;
import com.funzycode.backend.service.GameService;
import com.funzycode.backend.service.RewardService;
import com.funzycode.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RewardServiceImpl implements RewardService {

    private static final int WHATSAPP_REWARD_COINS = 500;

    private final AuthUtil authUtil;
    private final GameService gameService;
    private final GameProgressRepository gameProgressRepository;

    @Override
    public GameProgressResponse claimWhatsAppReward() {
        AppUser user = authUtil.currentUser();
        GameProgress progress = gameService.getOrCreateProgress(user);
        if (progress.isShareRewardClaimed()) {
            throw new BadRequestException("WhatsApp reward already claimed");
        }
        progress.setShareRewardClaimed(true);
        progress.setCoins(progress.getCoins() + WHATSAPP_REWARD_COINS);
        gameProgressRepository.save(progress);
        return gameService.getProgress();
    }
}
