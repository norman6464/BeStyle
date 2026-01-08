package com.example.post.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "post_id", nullable = false, unique = true)
    private Integer postId;

    @Column(name = "like_count", columnDefinition = "INT DEFAULT 0")
    private Integer likeCount = 0;

    @Column(name = "reply_count", columnDefinition = "INT DEFAULT 0")
    private Integer replyCount = 0;

    @Column(name = "repost_count", columnDefinition = "INT DEFAULT 0")
    private Integer repostCount = 0;

    @Column(name = "quote_count", columnDefinition = "INT DEFAULT 0")
    private Integer quoteCount = 0;

    @Column(name = "view_count", columnDefinition = "INT DEFAULT 0")
    private Integer viewCount = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
