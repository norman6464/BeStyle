/**
 * 認証関連のカスタムフック
 */

import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginAsync,
  signupAsync,
  confirmSignupAsync,
  logoutAsync,
  fetchCurrentUserAsync,
  oauthCallbackAsync,
  clearError,
} from '../store/slices/authSlice';
import { ROUTES } from '../constants/routes';
import type { LoginForm, SignupForm, ConfirmSignupForm } from '../types/auth';

/**
 * 認証状態と認証操作を提供するフック
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth);

  // ログイン
  const login = useCallback(
    async (form: LoginForm) => {
      const result = await dispatch(loginAsync(form));
      if (loginAsync.fulfilled.match(result)) {
        // ログイン後のリダイレクト先
        const from = (location.state as { from?: string })?.from || ROUTES.HOME;
        navigate(from);
        return { success: true };
      }
      return { success: false, error: result.payload as string };
    },
    [dispatch, navigate, location.state]
  );

  // サインアップ
  const signup = useCallback(
    async (form: SignupForm) => {
      const result = await dispatch(signupAsync(form));
      if (signupAsync.fulfilled.match(result)) {
        // 確認コード入力画面へ遷移
        navigate(ROUTES.AUTH.CONFIRM_SIGNUP, { state: { email: form.email } });
        return { success: true };
      }
      return { success: false, error: result.payload as string };
    },
    [dispatch, navigate]
  );

  // サインアップ確認
  const confirmSignup = useCallback(
    async (form: ConfirmSignupForm) => {
      const result = await dispatch(confirmSignupAsync(form));
      if (confirmSignupAsync.fulfilled.match(result)) {
        navigate(ROUTES.AUTH.LOGIN);
        return { success: true };
      }
      return { success: false, error: result.payload as string };
    },
    [dispatch, navigate]
  );

  // ログアウト
  const logout = useCallback(async () => {
    await dispatch(logoutAsync());
    navigate(ROUTES.AUTH.LOGIN);
  }, [dispatch, navigate]);

  // 現在のユーザー情報を取得
  const fetchCurrentUser = useCallback(async () => {
    const result = await dispatch(fetchCurrentUserAsync());
    return fetchCurrentUserAsync.fulfilled.match(result);
  }, [dispatch]);

  // OAuthコールバック処理
  const handleOAuthCallback = useCallback(
    async (code: string) => {
      const result = await dispatch(oauthCallbackAsync(code));
      if (oauthCallbackAsync.fulfilled.match(result)) {
        navigate(ROUTES.HOME);
        return { success: true };
      }
      return { success: false, error: result.payload as string };
    },
    [dispatch, navigate]
  );

  // エラーをクリア
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    signup,
    confirmSignup,
    logout,
    fetchCurrentUser,
    handleOAuthCallback,
    resetError,
  };
};

/**
 * 認証状態を初期化するフック（アプリ起動時に使用）
 */
export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 初期化済み or ロード中の場合はスキップ（無限ループ防止）
    if (initialized || loading) {
      return;
    }
    dispatch(fetchCurrentUserAsync());
  }, [dispatch, initialized, loading]);

  return { isAuthenticated, loading, initialized };
};

/**
 * 認証が必要なページで使用するフック
 */
export const useRequireAuth = (redirectTo: string = ROUTES.AUTH.LOGIN) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo, { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo, location.pathname]);

  return { isAuthenticated, loading };
};

/**
 * 非認証ユーザー専用ページで使用するフック（ログイン済みならリダイレクト）
 */
export const useGuestOnly = (redirectTo: string = ROUTES.HOME) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  return { isAuthenticated, loading };
};
