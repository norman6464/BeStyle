package com.example.BFF.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "follow", url = "${services.follow.url:http://localhost:8083}")
public interface FollowClient {

    @PostMapping("/api/follows")
    Object followUser(@RequestBody Object followRequest);

    @DeleteMapping("/api/follows/{followerId}/{followingId}")
    void unfollowUser(@PathVariable("followerId") Integer followerId, @PathVariable("followingId") Integer followingId);

    @GetMapping("/api/follows/followers/{userId}")
    Object getFollowers(@PathVariable("userId") Integer userId);

    @GetMapping("/api/follows/following/{userId}")
    Object getFollowing(@PathVariable("userId") Integer userId);

    @GetMapping("/api/follows/{followerId}/{followingId}")
    Object checkFollowStatus(@PathVariable("followerId") Integer followerId, @PathVariable("followingId") Integer followingId);

    @PostMapping("/api/follow-requests")
    Object createFollowRequest(@RequestBody Object followRequestRequest);

    @PutMapping("/api/follow-requests/{id}")
    Object updateFollowRequest(@PathVariable("id") Integer id, @RequestBody Object followRequestRequest);

    @DeleteMapping("/api/follow-requests/{id}")
    void deleteFollowRequest(@PathVariable("id") Integer id);
}
