package com.example.post.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
@IdClass(LikeId.class)
public class Like {

    @Id
    @Column(name = "post_id")
    private Integer postId;

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public Like() {
    }

    public Like(Integer postId, Integer userId) {
        this.postId = postId;
        this.userId = userId;
    }

    // Getters and Setters
    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
