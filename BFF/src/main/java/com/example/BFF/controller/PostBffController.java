package com.example.BFF.controller;

import com.example.BFF.client.PostClient;
import com.example.BFF.client.UserClient;
import com.example.BFF.dto.CreatePostRequest;
import com.example.BFF.dto.PostDto;
import com.example.BFF.dto.PostResponseDto;
import com.example.BFF.dto.UserDto;
import com.example.BFF.filter.SessionAuthenticationFilter.SessionUserPrincipal;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * BFF側の投稿コントローラー
 * API GatewayとしてPostServiceへアクセス
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostBffController {

    private final PostClient postClient;
    private final UserClient userClient;
    private final ObjectMapper objectMapper;

    /**
     * タイムラインを取得（ユーザー情報を含む）
     */
    @GetMapping("/timeline")
    public ResponseEntity<Object> getTimeline(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Object timeline = postClient.getTimeline(page, size);
            
            // タイムラインのレスポンスをパース
            JsonNode timelineNode = objectMapper.valueToTree(timeline);
            JsonNode contentNode = timelineNode.get("content");
            
            if (contentNode != null && contentNode.isArray()) {
                List<PostResponseDto> postsWithUsers = new ArrayList<>();
                
                for (JsonNode postNode : contentNode) {
                    PostDto post = objectMapper.treeToValue(postNode, PostDto.class);
                    
                    // ユーザー情報を取得
                    UserDto user = null;
                    try {
                        if (post.getUserId() != null) {
                            user = userClient.getUserById(post.getUserId());
                        }
                    } catch (Exception e) {
                        // ユーザーが見つからない場合はnullのまま
                        System.err.println("Failed to fetch user " + post.getUserId() + ": " + e.getMessage());
                    }
                    
                    postsWithUsers.add(PostResponseDto.from(post, user));
                }
                
                // ページ情報を保持したまま返す
                Map<String, Object> response = Map.of(
                    "content", postsWithUsers,
                    "pageable", timelineNode.get("pageable"),
                    "totalPages", timelineNode.get("totalPages"),
                    "totalElements", timelineNode.get("totalElements"),
                    "last", timelineNode.get("last"),
                    "size", timelineNode.get("size"),
                    "number", timelineNode.get("number"),
                    "sort", timelineNode.get("sort"),
                    "numberOfElements", timelineNode.get("numberOfElements"),
                    "first", timelineNode.get("first"),
                    "empty", timelineNode.get("empty")
                );
                
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.ok(timeline);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 投稿をIDで取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Integer id) {
        try {
            PostDto post = postClient.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * ユーザーの投稿一覧を取得
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getPostsByUserId(@PathVariable Integer userId) {
        try {
            List<PostDto> posts = postClient.getPostsByUserId(userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 投稿を作成（ユーザー情報を含む）
     */
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@RequestBody CreatePostRequest request) {
        // セッションからユーザーIDを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SessionUserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SessionUserPrincipal principal = (SessionUserPrincipal) authentication.getPrincipal();
        Integer userId = principal.userId();

        try {
            PostDto postDto = new PostDto();
            postDto.setUserId(userId);
            postDto.setContent(request.getContent());
            postDto.setReplyToId(request.getReplyToId());
            postDto.setRepostOfId(request.getRepostOfId());
            postDto.setQuoteOfId(request.getQuoteOfId());
            postDto.setVisibility(request.getVisibility() != null ? request.getVisibility() : "PUBLIC");

            PostDto createdPost = postClient.createPost(postDto);
            
            // ユーザー情報を取得して結合
            UserDto user = null;
            try {
                user = userClient.getUserById(userId);
            } catch (Exception e) {
                System.err.println("Failed to fetch user " + userId + ": " + e.getMessage());
            }
            
            PostResponseDto response = PostResponseDto.from(createdPost, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 投稿を更新
     */
    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable Integer id, @RequestBody PostDto postDto) {
        // セッションからユーザーIDを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SessionUserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SessionUserPrincipal principal = (SessionUserPrincipal) authentication.getPrincipal();
        Integer userId = principal.userId();

        try {
            PostDto existingPost = postClient.getPostById(id);
            
            if (!existingPost.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            PostDto updatedPost = postClient.updatePost(id, postDto);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 投稿を削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer id) {
        // セッションからユーザーIDを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SessionUserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SessionUserPrincipal principal = (SessionUserPrincipal) authentication.getPrincipal();
        Integer userId = principal.userId();

        try {
            PostDto existingPost = postClient.getPostById(id);
            
            if (!existingPost.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            postClient.deletePost(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * いいねを追加
     */
    @PostMapping("/{postId}/likes")
    public ResponseEntity<Object> likePost(@PathVariable Integer postId) {
        // セッションからユーザーIDを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SessionUserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SessionUserPrincipal principal = (SessionUserPrincipal) authentication.getPrincipal();
        Integer userId = principal.userId();

        try {
            Map<String, Integer> likeRequest = Map.of("userId", userId);
            Object result = postClient.likePost(postId, likeRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * いいねを削除
     */
    @DeleteMapping("/{postId}/likes")
    public ResponseEntity<Void> unlikePost(@PathVariable Integer postId) {
        // セッションからユーザーIDを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SessionUserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SessionUserPrincipal principal = (SessionUserPrincipal) authentication.getPrincipal();
        Integer userId = principal.userId();

        try {
            postClient.unlikePost(postId, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * ブックマークを追加
     */
    @PostMapping("/{postId}/bookmarks")
    public ResponseEntity<Object> bookmarkPost(@PathVariable Integer postId) {
        // セッションからユーザーIDを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SessionUserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SessionUserPrincipal principal = (SessionUserPrincipal) authentication.getPrincipal();
        Integer userId = principal.userId();

        try {
            Map<String, Integer> bookmarkRequest = Map.of("userId", userId);
            Object result = postClient.bookmarkPost(postId, bookmarkRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * ブックマークを削除
     */
    @DeleteMapping("/{postId}/bookmarks")
    public ResponseEntity<Void> unbookmarkPost(@PathVariable Integer postId) {
        // セッションからユーザーIDを取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SessionUserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SessionUserPrincipal principal = (SessionUserPrincipal) authentication.getPrincipal();
        Integer userId = principal.userId();

        try {
            postClient.unbookmarkPost(postId, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
