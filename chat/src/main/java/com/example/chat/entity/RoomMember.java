package com.example.chat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_members")
@IdClass(RoomMemberId.class)
public class RoomMember {

    @Id
    @Column(name = "room_id")
    private Integer roomId;

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    // Constructors
    public RoomMember() {
    }

    public RoomMember(Integer roomId, Integer userId) {
        this.roomId = roomId;
        this.userId = userId;
    }

    // Getters and Setters
    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
