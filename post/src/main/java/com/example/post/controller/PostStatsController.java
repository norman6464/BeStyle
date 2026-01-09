package com.example.post.controller;

import com.example.post.entity.PostStats;
import com.example.post.service.PostStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/posts/{postId}/stats")
@RequiredArgsConstructor
public class PostStatsController {

    private final PostStatsService postStatsService;

    /**
     * 投稿統計を取得
     */
    @GetMapping
    public ResponseEntity<PostStats> getPostStats(@PathVariable Integer postId) {
        Optional<PostStats> stats = postStatsService.getPostStats(postId);
        return stats.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 投稿統計を更新
     */
    @PutMapping
    public ResponseEntity<PostStats> updatePostStats(@PathVariable Integer postId, @RequestBody PostStats stats) {
        try {
            PostStats updatedStats = postStatsService.updatePostStats(postId, stats);
            return ResponseEntity.ok(updatedStats);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 閲覧数を増加
     */
    @PostMapping("/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Integer postId) {
        postStatsService.incrementViewCount(postId);
        return ResponseEntity.ok().build();
    }
}
