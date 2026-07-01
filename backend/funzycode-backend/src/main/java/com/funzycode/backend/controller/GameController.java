package com.funzycode.backend.controller;

import com.funzycode.backend.dto.GameProgressRequest;
import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.response.ApiResponse;
import com.funzycode.backend.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping("/progress")
    public ApiResponse<GameProgressResponse> getProgress() {
        return ApiResponse.success("Game progress fetched", gameService.getProgress());
    }

    @PutMapping("/progress")
    public ApiResponse<GameProgressResponse> updateProgress(@RequestBody GameProgressRequest request) {
        return ApiResponse.success("Game progress updated", gameService.updateProgress(request));
    }

    @PostMapping("/reset")
    public ApiResponse<GameProgressResponse> resetGame() {
        return ApiResponse.success("Game progress reset", gameService.resetGame());
    }
}
