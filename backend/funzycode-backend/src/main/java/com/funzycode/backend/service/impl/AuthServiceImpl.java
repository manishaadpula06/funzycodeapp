package com.funzycode.backend.service.impl;

import com.funzycode.backend.dto.*;
import com.funzycode.backend.entity.AppUser;
import com.funzycode.backend.entity.UserRole;
import com.funzycode.backend.exception.BadRequestException;
import com.funzycode.backend.repository.AppUserRepository;
import com.funzycode.backend.security.JwtService;
import com.funzycode.backend.service.AuthService;
import com.funzycode.backend.service.GameService;
import com.funzycode.backend.util.AppMapper;
import com.funzycode.backend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AppMapper mapper;
    private final AuthUtil authUtil;
    private final GameService gameService;

    @Value("${app.admin.secret}")
    private String adminSecret;

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }

        UserRole role = UserRole.USER;
        if (request.getAdminSecret() != null && request.getAdminSecret().equals(adminSecret)) {
            role = UserRole.ADMIN;
        }

        AppUser user = AppUser.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(request.getAvatarUrl())
                .provider("LOCAL")
                .role(role)
                .build();
        user = userRepository.save(user);
        gameService.getOrCreateProgress(user);
        gameService.initializeLevelsIfMissing(user);

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .tokenType("Bearer")
                .user(mapper.toUserResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .tokenType("Bearer")
                .user(mapper.toUserResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse me() {
        return mapper.toUserResponse(authUtil.currentUser());
    }

    @Override
    public String forgotPassword(ForgotPasswordRequest request) {
        // Placeholder for email/SMS reset implementation.
        return "If this email exists, password reset instructions will be sent.";
    }

    @Override
    public String resetPassword(ResetPasswordRequest request) {
        // Placeholder for token-based reset implementation.
        return "Password reset placeholder executed. Configure email token verification before production use.";
    }
}
