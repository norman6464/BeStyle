/**
 * 認証API クライアント
 * BFFの認証エンドポイントと通信
 */

const API_BASE_URL = 'http://localhost:8080/api/auth';

/**
 * ログインURLを取得
 */
export const getLoginUrl = async (): Promise<{ loginUrl: string; state: string }> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to get login URL');
  }
  return response.json();
};

/**
 * サインアップURLを取得
 */
export const getSignupUrl = async (): Promise<{ signupUrl: string; state: string }> => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to get signup URL');
  }
  return response.json();
};

/**
 * 認証コードをトークンに交換
 */
export const exchangeAuthCode = async (code: string, state: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code, state }),
  });
  return response.json();
};

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to get current user');
  }
  return response.json();
};

/**
 * セッションの検証
 */
export const validateSession = async (): Promise<{ valid: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/validate`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to validate session');
  }
  return response.json();
};

/**
 * ログアウト
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to logout');
  }
  return response.json();
};

/**
 * トークンのリフレッシュ
 */
export const refreshToken = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  return response.json();
};

// 型定義
export interface AuthResponse {
  success: boolean;
  message: string;
  userId?: number;
  username?: string;
  email?: string;
  displayName?: string;
}

export interface User {
  id: number;
  cognitoSub: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  headerImageUrl?: string;
  location?: string;
  websiteUrl?: string;
  birthDate?: string;
  isPrivate?: boolean;
  isVerified?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentUserResponse {
  authenticated: boolean;
  user: User | null;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  cognitoLogoutUrl: string;
}
