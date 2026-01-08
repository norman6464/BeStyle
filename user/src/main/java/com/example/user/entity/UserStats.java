package com.example.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStats {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "post_count", columnDefinition = "INT DEFAULT 0")
    private Integer postCount = 0;

    @Column(name = "follower_count", columnDefinition = "INT DEFAULT 0")
    private Integer followerCount = 0;

    @Column(name = "following_count", columnDefinition = "INT DEFAULT 0")
    private Integer followingCount = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
