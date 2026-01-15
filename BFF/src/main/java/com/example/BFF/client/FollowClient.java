package com.example.BFF.client;

import com.example.BFF.dto.FollowDto;
import com.example.BFF.dto.FollowRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(
    name = "bestyle-follow",
    url = "http://bestyle-follow-8083-tcp.bestyle-service-connect:8083"
)
public interface FollowClient {

    @PostMapping("/api/follows")
    FollowDto followUser(@RequestBody Map<String, Integer> followRequest);

    @DeleteMapping("/api/follows/{followerId}/{followingId}")
    void unfollowUser(@PathVariable("followerId") Integer followerId, @PathVariable("followingId") Integer followingId);

    @GetMapping("/api/follows/followers/{userId}")
    List<FollowDto> getFollowers(@PathVariable("userId") Integer userId);

    @GetMapping("/api/follows/following/{userId}")
    List<FollowDto> getFollowing(@PathVariable("userId") Integer userId);

    @GetMapping("/api/follows/{followerId}/{followingId}")
    FollowDto checkFollowStatus(@PathVariable("followerId") Integer followerId, @PathVariable("followingId") Integer followingId);

    @PostMapping("/api/follow-requests")
    FollowRequestDto createFollowRequest(@RequestBody Map<String, Integer> followRequestRequest);

    @PutMapping("/api/follow-requests/{id}")
    FollowRequestDto updateFollowRequest(@PathVariable("id") Integer id, @RequestBody Map<String, String> followRequestRequest);

    @DeleteMapping("/api/follow-requests/{id}")
    void deleteFollowRequest(@PathVariable("id") Integer id);
}
