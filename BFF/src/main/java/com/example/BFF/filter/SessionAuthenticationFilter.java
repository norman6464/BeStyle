package com.example.BFF.filter;

import com.example.BFF.entity.UserSession;
import com.example.BFF.repository.UserSessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

/**
 * セッションベース認証フィルター
 * httpOnly CookieからセッションIDを取得し、DBで検証して認証を行う
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SessionAuthenticationFilter extends OncePerRequestFilter {

    private final UserSessionRepository sessionRepository;

    @Value("${session.cookie-name:BESTYLE_SESSION}")
    private String sessionCookieName;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 認証エンドポイントはスキップ
        String requestUri = request.getRequestURI();
        if (requestUri.startsWith("/api/auth/") || 
            requestUri.equals("/actuator/health") ||
            requestUri.equals("/actuator/info") ||
            requestUri.equals("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        // CookieからセッションIDを取得
        String sessionId = getSessionIdFromCookie(request);

        if (sessionId != null) {
            // セッションを検証
            Optional<UserSession> sessionOpt = sessionRepository
                    .findValidSession(sessionId, LocalDateTime.now());

            if (sessionOpt.isPresent()) {
                UserSession session = sessionOpt.get();
                
                // 認証情報をセット
                SessionUserPrincipal principal = new SessionUserPrincipal(
                    session.getUserId(),
                    session.getCognitoSub(),
                    session.getSessionId()
                );

                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );

                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                log.debug("セッション認証成功: userId={}, sessionId={}", 
                    session.getUserId(), sessionId.substring(0, 8) + "...");
            } else {
                log.debug("無効なセッション: sessionId={}", 
                    sessionId.substring(0, 8) + "...");
            }
        }

        filterChain.doFilter(request, response);
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

    /**
     * セッションユーザープリンシパル
     * 認証されたユーザーの情報を保持
     */
    public record SessionUserPrincipal(
        Integer userId,
        String cognitoSub,
        String sessionId
    ) {}
}
