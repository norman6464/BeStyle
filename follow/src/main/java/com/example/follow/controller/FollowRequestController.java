package com.example.follow.controller;

import com.example.follow.entity.FollowRequest;
import com.example.follow.service.FollowRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/follow-requests")
@RequiredArgsConstructor
public class FollowRequestController {

    private final FollowRequestService followRequestService;

    /**
     * フォローリクエストを作成
     */
    @PostMapping
    public ResponseEntity<FollowRequest> createFollowRequest(@RequestBody Map<String, Integer> request) {
        try {
            Integer requesterId = request.get("requesterId");
            Integer targetId = request.get("targetId");
            if (requesterId == null || targetId == null) {
                return ResponseEntity.badRequest().build();
            }
            FollowRequest followRequest = followRequestService.createFollowRequest(requesterId, targetId);
            return ResponseEntity.status(HttpStatus.CREATED).body(followRequest);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * フォローリクエストを更新（承認/拒否）
     */
    @PutMapping("/{id}")
    public ResponseEntity<FollowRequest> updateFollowRequest(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().build();
            }
            
            FollowRequest updatedRequest;
            if ("ACCEPTED".equals(status)) {
                updatedRequest = followRequestService.acceptFollowRequest(id);
            } else if ("REJECTED".equals(status)) {
                updatedRequest = followRequestService.rejectFollowRequest(id);
            } else {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.ok(updatedRequest);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * フォローリクエストを削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowRequest(@PathVariable Integer id) {
        try {
            followRequestService.deleteFollowRequest(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
