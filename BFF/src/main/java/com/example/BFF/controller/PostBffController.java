package com.example.BFF.controller;

import com.example.BFF.client.PostClient;
import com.example.BFF.client.UserClient;
import com.example.BFF.dto.CreatePostRequest;
import com.example.BFF.dto.PostDto;
import com.example.BFF.dto.UserDto;
import com.example.BFF.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private final JwtTokenUtil jwtTokenUtil;

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
     * 投稿を作成
     */
    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody CreatePostRequest request) {
        // JWTトークンからユーザーIDを取得
        Optional<String> cognitoSub = jwtTokenUtil.getCurrentUserId();
        if (cognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // Cognito Subからユーザー情報を取得してuserIdを取得
            UserDto user = userClient.getUserByCognitoSub(cognitoSub.get());
            
            PostDto postDto = new PostDto();
            postDto.setUserId(user.getId());
            postDto.setContent(request.getContent());
            postDto.setReplyToId(request.getReplyToId());
            postDto.setRepostOfId(request.getRepostOfId());
            postDto.setQuoteOfId(request.getQuoteOfId());
            postDto.setVisibility(request.getVisibility() != null ? request.getVisibility() : "PUBLIC");

            PostDto createdPost = postClient.createPost(postDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 投稿を更新
     */
    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable Integer id, @RequestBody PostDto postDto) {
        // 認可チェック: 自分の投稿のみ更新可能
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            PostDto existingPost = postClient.getPostById(id);
            UserDto user = userClient.getUserByCognitoSub(currentCognitoSub.get());
            
            if (!existingPost.getUserId().equals(user.getId())) {
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
        // 認可チェック: 自分の投稿のみ削除可能
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            PostDto existingPost = postClient.getPostById(id);
            UserDto user = userClient.getUserByCognitoSub(currentCognitoSub.get());
            
            if (!existingPost.getUserId().equals(user.getId())) {
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
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto user = userClient.getUserByCognitoSub(currentCognitoSub.get());
            Map<String, Integer> likeRequest = Map.of("userId", user.getId());
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
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto user = userClient.getUserByCognitoSub(currentCognitoSub.get());
            postClient.unlikePost(postId, user.getId());
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
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto user = userClient.getUserByCognitoSub(currentCognitoSub.get());
            Map<String, Integer> bookmarkRequest = Map.of("userId", user.getId());
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
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto user = userClient.getUserByCognitoSub(currentCognitoSub.get());
            postClient.unbookmarkPost(postId, user.getId());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
