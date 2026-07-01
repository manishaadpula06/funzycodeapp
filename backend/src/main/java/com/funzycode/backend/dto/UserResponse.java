package com.funzycode.backend.dto;

import com.funzycode.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String provider;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
