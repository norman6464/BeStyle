package com.example.BFF.client;

import com.example.BFF.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
    name = "bestyle-user",
    url = "http://bestyle-user-8080-tcp.bestyle-service-connect:8080"
)
public interface UserClient {

    @GetMapping("/api/users/{id}")
    UserDto getUserById(@PathVariable("id") Integer id);

    @GetMapping("/api/users/username/{username}")
    UserDto getUserByUsername(@PathVariable("username") String username);

    @GetMapping("/api/users/cognito/{cognitoSub}")
    UserDto getUserByCognitoSub(@PathVariable("cognitoSub") String cognitoSub);

    @PostMapping("/api/users")
    UserDto createUser(@RequestBody UserDto userRequest);

    @PutMapping("/api/users/{id}")
    UserDto updateUser(@PathVariable("id") Integer id, @RequestBody UserDto userRequest);

    @DeleteMapping("/api/users/{id}")
    void deleteUser(@PathVariable("id") Integer id);
}
