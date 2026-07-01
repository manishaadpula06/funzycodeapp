package com.funzycode.backend.controller;

import com.funzycode.backend.dto.GameProgressResponse;
import com.funzycode.backend.dto.MiniGameScoreResponse;
import com.funzycode.backend.dto.UserResponse;
import com.funzycode.backend.response.ApiResponse;
import com.funzycode.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> users() {
        return ApiResponse.success("Users fetched", adminService.users());
    }

    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> userById(@PathVariable Long id) {
        return ApiResponse.success("User fetched", adminService.userById(id));
    }

    @GetMapping("/users/{id}/progress")
    public ApiResponse<GameProgressResponse> userProgress(@PathVariable Long id) {
        return ApiResponse.success("User progress fetched", adminService.userProgress(id));
    }

    @GetMapping("/leaderboard")
    public ApiResponse<List<MiniGameScoreResponse>> leaderboard() {
        return ApiResponse.success("Leaderboard fetched", adminService.leaderboard());
    }

    @DeleteMapping("/users/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ApiResponse.success("User deleted", null);
    }
}
