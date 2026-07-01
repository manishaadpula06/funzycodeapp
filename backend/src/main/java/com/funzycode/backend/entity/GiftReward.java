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
@Table(name = "gift_rewards", uniqueConstraints = {
        @UniqueConstraint(name = "uk_gift_user_level", columnNames = {"user_id", "level_number"})
})
public class GiftReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "level_number", nullable = false)
    private int levelNumber;

    @Column(nullable = false, length = 80)
    private String giftId;

    @Column(nullable = false)
    private int rewardCoins;

    @Column(nullable = false)
    private LocalDateTime openedAt;
}
