package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 投稿作成リクエスト
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    private String content;
    private Integer replyToId;
    private Integer repostOfId;
    private Integer quoteOfId;
    private String visibility;
}
