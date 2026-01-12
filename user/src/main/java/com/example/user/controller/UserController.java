package com.example.user.controller;

import com.example.user.entity.User;
import com.example.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * ユーザーをIDで取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.getUser(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ユーザーをユーザー名で取得
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ユーザーをCognitoサブで取得
     */
    @GetMapping("/cognito/{cognitoSub}")
    public ResponseEntity<User> getUserByCognitoSub(@PathVariable String cognitoSub) {
        Optional<User> user = userService.getUserByCognitoSub(cognitoSub);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ユーザーを作成
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // ユニーク制約違反の場合、既存ユーザーを返す
            if (e.getMessage().contains("username")) {
                Optional<User> existingUser = userService.getUserByUsername(user.getUsername());
                if (existingUser.isPresent()) {
                    return ResponseEntity.ok(existingUser.get());
                }
            }
            if (e.getMessage().contains("email")) {
                Optional<User> existingUser = userService.getUserByEmail(user.getEmail());
                if (existingUser.isPresent()) {
                    return ResponseEntity.ok(existingUser.get());
                }
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * ユーザーを更新
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * ユーザーを削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
