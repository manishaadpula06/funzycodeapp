package com.funzycode.backend.controller;

import com.funzycode.backend.dto.MiniGameScoreRequest;
import com.funzycode.backend.dto.MiniGameScoreResponse;
import com.funzycode.backend.response.ApiResponse;
import com.funzycode.backend.service.MiniGameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mini-games")
@RequiredArgsConstructor
public class MiniGameController {

    private final MiniGameService miniGameService;

    @PostMapping("/scores")
    public ApiResponse<MiniGameScoreResponse> saveScore(@Valid @RequestBody MiniGameScoreRequest request) {
        return ApiResponse.success("Mini game score saved", miniGameService.saveScore(request));
    }

    @GetMapping("/my-scores")
    public ApiResponse<List<MiniGameScoreResponse>> myScores() {
        return ApiResponse.success("My mini game scores fetched", miniGameService.myScores());
    }

    @GetMapping("/leaderboard/{gameName}")
    public ApiResponse<List<MiniGameScoreResponse>> leaderboard(@PathVariable String gameName) {
        return ApiResponse.success("Leaderboard fetched", miniGameService.leaderboard(gameName));
    }
}
