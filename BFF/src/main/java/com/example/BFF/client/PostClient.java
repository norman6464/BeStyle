package com.example.BFF.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "post", url = "${services.post.url:http://localhost:8082}")
public interface PostClient {

    @GetMapping("/api/posts/{id}")
    Object getPostById(@PathVariable("id") Integer id);

    @GetMapping("/api/posts/user/{userId}")
    Object getPostsByUserId(@PathVariable("userId") Integer userId);

    @PostMapping("/api/posts")
    Object createPost(@RequestBody Object postRequest);

    @PutMapping("/api/posts/{id}")
    Object updatePost(@PathVariable("id") Integer id, @RequestBody Object postRequest);

    @DeleteMapping("/api/posts/{id}")
    void deletePost(@PathVariable("id") Integer id);

    @PostMapping("/api/posts/{postId}/likes")
    Object likePost(@PathVariable("postId") Integer postId, @RequestBody Object likeRequest);

    @DeleteMapping("/api/posts/{postId}/likes/{userId}")
    void unlikePost(@PathVariable("postId") Integer postId, @PathVariable("userId") Integer userId);

    @PostMapping("/api/posts/{postId}/bookmarks")
    Object bookmarkPost(@PathVariable("postId") Integer postId, @RequestBody Object bookmarkRequest);

    @DeleteMapping("/api/posts/{postId}/bookmarks/{userId}")
    void unbookmarkPost(@PathVariable("postId") Integer postId, @PathVariable("userId") Integer userId);
}
