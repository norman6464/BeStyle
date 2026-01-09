package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * フォローアクションのリクエスト
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowActionRequest {
    private Integer followerId;
    private Integer followingId;
}
