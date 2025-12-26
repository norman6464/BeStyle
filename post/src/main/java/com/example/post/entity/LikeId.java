package com.example.post.entity;

import java.io.Serializable;
import java.util.Objects;

public class LikeId implements Serializable {

    private Integer postId;
    private Integer userId;

    // Constructors
    public LikeId() {
    }

    public LikeId(Integer postId, Integer userId) {
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

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LikeId likeId = (LikeId) o;
        return Objects.equals(postId, likeId.postId) &&
                Objects.equals(userId, likeId.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(postId, userId);
    }
}
