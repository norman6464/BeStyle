package com.example.BFF.client;

import com.example.BFF.dto.PostDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "post", url = "${services.post.url:http://localhost:8080}")
public interface PostClient {

    @GetMapping("/api/posts/timeline")
    Object getTimeline(@RequestParam("page") int page, @RequestParam("size") int size);

    @GetMapping("/api/posts/{id}")
    PostDto getPostById(@PathVariable("id") Integer id);

    @GetMapping("/api/posts/user/{userId}")
    List<PostDto> getPostsByUserId(@PathVariable("userId") Integer userId);

    @PostMapping("/api/posts")
    PostDto createPost(@RequestBody PostDto postRequest);

    @PutMapping("/api/posts/{id}")
    PostDto updatePost(@PathVariable("id") Integer id, @RequestBody PostDto postRequest);

    @DeleteMapping("/api/posts/{id}")
    void deletePost(@PathVariable("id") Integer id);

    @PostMapping("/api/posts/{postId}/likes")
    Object likePost(@PathVariable("postId") Integer postId, @RequestBody Map<String, Integer> likeRequest);

    @DeleteMapping("/api/posts/{postId}/likes/{userId}")
    void unlikePost(@PathVariable("postId") Integer postId, @PathVariable("userId") Integer userId);

    @PostMapping("/api/posts/{postId}/bookmarks")
    Object bookmarkPost(@PathVariable("postId") Integer postId, @RequestBody Map<String, Integer> bookmarkRequest);

    @DeleteMapping("/api/posts/{postId}/bookmarks/{userId}")
    void unbookmarkPost(@PathVariable("postId") Integer postId, @PathVariable("userId") Integer userId);
}
