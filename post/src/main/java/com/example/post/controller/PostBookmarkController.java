package com.example.post.controller;

import com.example.post.entity.PostBookmark;
import com.example.post.service.PostBookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/bookmarks")
@RequiredArgsConstructor
public class PostBookmarkController {

    private final PostBookmarkService postBookmarkService;

    /**
     * ブックマークを追加
     */
    @PostMapping
    public ResponseEntity<PostBookmark> bookmarkPost(@PathVariable Integer postId, @RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }
            PostBookmark bookmark = postBookmarkService.bookmarkPost(postId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(bookmark);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * ブックマークを削除
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unbookmarkPost(@PathVariable Integer postId, @PathVariable Integer userId) {
        try {
            postBookmarkService.unbookmarkPost(postId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
