package com.example.BFF.service;

import com.example.BFF.config.AwsConfig;
import com.example.BFF.config.CognitoConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Cognito認証サービス
 * AWS SDK v2を使用してCognitoと直接通信
 */
@Service
@Slf4j
public class CognitoAuthService {

    private final CognitoIdentityProviderClient cognitoClient;
    private final CognitoConfig cognitoConfig;

    public CognitoAuthService(AwsConfig awsConfig, CognitoConfig cognitoConfig) {
        this.cognitoConfig = cognitoConfig;
        
        // AWS認証情報を設定
        AwsBasicCredentials credentials = AwsBasicCredentials.create(
            awsConfig.getAccessKey(),
            awsConfig.getSecretKey()
        );
        
        // Cognitoクライアントを初期化
        this.cognitoClient = CognitoIdentityProviderClient.builder()
            .region(Region.of(awsConfig.getRegion()))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .build();
        
        log.info("CognitoAuthService initialized with region: {}", awsConfig.getRegion());
    }

    /**
     * ユーザーサインアップ
     */
    public void signUpUser(String email, String password, String displayName) {
        log.info("サインアップ処理開始: email={}", email);
        
        try {
            SignUpRequest request = SignUpRequest.builder()
                .clientId(cognitoConfig.getClientId())
                .secretHash(calculateSecretHash(email))
                .username(email)
                .password(password)
                .userAttributes(
                    AttributeType.builder().name("email").value(email).build(),
                    AttributeType.builder().name("name").value(displayName).build()
                )
                .build();

            SignUpResponse response = cognitoClient.signUp(request);
            log.info("サインアップ成功: userSub={}", response.userSub());
            
        } catch (UsernameExistsException e) {
            log.warn("ユーザーが既に存在: email={}", email);
            throw e;
        } catch (InvalidPasswordException e) {
            log.warn("パスワードポリシー違反: email={}", email);
            throw e;
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            throw new RuntimeException("サインアップに失敗しました: " + e.getMessage(), e);
        }
    }

    /**
     * サインアップ確認（確認コード検証）
     */
    public void confirmUserSignup(String email, String confirmationCode) {
        log.info("サインアップ確認処理開始: email={}", email);
        
        try {
            ConfirmSignUpRequest request = ConfirmSignUpRequest.builder()
                .clientId(cognitoConfig.getClientId())
                .secretHash(calculateSecretHash(email))
                .username(email)
                .confirmationCode(confirmationCode)
                .build();

            cognitoClient.confirmSignUp(request);
            log.info("サインアップ確認成功: email={}", email);
            
        } catch (CodeMismatchException e) {
            log.warn("確認コード不一致: email={}", email);
            throw e;
        } catch (ExpiredCodeException e) {
            log.warn("確認コード期限切れ: email={}", email);
            throw e;
        } catch (UserNotFoundException e) {
            log.warn("ユーザーが存在しません: email={}", email);
            throw e;
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            throw new RuntimeException("確認に失敗しました: " + e.getMessage(), e);
        }
    }

    /**
     * ログイン（USER_PASSWORD_AUTH）
     * @return トークン情報（idToken, accessToken, refreshToken）
     */
    public Map<String, String> login(String email, String password) {
        log.info("ログイン処理開始: email={}", email);
        
        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", email);
            authParams.put("PASSWORD", password);
            authParams.put("SECRET_HASH", calculateSecretHash(email));

            InitiateAuthRequest request = InitiateAuthRequest.builder()
                .clientId(cognitoConfig.getClientId())
                .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                .authParameters(authParams)
                .build();

            InitiateAuthResponse response = cognitoClient.initiateAuth(request);
            AuthenticationResultType authResult = response.authenticationResult();

            if (authResult == null) {
                // チャレンジが必要な場合（MFAなど）
                log.warn("認証チャレンジが必要: challengeName={}", response.challengeName());
                throw new RuntimeException("追加の認証が必要です: " + response.challengeName());
            }

            Map<String, String> tokens = new HashMap<>();
            tokens.put("idToken", authResult.idToken());
            tokens.put("accessToken", authResult.accessToken());
            tokens.put("refreshToken", authResult.refreshToken());
            
            log.info("ログイン成功: email={}", email);
            return tokens;
            
        } catch (NotAuthorizedException e) {
            log.warn("認証失敗（パスワード不正）: email={}", email);
            throw new RuntimeException("メールアドレスまたはパスワードが正しくありません。", e);
        } catch (UserNotConfirmedException e) {
            log.warn("ユーザー未確認: email={}", email);
            throw new RuntimeException("メールアドレスの確認が完了していません。", e);
        } catch (UserNotFoundException e) {
            log.warn("ユーザーが存在しません: email={}", email);
            throw new RuntimeException("メールアドレスまたはパスワードが正しくありません。", e);
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            throw new RuntimeException("ログインに失敗しました: " + e.getMessage(), e);
        }
    }

    /**
     * リフレッシュトークンを使用してアクセストークンを更新
     */
    public Map<String, String> refreshAccessToken(String refreshToken, String email) {
        log.info("トークンリフレッシュ処理開始: email={}", email);
        
        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("REFRESH_TOKEN", refreshToken);
            authParams.put("SECRET_HASH", calculateSecretHash(email));

            InitiateAuthRequest request = InitiateAuthRequest.builder()
                .clientId(cognitoConfig.getClientId())
                .authFlow(AuthFlowType.REFRESH_TOKEN_AUTH)
                .authParameters(authParams)
                .build();

            InitiateAuthResponse response = cognitoClient.initiateAuth(request);
            AuthenticationResultType authResult = response.authenticationResult();

            Map<String, String> tokens = new HashMap<>();
            tokens.put("idToken", authResult.idToken());
            tokens.put("accessToken", authResult.accessToken());
            // リフレッシュトークンは返されない場合があるので、元のものを使う
            tokens.put("refreshToken", authResult.refreshToken() != null 
                ? authResult.refreshToken() : refreshToken);
            
            log.info("トークンリフレッシュ成功: email={}", email);
            return tokens;
            
        } catch (NotAuthorizedException e) {
            log.warn("リフレッシュトークン無効: email={}", email);
            throw new RuntimeException("セッションが無効です。再度ログインしてください。", e);
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            throw new RuntimeException("トークンの更新に失敗しました: " + e.getMessage(), e);
        }
    }

    /**
     * パスワードリセット要求
     */
    public void forgotPassword(String email) {
        log.info("パスワードリセット要求: email={}", email);
        
        try {
            ForgotPasswordRequest request = ForgotPasswordRequest.builder()
                .clientId(cognitoConfig.getClientId())
                .secretHash(calculateSecretHash(email))
                .username(email)
                .build();

            cognitoClient.forgotPassword(request);
            log.info("パスワードリセットコード送信成功: email={}", email);
            
        } catch (UserNotFoundException e) {
            log.warn("ユーザーが存在しません: email={}", email);
            throw e;
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            throw new RuntimeException("パスワードリセットに失敗しました: " + e.getMessage(), e);
        }
    }

    /**
     * パスワードリセット確定
     */
    public void confirmForgotPassword(String email, String confirmationCode, String newPassword) {
        log.info("パスワードリセット確定: email={}", email);
        
        try {
            ConfirmForgotPasswordRequest request = ConfirmForgotPasswordRequest.builder()
                .clientId(cognitoConfig.getClientId())
                .secretHash(calculateSecretHash(email))
                .username(email)
                .confirmationCode(confirmationCode)
                .password(newPassword)
                .build();

            cognitoClient.confirmForgotPassword(request);
            log.info("パスワードリセット成功: email={}", email);
            
        } catch (CodeMismatchException e) {
            log.warn("確認コード不一致: email={}", email);
            throw e;
        } catch (ExpiredCodeException e) {
            log.warn("確認コード期限切れ: email={}", email);
            throw e;
        } catch (InvalidPasswordException e) {
            log.warn("パスワードポリシー違反: email={}", email);
            throw e;
        } catch (UserNotFoundException e) {
            log.warn("ユーザーが存在しません: email={}", email);
            throw e;
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            throw new RuntimeException("パスワードリセットに失敗しました: " + e.getMessage(), e);
        }
    }

    /**
     * 確認コード再送信
     */
    public void resendConfirmationCode(String email) {
        log.info("確認コード再送信: email={}", email);
        
        try {
            ResendConfirmationCodeRequest request = ResendConfirmationCodeRequest.builder()
                .clientId(cognitoConfig.getClientId())
                .secretHash(calculateSecretHash(email))
                .username(email)
                .build();

            cognitoClient.resendConfirmationCode(request);
            log.info("確認コード再送信成功: email={}", email);
            
        } catch (UserNotFoundException e) {
            log.warn("ユーザーが存在しません: email={}", email);
            throw e;
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            throw new RuntimeException("確認コードの再送信に失敗しました: " + e.getMessage(), e);
        }
    }

    /**
     * グローバルサインアウト（すべてのデバイスからログアウト）
     */
    public void globalSignOut(String accessToken) {
        log.info("グローバルサインアウト処理開始");
        
        try {
            GlobalSignOutRequest request = GlobalSignOutRequest.builder()
                .accessToken(accessToken)
                .build();

            cognitoClient.globalSignOut(request);
            log.info("グローバルサインアウト成功");
            
        } catch (CognitoIdentityProviderException e) {
            log.error("Cognitoエラー: {}", e.getMessage());
            // サインアウトエラーは無視してローカルセッションは削除する
        }
    }

    /**
     * SECRET_HASHを計算（クライアントシークレットが設定されている場合に必要）
     */
    private String calculateSecretHash(String username) {
        if (cognitoConfig.getClientSecret() == null || cognitoConfig.getClientSecret().isEmpty()) {
            return null;
        }
        
        try {
            String message = username + cognitoConfig.getClientId();
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                cognitoConfig.getClientSecret().getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
            );
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("SECRET_HASHの計算に失敗しました", e);
        }
    }
}
