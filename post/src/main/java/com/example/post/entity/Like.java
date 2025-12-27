package com.example.post.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
@IdClass(LikeId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Like {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Like(Post post, Integer userId) {
        this.post = post;
        this.userId = userId;
    }
}
