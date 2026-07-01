package com.funzycode.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "game_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uk_game_progress_user", columnNames = "user_id")
})
public class GameProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(nullable = false)
    private int coins;

    @Column(nullable = false)
    private int stars;

    @Column(nullable = false)
    private int currentLevel;

    @Column(nullable = false)
    private int completedCount;

    @Column(nullable = false)
    private boolean soundEnabled;

    @Column(nullable = false)
    private boolean shareRewardClaimed;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
