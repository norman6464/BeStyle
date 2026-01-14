/**
 * 認証API
 * BFFの /api/auth/cognito/* エンドポイントとの通信
 */


import { apiClient } from './client';
import type {
  LoginForm,
  SignupForm,
  ConfirmSignupForm,
  ForgotPasswordForm,
  AuthResponse,
  CurrentUser,
} from '../types/auth';

const AUTH_BASE = '/api/auth/cognito';

/**
 * ログイン
 */
export const login = async (form: LoginForm): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, form);
};

/**
 * サインアップ
 */
export const signup = async (form: SignupForm): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/signup`, form);
};

/**
 * サインアップ確認（メール認証）
 */
export const confirmSignup = async (form: ConfirmSignupForm): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/confirm`, form);
};

/**
 * 確認コード再送信
 */
export const resendConfirmationCode = async (email: string): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/resend-code`, { email });
};

/**
 * ログアウト
 */
export const logout = async (): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/logout`);
};

/**
 * パスワードリセット要求
 */
export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/forgot-password`, { email });
};

/**
 * パスワードリセット確定
 */
export const confirmForgotPassword = async (form: ForgotPasswordForm): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/confirm-forgot-password`, form);
};

/**
 * OAuth2コールバック（Google認証等）
 */
export const oauthCallback = async (code: string): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/callback`, { code });
};

/**
 * トークンリフレッシュ
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${AUTH_BASE}/refresh-token`);
};

/**
 * 現在のユーザー情報取得
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  return apiClient.get<CurrentUser>(`${AUTH_BASE}/me`);
};

// 名前付きエクスポート
export const authApi = {
  login,
  signup,
  confirmSignup,
  resendConfirmationCode,
  logout,
  forgotPassword,
  confirmForgotPassword,
  oauthCallback,
  refreshToken,
  getCurrentUser,
};

export default authApi;
