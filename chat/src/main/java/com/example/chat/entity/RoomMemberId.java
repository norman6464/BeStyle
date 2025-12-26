package com.example.chat.entity;

import java.io.Serializable;
import java.util.Objects;

public class RoomMemberId implements Serializable {

    private Integer roomId;
    private Integer userId;

    // Constructors
    public RoomMemberId() {
    }

    public RoomMemberId(Integer roomId, Integer userId) {
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

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RoomMemberId that = (RoomMemberId) o;
        return Objects.equals(roomId, that.roomId) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roomId, userId);
    }
}
