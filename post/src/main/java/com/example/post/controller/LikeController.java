package com.example.post.controller;

import com.example.post.entity.Like;
import com.example.post.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    /**
     * いいねを追加
     */
    @PostMapping
    public ResponseEntity<Like> likePost(@PathVariable Integer postId, @RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }
            Like like = likeService.likePost(postId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(like);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * いいねを削除
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unlikePost(@PathVariable Integer postId, @PathVariable Integer userId) {
        try {
            likeService.unlikePost(postId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
