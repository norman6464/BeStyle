/**
 * 認証関連の型定義
 */

// ログインフォーム
export interface LoginForm {
  email: string;
  password: string;
}

// サインアップフォーム
export interface SignupForm {
  username: string;
  email: string;
  password: string;
  name: string;
}

// サインアップ確認フォーム
export interface ConfirmSignupForm {
  email: string;
  confirmationCode: string;
}

// パスワードリセットフォーム
export interface ForgotPasswordForm {
  email: string;
  code: string;
  newPassword: string;
}

// 認証レスポンス
export interface AuthResponse {
  success?: string;
  message?: string;
  error?: string;
  userId?: number;
}

// 現在のユーザー情報
export interface CurrentUser {
  id: number;
  email: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  authenticated?: boolean;
}

// 認証状態
export interface AuthState {
  isAuthenticated: boolean;
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
}
