package com.example.BFF.controller;

import com.example.BFF.dto.UserDto;
import com.example.BFF.dto.auth.*;
import com.example.BFF.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * 認証コントローラー
 * ログイン、サインアップ、ログアウトなどの認証エンドポイントを提供
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    @Value("${session.cookie-name:BESTYLE_SESSION}")
    private String sessionCookieName;

    /**
     * ログインページへのリダイレクトURL取得
     * フロントエンドはこのURLにリダイレクトしてCognito Hosted UIでログイン
     */
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> getLoginUrl() {
        String state = UUID.randomUUID().toString();
        String loginUrl = authService.getLoginUrl(state);
        
        log.debug("ログインURL生成: {}", loginUrl);
        
        return ResponseEntity.ok(Map.of(
            "loginUrl", loginUrl,
            "state", state
        ));
    }

    /**
     * サインアップページへのリダイレクトURL取得
     * フロントエンドはこのURLにリダイレクトしてCognito Hosted UIでサインアップ
     */
    @GetMapping("/signup")
    public ResponseEntity<Map<String, String>> getSignupUrl() {
        String state = UUID.randomUUID().toString();
        String signupUrl = authService.getSignupUrl(state);
        
        log.debug("サインアップURL生成: {}", signupUrl);
        
        return ResponseEntity.ok(Map.of(
            "signupUrl", signupUrl,
            "state", state
        ));
    }

    /**
     * 認証コードコールバック処理
     * Cognitoからの認証コードを受け取り、トークンに交換してセッションを作成
     */
    @PostMapping("/callback")
    public ResponseEntity<AuthResponse> handleCallback(
            @RequestBody AuthCodeCallbackRequest request,
            HttpServletResponse response) {
        
        log.debug("認証コードコールバック受信: code={}", 
            request.getCode() != null ? request.getCode().substring(0, 10) + "..." : "null");
        
        if (request.getCode() == null || request.getCode().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.error("認証コードが必要です"));
        }

        AuthResponse authResponse = authService.exchangeCodeForTokens(
            request.getCode(), 
            response
        );
        
        if (authResponse.isSuccess()) {
            return ResponseEntity.ok(authResponse);
        } else {
            return ResponseEntity.badRequest().body(authResponse);
        }
    }

    /**
     * 認証コードコールバック処理（GETリクエスト対応）
     * Cognitoから直接リダイレクトされた場合に対応
     */
    @GetMapping("/callback")
    public void handleCallbackGet(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @RequestParam(required = false, name = "error_description") String errorDescription,
            HttpServletResponse response) throws IOException {
        
        if (error != null) {
            log.error("Cognitoからエラーが返されました: error={}, description={}", error, errorDescription);
            response.sendRedirect("http://localhost:5173/login?error=" + error);
            return;
        }

        if (code == null || code.isEmpty()) {
            response.sendRedirect("http://localhost:5173/login?error=no_code");
            return;
        }

        // フロントエンドにリダイレクト（フロントエンドがPOSTでコードを送信する）
        response.sendRedirect("http://localhost:5173/login/callback?code=" + code + "&state=" + state);
    }

    /**
     * 現在のユーザー情報を取得
     */
    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(HttpServletRequest request) {
        String sessionId = getSessionIdFromCookie(request);
        
        if (sessionId == null) {
            return ResponseEntity.ok(CurrentUserResponse.notAuthenticated());
        }

        Optional<UserDto> userOpt = authService.getCurrentUser(sessionId);
        
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(CurrentUserResponse.authenticated(userOpt.get()));
        } else {
            return ResponseEntity.ok(CurrentUserResponse.notAuthenticated());
        }
    }

    /**
     * セッションの検証
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateSession(HttpServletRequest request) {
        String sessionId = getSessionIdFromCookie(request);
        boolean isValid = authService.validateSession(sessionId);
        
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    /**
     * ログアウト処理
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        
        String sessionId = getSessionIdFromCookie(request);
        authService.logout(sessionId, response);
        
        log.info("ユーザーがログアウトしました: sessionId={}", 
            sessionId != null ? sessionId.substring(0, 8) + "..." : "null");
        
        // Cognitoからもログアウトするためのリダイレクト用URLを返す
        String cognitoLogoutUrl = authService.getCognitoLogoutUrl("http://localhost:5173");
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "ログアウトしました",
            "cognitoLogoutUrl", cognitoLogoutUrl
        ));
    }

    /**
     * トークンのリフレッシュ
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(HttpServletRequest request) {
        String sessionId = getSessionIdFromCookie(request);
        
        if (sessionId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "セッションがありません"));
        }

        boolean refreshed = authService.refreshSession(sessionId);
        
        if (refreshed) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "トークンをリフレッシュしました"
            ));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "トークンのリフレッシュに失敗しました"));
        }
    }

    /**
     * Cookieからセッションを取得
     */
    private String getSessionIdFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (sessionCookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
