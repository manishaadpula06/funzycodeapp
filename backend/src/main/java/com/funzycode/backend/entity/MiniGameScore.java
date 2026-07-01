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
@Table(name = "mini_game_scores", indexes = {
        @Index(name = "idx_scores_game", columnList = "game_name"),
        @Index(name = "idx_scores_user", columnList = "user_id"),
        @Index(name = "idx_scores_score", columnList = "score")
})
public class MiniGameScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "game_name", nullable = false, length = 80)
    private String gameName;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int coinsEarned;

    @Column(nullable = false)
    private int starsEarned;

    private Integer durationSeconds;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
