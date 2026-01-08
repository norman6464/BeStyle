package com.example.BFF.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user", url = "${services.user.url:http://localhost:8081}")
public interface UserClient {

    @GetMapping("/api/users/{id}")
    Object getUserById(@PathVariable("id") Integer id);

    @GetMapping("/api/users/username/{username}")
    Object getUserByUsername(@PathVariable("username") String username);

    @GetMapping("/api/users/cognito/{cognitoSub}")
    Object getUserByCognitoSub(@PathVariable("cognitoSub") String cognitoSub);

    @PostMapping("/api/users")
    Object createUser(@RequestBody Object userRequest);

    @PutMapping("/api/users/{id}")
    Object updateUser(@PathVariable("id") Integer id, @RequestBody Object userRequest);

    @DeleteMapping("/api/users/{id}")
    void deleteUser(@PathVariable("id") Integer id);
}
