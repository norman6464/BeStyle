package com.example.follow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "follow_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "follower_id", nullable = false)
    private Integer followerId;

    @Column(name = "following_id", nullable = false)
    private Integer followingId;

    @Column(nullable = false, length = 20)
    private String action;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
