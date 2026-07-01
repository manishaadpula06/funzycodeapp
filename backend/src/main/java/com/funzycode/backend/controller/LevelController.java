package com.funzycode.backend.controller;

import com.funzycode.backend.dto.CompleteLevelRequest;
import com.funzycode.backend.dto.LevelProgressResponse;
import com.funzycode.backend.dto.SaveCodeRequest;
import com.funzycode.backend.response.ApiResponse;
import com.funzycode.backend.service.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/levels")
@RequiredArgsConstructor
public class LevelController {

    private final LevelService levelService;

    @GetMapping
    public ApiResponse<List<LevelProgressResponse>> getLevels() {
        return ApiResponse.success("Levels fetched", levelService.getLevels());
    }

    @GetMapping("/{levelNumber}")
    public ApiResponse<LevelProgressResponse> getLevel(@PathVariable int levelNumber) {
        return ApiResponse.success("Level fetched", levelService.getLevel(levelNumber));
    }

    @PostMapping("/{levelNumber}/start")
    public ApiResponse<LevelProgressResponse> startLevel(@PathVariable int levelNumber) {
        return ApiResponse.success("Level started", levelService.startLevel(levelNumber));
    }

    @PostMapping("/{levelNumber}/save-code")
    public ApiResponse<LevelProgressResponse> saveCode(
            @PathVariable int levelNumber,
            @RequestBody SaveCodeRequest request
    ) {
        return ApiResponse.success("Code saved", levelService.saveCode(levelNumber, request));
    }

    @PostMapping("/{levelNumber}/complete")
    public ApiResponse<LevelProgressResponse> completeLevel(
            @PathVariable int levelNumber,
            @RequestBody CompleteLevelRequest request
    ) {
        return ApiResponse.success("Level completed", levelService.completeLevel(levelNumber, request));
    }

    @PostMapping("/{levelNumber}/buy-hint")
    public ApiResponse<LevelProgressResponse> buyHint(@PathVariable int levelNumber) {
        return ApiResponse.success("Hint unlocked", levelService.buyHint(levelNumber));
    }

    @PostMapping("/{levelNumber}/auto-fix")
    public ApiResponse<LevelProgressResponse> autoFix(@PathVariable int levelNumber) {
        return ApiResponse.success("Auto-fix used", levelService.autoFix(levelNumber));
    }

    @PostMapping("/{levelNumber}/extra-time")
    public ApiResponse<LevelProgressResponse> extraTime(@PathVariable int levelNumber) {
        return ApiResponse.success("Extra time added", levelService.extraTime(levelNumber));
    }
}
