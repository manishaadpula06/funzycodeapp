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
@Table(name = "level_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uk_level_user_level", columnNames = {"user_id", "level_number"})
}, indexes = {
        @Index(name = "idx_level_user", columnList = "user_id"),
        @Index(name = "idx_level_number", columnList = "level_number")
})
public class LevelProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "level_number", nullable = false)
    private int levelNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LevelStatus status;

    @Column(columnDefinition = "TEXT")
    private String submittedCode;

    private Integer secondsLeft;

    @Column(nullable = false)
    private int starsEarned;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private boolean hintUsed;

    @Column(nullable = false)
    private boolean autoFixUsed;

    @Column(nullable = false)
    private int extraTimeUses;

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
