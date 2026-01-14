package com.example.BFF.controller;

import com.example.BFF.client.UserClient;
import com.example.BFF.config.CognitoConfig;
import com.example.BFF.dto.UserDto;
import com.example.BFF.dto.auth.*;
import com.example.BFF.entity.UserSession;
import com.example.BFF.service.CognitoAuthService;
import com.example.BFF.service.UserSessionService;
import com.example.BFF.util.JwtUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

/**
 * 認証コントローラー
 * AWS SDK直接呼び出し方式でCognito認証を実装
 */
@RestController
@RequestMapping("/api/auth/cognito")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final CognitoAuthService cognitoAuthService;
    private final UserClient userClient;
    private final UserSessionService userSessionService;
    private final CognitoConfig cognitoConfig;
    private final WebClient.Builder webClientBuilder;

    // -----------------------
    // サインアップ
    // -----------------------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupForm form) {
        log.info("========== POST /api/auth/cognito/signup リクエスト開始 ==========");
        log.info("📌 リクエストパラメータ: email={}, name={}", form.getEmail(), form.getName());
        
        try {
            // Cognitoにユーザー登録
            cognitoAuthService.signUpUser(form.getEmail(), form.getPassword(), form.getName());
            log.info("✅ Cognitoへのユーザー登録成功");
            
            log.info("========== /signup 処理完了(CREATED) ==========");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "サインアップ成功。確認メールを送信しました。"));

        } catch (UsernameExistsException e) {
            log.warn("❌ エラー: ユーザーが既に存在しています - {}", form.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "既にユーザーが存在しています。"));

        } catch (InvalidPasswordException e) {
            log.warn("❌ エラー: パスワードポリシー違反");
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "パスワードポリシーに違反しています。"));

        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // サインアップ確認
    // -----------------------
    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestBody ConfirmSignupForm form) {
        log.info("========== POST /api/auth/cognito/confirm リクエスト開始 ==========");
        log.info("📌 リクエストパラメータ: email={}, code={}", form.getEmail(), form.getCode());
        
        try {
            // Cognitoで確認
            cognitoAuthService.confirmUserSignup(form.getEmail(), form.getCode());
            log.info("✅ Cognito確認成功");
            
            log.info("========== /confirm 処理完了(OK) ==========");
            return ResponseEntity.ok(Map.of("message", "確認に成功しました。ログインできます。"));

        } catch (CodeMismatchException e) {
            log.warn("❌ エラー: 確認コード不一致");
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "確認コードが正しくありません。"));

        } catch (ExpiredCodeException e) {
            log.warn("❌ エラー: 確認コード期限切れ");
            return ResponseEntity.status(HttpStatus.GONE)
                    .body(Map.of("error", "確認コードの有効期限が切れています。"));

        } catch (UserNotFoundException e) {
            log.warn("❌ エラー: ユーザーが存在しません - {}", form.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "ユーザーが存在しません。"));

        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // 確認コード再送信
    // -----------------------
    @PostMapping("/resend-code")
    public ResponseEntity<?> resendCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        log.info("========== POST /api/auth/cognito/resend-code リクエスト開始 ==========");
        log.info("📌 リクエストパラメータ: email={}", email);
        
        try {
            cognitoAuthService.resendConfirmationCode(email);
            log.info("✅ 確認コード再送信成功");
            
            return ResponseEntity.ok(Map.of("message", "確認コードを再送信しました。"));

        } catch (UserNotFoundException e) {
            log.warn("❌ エラー: ユーザーが存在しません - {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "ユーザーが存在しません。"));

        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // ログイン
    // -----------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginForm form, HttpServletResponse response) {
        log.info("========== POST /api/auth/cognito/login リクエスト開始 ==========");
        log.info("📌 リクエストパラメータ: email={}", form.getEmail());

        try {
            // Cognitoでログイン
            Map<String, String> tokens = cognitoAuthService.login(form.getEmail(), form.getPassword());
            log.info("✅ Cognitoログイン成功");

            String idToken = tokens.get("idToken");
            String accessToken = tokens.get("accessToken");
            String refreshToken = tokens.get("refreshToken");
            
            log.info("📌 トークン取得状況: idToken={}, accessToken={}, refreshToken={}", 
                idToken != null ? "✓" : "null",
                accessToken != null ? "✓" : "null", 
                refreshToken != null ? "✓" : "null");

            // IDトークンをデコードしてユーザー情報を取得
            Optional<JWTClaimsSet> claimsOpt = JwtUtils.decode(idToken);
            if (claimsOpt.isEmpty()) {
                log.error("❌ エラー: IDトークンのデコードに失敗");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "無効なアクセスです。"));
            }

            JWTClaimsSet claims = claimsOpt.get();
            String cognitoSub = claims.getSubject();
            String email = claims.getStringClaim("email");
            String name = claims.getStringClaim("name");
            
            log.info("📌 JWTクレーム情報: sub={}, email={}, name={}", cognitoSub, email, name);

            // userサービスからユーザー情報を取得または作成
            UserDto user = getOrCreateUser(cognitoSub, email, name);
            log.info("✅ ユーザー取得/作成成功: userId={}", user.getId());

            // セッションを作成してDBに保存
            String sessionId = createSession(user.getId(), cognitoSub, accessToken, refreshToken, idToken);
            
            // httpOnly Cookieを設定
            setAuthCookies(response, accessToken, refreshToken, email, sessionId);
            log.info("✅ Cookie設定成功");

            log.info("========== /login 処理完了(OK) ==========");
            return ResponseEntity.ok(Map.of(
                "success", "ログインできました。",
                "userId", user.getId()
            ));

        } catch (java.text.ParseException e) {
            log.error("❌ エラー: JWTパースエラー - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "トークン解析に失敗しました。"));
        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // OIDCログイン Callback（Google認証など）
    // -----------------------
    @PostMapping("/callback")
    public ResponseEntity<?> callback(@RequestBody Map<String, String> body, HttpServletResponse response) {
        log.info("========== POST /api/auth/cognito/callback リクエスト開始 ==========");
        String code = body.get("code");
        log.info("📌 Authorization code received: {}", 
            code != null ? code.substring(0, Math.min(20, code.length())) + "..." : "null");

        try {
            // 認証コードをトークンに交換
            String basicAuthValue = Base64.getEncoder()
                    .encodeToString((cognitoConfig.getClientId() + ":" + cognitoConfig.getClientSecret())
                    .getBytes(StandardCharsets.UTF_8));

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "authorization_code");
            formData.add("code", code);
            formData.add("redirect_uri", cognitoConfig.getRedirectUri());
            formData.add("client_id", cognitoConfig.getClientId());

            WebClient webClient = webClientBuilder.build();
            Map<String, Object> tokenResponse = webClient.post()
                    .uri(cognitoConfig.getTokenUri())
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                    .header(HttpHeaders.AUTHORIZATION, "Basic " + basicAuthValue)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (tokenResponse == null) {
                log.error("❌ エラー: tokenResponseがnull");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "トークン取得に失敗しました。"));
            }

            log.info("✅ トークン取得成功");

            String idToken = (String) tokenResponse.get("id_token");
            String accessToken = (String) tokenResponse.get("access_token");
            String refreshToken = (String) tokenResponse.get("refresh_token");

            Optional<JWTClaimsSet> claimsOpt = JwtUtils.decode(idToken);
            if (claimsOpt.isEmpty()) {
                log.error("❌ エラー: IDトークンのデコードに失敗");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "無効なリクエストです。"));
            }

            JWTClaimsSet claims = claimsOpt.get();
            String name = claims.getStringClaim("name");
            String email = claims.getStringClaim("email");
            String cognitoSub = claims.getSubject();

            log.info("📌 ユーザー情報: email={}, sub={}", email, cognitoSub);

            // プロバイダー判定（Google or Cognito）
            boolean isGoogle = claims.getClaim("identities") != null;
            String provider = isGoogle ? "google" : "cognito";
            log.info("📌 プロバイダー: {}", provider);

            // userサービスからユーザー情報を取得または作成
            UserDto user = getOrCreateUser(cognitoSub, email, name);

            // セッションを作成してDBに保存
            String sessionId = createSession(user.getId(), cognitoSub, accessToken, refreshToken, idToken);

            // httpOnly Cookieの設定
            setAuthCookies(response, accessToken, refreshToken, email, sessionId);
            log.info("✅ Cookie設定成功");

            log.info("========== /callback 処理完了(OK) ==========");
            return ResponseEntity.ok(Map.of("success", "ログインできました"));

        } catch (java.text.ParseException e) {
            log.error("❌ エラー: JWTパースエラー - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "トークン解析に失敗しました。"));
        } catch (Exception e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "server error: " + e.getMessage()));
        }
    }

    // -----------------------
    // ログアウト
    // -----------------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "ACCESS_TOKEN", required = false) String accessToken,
            @CookieValue(name = "BESTYLE_SESSION", required = false) String sessionId,
            HttpServletResponse response) {
        
        log.info("========== POST /api/auth/cognito/logout リクエスト開始 ==========");
        
        // Cognitoからグローバルサインアウト
        if (accessToken != null && !accessToken.isEmpty()) {
            try {
                cognitoAuthService.globalSignOut(accessToken);
                log.info("✅ Cognitoグローバルサインアウト成功");
            } catch (Exception e) {
                log.warn("Cognitoサインアウトエラー（無視）: {}", e.getMessage());
            }
        }

        // セッションを削除
        if (sessionId != null && !sessionId.isEmpty()) {
            userSessionService.deleteSessionById(sessionId);
        }

        // Cookieを削除
        clearAuthCookies(response);
        log.info("✅ Cookie削除成功");

        log.info("========== /logout 処理完了(OK) ==========");
        return ResponseEntity.ok(Map.of("message", "ログアウトしました。"));
    }

    // -----------------------
    // パスワードリセット要求
    // -----------------------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        log.info("========== POST /api/auth/cognito/forgot-password リクエスト開始 ==========");
        log.info("📌 リクエストパラメータ: email={}", email);

        try {
            cognitoAuthService.forgotPassword(email);
            log.info("✅ パスワードリセットコード送信成功");
            
            return ResponseEntity.ok(Map.of("message", "確認コードを送信しました。"));

        } catch (UserNotFoundException e) {
            log.warn("❌ エラー: ユーザーが存在しません - {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "ユーザーが存在しません。"));

        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // パスワードリセット確定
    // -----------------------
    @PostMapping("/confirm-forgot-password")
    public ResponseEntity<?> confirmForgotPassword(@RequestBody ForgotPasswordForm form) {
        log.info("========== POST /api/auth/cognito/confirm-forgot-password リクエスト開始 ==========");
        log.info("📌 リクエストパラメータ: email={}, code={}", form.getEmail(), form.getCode());

        try {
            cognitoAuthService.confirmForgotPassword(form.getEmail(), form.getCode(), form.getNewPassword());
            log.info("✅ パスワードリセット成功");

            return ResponseEntity.ok(Map.of("message", "パスワードをリセットしました。"));

        } catch (UserNotFoundException e) {
            log.warn("❌ エラー: ユーザーが存在しません - {}", form.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "ユーザーが存在しません。"));

        } catch (CodeMismatchException e) {
            log.warn("❌ エラー: 確認コード不一致");
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "確認コードが正しくありません。"));

        } catch (ExpiredCodeException e) {
            log.warn("❌ エラー: 確認コード期限切れ");
            return ResponseEntity.status(HttpStatus.GONE)
                    .body(Map.of("error", "確認コードの有効期限が切れています。"));

        } catch (InvalidPasswordException e) {
            log.warn("❌ エラー: パスワードポリシー違反");
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "パスワードポリシーに違反しています。"));

        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // リフレッシュトークンでアクセストークン更新
    // -----------------------
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "REFRESH_TOKEN", required = false) String refreshToken,
            @CookieValue(name = "EMAIL", required = false) String email,
            @CookieValue(name = "BESTYLE_SESSION", required = false) String sessionId,
            HttpServletResponse response) {

        log.info("========== POST /api/auth/cognito/refresh-token リクエスト開始 ==========");

        if (refreshToken == null || refreshToken.isEmpty()) {
            log.warn("❌ エラー: リフレッシュトークンがありません");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "リフレッシュトークンが存在しません。"));
        }

        try {
            Map<String, String> tokens = cognitoAuthService.refreshAccessToken(refreshToken, email);
            log.info("✅ トークンリフレッシュ成功");

            // セッションを更新
            if (sessionId != null && !sessionId.isEmpty()) {
                userSessionService.updateSession(sessionId, tokens.get("accessToken"), tokens.get("idToken"));
            }

            // Cookieを更新
            setAuthCookies(response, tokens.get("accessToken"), refreshToken, email, sessionId);

            return ResponseEntity.ok(Map.of("success", "更新完了"));

        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // 現在のユーザー情報取得
    // -----------------------
    @GetMapping("/me")
    public ResponseEntity<?> me(
            @CookieValue(name = "BESTYLE_SESSION", required = false) String sessionId) {
        
        log.info("========== GET /api/auth/cognito/me リクエスト開始 ==========");
        
        if (sessionId == null || sessionId.isEmpty()) {
            log.warn("セッションIDがありません");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "認証されていません"));
        }

        Optional<UserSession> sessionOpt = userSessionService.findValidSession(sessionId);
        
        if (sessionOpt.isEmpty()) {
            log.warn("有効なセッションがありません: sessionId={}", sessionId.substring(0, 8) + "...");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "セッションが無効です。"));
        }

        UserSession session = sessionOpt.get();
        
        try {
            // userサービスからユーザー情報を取得
            UserDto user = userClient.getUserById(session.getUserId());
            log.info("✅ ユーザー情報取得成功: userId={}", user.getId());
            
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail() != null ? user.getEmail() : "",
                "username", user.getUsername() != null ? user.getUsername() : "",
                "displayName", user.getDisplayName() != null ? user.getDisplayName() : ""
            ));

        } catch (RuntimeException e) {
            log.error("❌ エラー: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // -----------------------
    // ヘルパーメソッド
    // -----------------------

    /**
     * userサービスからユーザーを取得、存在しない場合は作成
     */
    private UserDto getOrCreateUser(String cognitoSub, String email, String name) {
        try {
            // cognitoSubでユーザーを検索
            return userClient.getUserByCognitoSub(cognitoSub);
        } catch (Exception e) {
            // ユーザーが存在しない場合は作成
            log.info("ユーザーが存在しないため新規作成: cognitoSub={}", cognitoSub);
            UserDto newUser = new UserDto();
            newUser.setCognitoSub(cognitoSub);
            newUser.setEmail(email);
            newUser.setUsername(email); // 初期値としてメールアドレスを設定
            newUser.setDisplayName(name != null ? name : email.split("@")[0]);
            newUser.setStatus("ACTIVE");
            return userClient.createUser(newUser);
        }
    }

    /**
     * セッションを作成してDBに保存
     */
    private String createSession(Integer userId, String cognitoSub, 
                                  String accessToken, String refreshToken, String idToken) {
        return userSessionService.createSession(userId, cognitoSub, accessToken, refreshToken, idToken);
    }

    /**
     * httpOnly Cookie設定
     */
    private void setAuthCookies(HttpServletResponse response, 
                                 String accessToken, String refreshToken, 
                                 String email, String sessionId) {
        // アクセストークン Cookie
        ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
            .httpOnly(true)
            .secure(true) // 開発環境: false、本番環境: true
            .path("/")
            .maxAge(60 * 60 * 2) // 2時間
            .sameSite("None") // 開発環境: Lax、本番環境: None
            .build();

        // リフレッシュトークン Cookie
        ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(60 * 60 * 24 * 7) // 7日
            .sameSite("None")
            .build();

        // メール Cookie
        ResponseCookie emailCookie = ResponseCookie.from("EMAIL", email)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(60 * 60 * 24 * 7)
            .sameSite("None")
            .build();

        // セッションID Cookie
        ResponseCookie sessionCookie = ResponseCookie.from("BESTYLE_SESSION", sessionId)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(60 * 60 * 24 * 7)
            .sameSite("None")
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, emailCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie.toString());
    }

    /**
     * Cookie削除
     */
    private void clearAuthCookies(HttpServletResponse response) {
        String[] cookieNames = {"ACCESS_TOKEN", "REFRESH_TOKEN", "EMAIL", "BESTYLE_SESSION"};
        
        for (String name : cookieNames) {
            ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }
    }
}
