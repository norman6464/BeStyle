package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * フォローリクエストのDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowRequestDto {
    private Integer id;
    private Integer requesterId;
    private Integer targetId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
