package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 投稿情報のレスポンスDTO（ユーザー情報を含む）
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {
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
    
    // ユーザー情報
    private UserInfo user;
    
    /**
     * ユーザー情報のネストクラス
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Integer id;
        private String username;
        private String displayName;
        private String profileImageUrl;
    }
    
    /**
     * PostDtoとUserDtoから作成
     */
    public static PostResponseDto from(PostDto post, UserDto user) {
        PostResponseDto response = new PostResponseDto();
        response.setId(post.getId());
        response.setUserId(post.getUserId());
        response.setContent(post.getContent());
        response.setReplyToId(post.getReplyToId());
        response.setRepostOfId(post.getRepostOfId());
        response.setQuoteOfId(post.getQuoteOfId());
        response.setVisibility(post.getVisibility());
        response.setIsDeleted(post.getIsDeleted());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        
        if (user != null) {
            UserInfo userInfo = new UserInfo();
            userInfo.setId(user.getId());
            userInfo.setUsername(user.getUsername());
            userInfo.setDisplayName(user.getDisplayName());
            userInfo.setProfileImageUrl(user.getProfileImageUrl());
            response.setUser(userInfo);
        }
        
        return response;
    }
}
