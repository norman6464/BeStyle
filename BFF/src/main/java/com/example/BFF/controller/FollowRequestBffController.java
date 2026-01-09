package com.example.BFF.controller;

import com.example.BFF.client.FollowClient;
import com.example.BFF.client.UserClient;
import com.example.BFF.dto.FollowRequestDto;
import com.example.BFF.dto.UserDto;
import com.example.BFF.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * BFF側のフォローリクエストコントローラー
 * API GatewayとしてFollowServiceへアクセス
 */
@RestController
@RequestMapping("/api/follow-requests")
@RequiredArgsConstructor
public class FollowRequestBffController {

    private final FollowClient followClient;
    private final UserClient userClient;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * フォローリクエストを作成
     */
    @PostMapping
    public ResponseEntity<FollowRequestDto> createFollowRequest(@RequestBody Map<String, Integer> request) {
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Integer targetId = request.get("targetId");
            if (targetId == null) {
                return ResponseEntity.badRequest().build();
            }

            UserDto currentUser = userClient.getUserByCognitoSub(currentCognitoSub.get());
            Map<String, Integer> followRequestRequest = Map.of(
                "requesterId", currentUser.getId(),
                "targetId", targetId
            );

            FollowRequestDto followRequest = followClient.createFollowRequest(followRequestRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(followRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * フォローリクエストを承認/拒否
     */
    @PutMapping("/{id}")
    public ResponseEntity<FollowRequestDto> updateFollowRequest(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String status = request.get("status");
            if (status == null || (!status.equals("ACCEPTED") && !status.equals("REJECTED"))) {
                return ResponseEntity.badRequest().build();
            }

            Map<String, String> updateRequest = Map.of("status", status);
            FollowRequestDto updatedRequest = followClient.updateFollowRequest(id, updateRequest);
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * フォローリクエストを削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowRequest(@PathVariable Integer id) {
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            followClient.deleteFollowRequest(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
