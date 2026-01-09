package com.example.follow.controller;

import com.example.follow.entity.Follow;
import com.example.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    /**
     * フォロー関係を作成
     */
    @PostMapping
    public ResponseEntity<Follow> followUser(@RequestBody Map<String, Integer> request) {
        try {
            Integer followerId = request.get("followerId");
            Integer followingId = request.get("followingId");
            if (followerId == null || followingId == null) {
                return ResponseEntity.badRequest().build();
            }
            Follow follow = followService.follow(followerId, followingId);
            return ResponseEntity.status(HttpStatus.CREATED).body(follow);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * フォローを解除
     */
    @DeleteMapping("/{followerId}/{followingId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable Integer followerId, @PathVariable Integer followingId) {
        try {
            followService.unfollow(followerId, followingId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * フォロワー一覧を取得
     */
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<Follow>> getFollowers(@PathVariable Integer userId) {
        List<Follow> followers = followService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    /**
     * フォロー中一覧を取得
     */
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<Follow>> getFollowing(@PathVariable Integer userId) {
        List<Follow> following = followService.getFollowing(userId);
        return ResponseEntity.ok(following);
    }

    /**
     * フォロー関係を確認
     */
    @GetMapping("/{followerId}/{followingId}")
    public ResponseEntity<Follow> checkFollowStatus(@PathVariable Integer followerId, @PathVariable Integer followingId) {
        Optional<Follow> follow = followService.getFollow(followerId, followingId);
        return follow.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
