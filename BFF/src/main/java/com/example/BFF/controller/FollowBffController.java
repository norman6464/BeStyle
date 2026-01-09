package com.example.BFF.controller;

import com.example.BFF.client.FollowClient;
import com.example.BFF.client.UserClient;
import com.example.BFF.dto.FollowDto;
import com.example.BFF.dto.FollowRequestDto;
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
 * BFF側のフォローコントローラー
 * API GatewayとしてFollowServiceへアクセス
 */
@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowBffController {

    private final FollowClient followClient;
    private final UserClient userClient;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * フォロー関係を作成
     */
    @PostMapping
    public ResponseEntity<FollowDto> followUser(@RequestBody Map<String, Integer> request) {
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // リクエストからfollowingIdを取得し、followerIdは現在のユーザーIDを使用
            Integer followingId = request.get("followingId");
            if (followingId == null) {
                return ResponseEntity.badRequest().build();
            }

            UserDto currentUser = userClient.getUserByCognitoSub(currentCognitoSub.get());
            Map<String, Integer> followRequest = Map.of(
                "followerId", currentUser.getId(),
                "followingId", followingId
            );

            FollowDto follow = followClient.followUser(followRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(follow);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * フォローを解除
     */
    @DeleteMapping("/{followingId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable Integer followingId) {
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto currentUser = userClient.getUserByCognitoSub(currentCognitoSub.get());
            followClient.unfollowUser(currentUser.getId(), followingId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * フォロワー一覧を取得
     */
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<FollowDto>> getFollowers(@PathVariable Integer userId) {
        try {
            List<FollowDto> followers = followClient.getFollowers(userId);
            return ResponseEntity.ok(followers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * フォロー中一覧を取得
     */
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<FollowDto>> getFollowing(@PathVariable Integer userId) {
        try {
            List<FollowDto> following = followClient.getFollowing(userId);
            return ResponseEntity.ok(following);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * フォロー関係を確認
     */
    @GetMapping("/{followerId}/{followingId}")
    public ResponseEntity<FollowDto> checkFollowStatus(
            @PathVariable Integer followerId,
            @PathVariable Integer followingId) {
        try {
            FollowDto follow = followClient.checkFollowStatus(followerId, followingId);
            return ResponseEntity.ok(follow);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
