package com.example.BFF.controller;

import com.example.BFF.client.UserClient;
import com.example.BFF.dto.CreateUserRequest;
import com.example.BFF.dto.UserDto;
import com.example.BFF.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * BFF側のユーザーコントローラー
 * API GatewayとしてUserServiceへアクセス
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserBffController {

    private final UserClient userClient;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * ユーザーをIDで取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer id) {
        try {
            UserDto user = userClient.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * ユーザーをユーザー名で取得
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        try {
            UserDto user = userClient.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 現在のユーザー情報を取得（JWTトークンから）
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        Optional<String> cognitoSub = jwtTokenUtil.getCurrentUserId();
        if (cognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto user = userClient.getUserByCognitoSub(cognitoSub.get());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * ユーザーを作成
     * JWTトークンからCognito Subを取得して作成
     */
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest request) {
        // JWTトークンから情報を取得
        Optional<String> cognitoSub = jwtTokenUtil.getCurrentUserId();
        Optional<String> username = jwtTokenUtil.getCurrentUsername();
        Optional<String> email = jwtTokenUtil.getCurrentEmail();

        if (cognitoSub.isEmpty() || username.isEmpty() || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto userDto = new UserDto();
            userDto.setCognitoSub(cognitoSub.get());
            userDto.setUsername(request.getUsername() != null ? request.getUsername() : username.get());
            userDto.setEmail(email.get());
            userDto.setDisplayName(request.getDisplayName() != null ? request.getDisplayName() : username.get());
            userDto.setBio(request.getBio());

            UserDto createdUser = userClient.createUser(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * ユーザーを更新
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Integer id, @RequestBody UserDto userDto) {
        // 認可チェック: 自分のアカウントのみ更新可能
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto existingUser = userClient.getUserById(id);
            if (!existingUser.getCognitoSub().equals(currentCognitoSub.get())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            UserDto updatedUser = userClient.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * ユーザーを削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        // 認可チェック: 自分のアカウントのみ削除可能
        Optional<String> currentCognitoSub = jwtTokenUtil.getCurrentUserId();
        if (currentCognitoSub.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserDto existingUser = userClient.getUserById(id);
            if (!existingUser.getCognitoSub().equals(currentCognitoSub.get())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            userClient.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
