package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 投稿情報のDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Integer id;
    private Integer userId;
    private String content;
    private Integer replyToId;
    private Integer repostOfId;
    private Integer quoteOfId;
    private String visibility;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
