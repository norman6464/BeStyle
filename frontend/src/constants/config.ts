/**
 * アプリケーション設定
 */

// API設定
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
} as const;

// 認証設定
export const AUTH_CONFIG = {
  // Cognito Hosted UI（Google認証用）
  COGNITO_DOMAIN: import.meta.env.VITE_COGNITO_DOMAIN || '',
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
  COGNITO_REDIRECT_URI: import.meta.env.VITE_COGNITO_REDIRECT_URI || 'http://localhost:5173/login/callback',
  
  // Cookie名
  COOKIE_ACCESS_TOKEN: 'ACCESS_TOKEN',
  COOKIE_REFRESH_TOKEN: 'REFRESH_TOKEN',
  COOKIE_SESSION_ID: 'BESTYLE_SESSION',
} as const;

// ページネーション設定
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// 投稿設定
export const POST_CONFIG = {
  MAX_CONTENT_LENGTH: 280,
  MAX_MEDIA_COUNT: 4,
} as const;

// 便利なエクスポート
export const MAX_POST_LENGTH = POST_CONFIG.MAX_CONTENT_LENGTH;

// プロフィール設定
export const PROFILE_CONFIG = {
  MAX_BIO_LENGTH: 160,
  MAX_DISPLAY_NAME_LENGTH: 50,
  MAX_USERNAME_LENGTH: 15,
} as const;

// Cognito認証URL生成（Google認証用）
export const getCognitoAuthUrl = (provider: 'Google' | 'Facebook' = 'Google') => {
  const { COGNITO_DOMAIN, COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } = AUTH_CONFIG;
  if (!COGNITO_DOMAIN || !COGNITO_CLIENT_ID) {
    console.warn('Cognito設定が不足しています');
    return '#';
  }
  
  const params = new URLSearchParams({
    identity_provider: provider,
    redirect_uri: COGNITO_REDIRECT_URI,
    response_type: 'code',
    client_id: COGNITO_CLIENT_ID,
    scope: 'email openid profile',
  });
  
  return `https://${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
};
