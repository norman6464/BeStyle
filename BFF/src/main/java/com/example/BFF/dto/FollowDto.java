package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * フォロー関係のDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowDto {
    private Integer id;
    private Integer followerId;
    private Integer followingId;
    private String status;
    private LocalDateTime createdAt;
}
