CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NULL,
    provider VARCHAR(40) NOT NULL DEFAULT 'LOCAL',
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    KEY idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_progress (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    coins INT NOT NULL DEFAULT 0,
    stars INT NOT NULL DEFAULT 0,
    current_level INT NOT NULL DEFAULT 1,
    completed_count INT NOT NULL DEFAULT 0,
    sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    share_reward_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_game_progress_user (user_id),
    CONSTRAINT fk_game_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS level_progress (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    level_number INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    submitted_code LONGTEXT NULL,
    seconds_left INT NULL,
    stars_earned INT NOT NULL DEFAULT 0,
    completed_at DATETIME(6) NULL,
    hint_used BOOLEAN NOT NULL DEFAULT FALSE,
    auto_fix_used BOOLEAN NOT NULL DEFAULT FALSE,
    extra_time_uses INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_level_progress_user_level (user_id, level_number),
    KEY idx_level_progress_user (user_id),
    CONSTRAINT fk_level_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gift_rewards (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    level_number INT NOT NULL,
    gift_id INT NOT NULL,
    reward_coins INT NOT NULL DEFAULT 0,
    opened_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_gift_rewards_user_level (user_id, level_number),
    KEY idx_gift_rewards_user (user_id),
    CONSTRAINT fk_gift_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mini_game_scores (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    game_name VARCHAR(80) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    coins_earned INT NOT NULL DEFAULT 0,
    stars_earned INT NOT NULL DEFAULT 0,
    duration_seconds INT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_scores_game_name (game_name),
    KEY idx_scores_user (user_id),
    CONSTRAINT fk_scores_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
