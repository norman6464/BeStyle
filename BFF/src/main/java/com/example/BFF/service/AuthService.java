package com.example.BFF.service;

import com.example.BFF.config.CognitoConfig;
import com.example.BFF.config.SessionConfig;
import com.example.BFF.client.UserClient;
import com.example.BFF.dto.UserDto;
import com.example.BFF.dto.auth.*;
import com.example.BFF.entity.UserSession;
import com.example.BFF.repository.UserSessionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * 認証サービス
 * Cognito認証、セッション管理を担当
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final CognitoConfig cognitoConfig;
    private final SessionConfig sessionConfig;
    private final UserSessionRepository sessionRepository;
    private final UserClient userClient;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Cognito Hosted UIのログインURLを生成
     */
    public String getLoginUrl(String state) {
        return String.format(
            "%s?response_type=code&client_id=%s&redirect_uri=%s&scope=openid+email+profile&state=%s",
            cognitoConfig.getAuthorizationEndpoint(),
            cognitoConfig.getClientId(),
            cognitoConfig.getRedirectUri(),
            state
        );
    }

    /**
     * Cognito Hosted UIのサインアップURLを生成
     */
    public String getSignupUrl(String state) {
        return String.format(
            "%s?response_type=code&client_id=%s&redirect_uri=%s&scope=openid+email+profile&state=%s",
            cognitoConfig.getSignupEndpoint(),
            cognitoConfig.getClientId(),
            cognitoConfig.getRedirectUri(),
            state
        );
    }

    /**
     * 認証コードをトークンに交換
     */
    @Transactional
    public AuthResponse exchangeCodeForTokens(String code, HttpServletResponse response) {
        try {
            // Cognitoのトークンエンドポイントにリクエスト
            CognitoTokenResponse tokenResponse = requestTokens(code);
            
            if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
                return AuthResponse.error("トークンの取得に失敗しました");
            }

            // IDトークンからユーザー情報を抽出
            Map<String, Object> claims = parseIdToken(tokenResponse.getIdToken());
            String cognitoSub = (String) claims.get("sub");
            String email = (String) claims.get("email");
            String username = (String) claims.getOrDefault("cognito:username", email);

            // userサービスからユーザー情報を取得または作成
            UserDto user = getOrCreateUser(cognitoSub, username, email);

            // セッションを作成
            String sessionId = createSession(user, cognitoSub, tokenResponse);

            // httpOnly Cookieをセット
            setSessionCookie(response, sessionId);

            log.info("ユーザーがログインしました: userId={}, username={}", user.getId(), user.getUsername());
            
            return AuthResponse.success(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName()
            );

        } catch (Exception e) {
            log.error("認証コードの交換中にエラーが発生しました", e);
            return AuthResponse.error("認証処理中にエラーが発生しました: " + e.getMessage());
        }
    }

    /**
     * Cognitoトークンエンドポイントにリクエスト
     */
    private CognitoTokenResponse requestTokens(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        // Basic認証ヘッダーを設定
        String credentials = cognitoConfig.getClientId() + ":" + cognitoConfig.getClientSecret();
        String encodedCredentials = Base64.getEncoder()
                .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedCredentials);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", cognitoConfig.getRedirectUri());
        body.add("client_id", cognitoConfig.getClientId());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<CognitoTokenResponse> response = restTemplate.exchange(
                cognitoConfig.getTokenUri(),
                HttpMethod.POST,
                request,
                CognitoTokenResponse.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("トークンリクエストに失敗しました", e);
            throw new RuntimeException("トークンの取得に失敗しました", e);
        }
    }

    /**
     * IDトークンをパース（JWT）
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseIdToken(String idToken) {
        try {
            String[] parts = idToken.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT format");
            }
            
            String payload = new String(
                Base64.getUrlDecoder().decode(parts[1]),
                StandardCharsets.UTF_8
            );
            
            return objectMapper.readValue(payload, Map.class);
        } catch (Exception e) {
            log.error("IDトークンのパースに失敗しました", e);
            throw new RuntimeException("IDトークンのパースに失敗しました", e);
        }
    }

    /**
     * ユーザーを取得または作成
     */
    private UserDto getOrCreateUser(String cognitoSub, String username, String email) {
        try {
            // まずCognito Subでユーザーを検索
            return userClient.getUserByCognitoSub(cognitoSub);
        } catch (Exception e) {
            log.info("ユーザーが見つからないため、新規作成します: cognitoSub={}", cognitoSub);
            
            // 新規ユーザーを作成
            UserDto newUser = new UserDto();
            newUser.setCognitoSub(cognitoSub);
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setDisplayName(username);
            
            return userClient.createUser(newUser);
        }
    }

    /**
     * セッションを作成
     */
    private String createSession(UserDto user, String cognitoSub, CognitoTokenResponse tokenResponse) {
        // 既存のセッションがあれば削除
        sessionRepository.deleteByCognitoSub(cognitoSub);

        // 新しいセッションIDを生成
        String sessionId = UUID.randomUUID().toString();

        // セッション有効期限を計算
        LocalDateTime expiresAt = LocalDateTime.now()
                .plusHours(sessionConfig.getExpiryHours());

        // セッションを保存
        UserSession session = UserSession.builder()
                .sessionId(sessionId)
                .userId(user.getId())
                .cognitoSub(cognitoSub)
                .accessToken(tokenResponse.getAccessToken())
                .refreshToken(tokenResponse.getRefreshToken())
                .idToken(tokenResponse.getIdToken())
                .expiresAt(expiresAt)
                .build();

        sessionRepository.save(session);
        
        return sessionId;
    }

    /**
     * httpOnly Cookieをセット
     */
    private void setSessionCookie(HttpServletResponse response, String sessionId) {
        Cookie cookie = new Cookie(sessionConfig.getCookieName(), sessionId);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 本番環境ではtrueに設定
        cookie.setPath("/");
        cookie.setMaxAge(sessionConfig.getExpiryHours() * 60 * 60);
        // SameSite=Lax設定（CSRF対策）
        response.addHeader("Set-Cookie", 
            String.format("%s=%s; HttpOnly; Path=/; Max-Age=%d; SameSite=Lax",
                sessionConfig.getCookieName(),
                sessionId,
                sessionConfig.getExpiryHours() * 60 * 60
            )
        );
    }

    /**
     * セッションIDからユーザー情報を取得
     */
    public Optional<UserDto> getCurrentUser(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            return Optional.empty();
        }

        Optional<UserSession> sessionOpt = sessionRepository
                .findValidSession(sessionId, LocalDateTime.now());

        if (sessionOpt.isEmpty()) {
            return Optional.empty();
        }

        UserSession session = sessionOpt.get();
        
        try {
            UserDto user = userClient.getUserById(session.getUserId());
            return Optional.of(user);
        } catch (Exception e) {
            log.error("ユーザー情報の取得に失敗しました: userId={}", session.getUserId(), e);
            return Optional.empty();
        }
    }

    /**
     * セッションを検証
     */
    public boolean validateSession(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            return false;
        }

        return sessionRepository
                .findValidSession(sessionId, LocalDateTime.now())
                .isPresent();
    }

    /**
     * ログアウト処理
     */
    @Transactional
    public void logout(String sessionId, HttpServletResponse response) {
        if (sessionId != null && !sessionId.isEmpty()) {
            sessionRepository.deleteBySessionId(sessionId);
        }

        // Cookieを削除
        Cookie cookie = new Cookie(sessionConfig.getCookieName(), "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        // Set-Cookieヘッダーでも削除を明示
        response.addHeader("Set-Cookie",
            String.format("%s=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
                sessionConfig.getCookieName()
            )
        );
    }

    /**
     * Cognitoログアウト後のリダイレクトURLを取得
     */
    public String getCognitoLogoutUrl(String postLogoutRedirectUri) {
        return String.format(
            "%s?client_id=%s&logout_uri=%s",
            cognitoConfig.getLogoutEndpoint(),
            cognitoConfig.getClientId(),
            postLogoutRedirectUri
        );
    }

    /**
     * トークンをリフレッシュ
     */
    @Transactional
    public boolean refreshSession(String sessionId) {
        Optional<UserSession> sessionOpt = sessionRepository.findBySessionId(sessionId);
        
        if (sessionOpt.isEmpty()) {
            return false;
        }

        UserSession session = sessionOpt.get();
        
        if (session.getRefreshToken() == null) {
            return false;
        }

        try {
            // リフレッシュトークンで新しいトークンを取得
            CognitoTokenResponse newTokens = refreshTokens(session.getRefreshToken());
            
            if (newTokens == null || newTokens.getAccessToken() == null) {
                return false;
            }

            // セッションを更新
            session.setAccessToken(newTokens.getAccessToken());
            if (newTokens.getIdToken() != null) {
                session.setIdToken(newTokens.getIdToken());
            }
            session.setExpiresAt(LocalDateTime.now()
                    .plusHours(sessionConfig.getExpiryHours()));
            
            sessionRepository.save(session);
            
            return true;
        } catch (Exception e) {
            log.error("トークンのリフレッシュに失敗しました", e);
            return false;
        }
    }

    /**
     * リフレッシュトークンで新しいトークンを取得
     */
    private CognitoTokenResponse refreshTokens(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        String credentials = cognitoConfig.getClientId() + ":" + cognitoConfig.getClientSecret();
        String encodedCredentials = Base64.getEncoder()
                .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encodedCredentials);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", refreshToken);
        body.add("client_id", cognitoConfig.getClientId());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<CognitoTokenResponse> response = restTemplate.exchange(
            cognitoConfig.getTokenUri(),
            HttpMethod.POST,
            request,
            CognitoTokenResponse.class
        );

        return response.getBody();
    }

    /**
     * 期限切れセッションをクリーンアップ
     */
    @Transactional
    public int cleanupExpiredSessions() {
        return sessionRepository.deleteExpiredSessions(LocalDateTime.now());
    }

    /**
     * セッションからアクセストークンを取得
     */
    public Optional<String> getAccessToken(String sessionId) {
        return sessionRepository.findValidSession(sessionId, LocalDateTime.now())
                .map(UserSession::getAccessToken);
    }
}
