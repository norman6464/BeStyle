/**
 * アプリケーションルーター
 */

import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { MainLayout, AuthLayout } from './components/layout';
import {
  HomePage,
  LoginPage,
  SignupPage,
  ConfirmSignupPage,
  ProfilePage,
  PostDetailPage,
  SettingsPage,
  ProfileSettingsPage,
  AccountSettingsPage,
  NotificationSettingsPage,
  PrivacySettingsPage,
  NotFoundPage,
} from './pages';
import { ROUTES } from './constants/routes';
import { useAppSelector } from './store/hooks';

// 認証が必要なルートのラッパー
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, initialized, loading } = useAppSelector((state) => state.auth);

  // 初期化中はローディング表示
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 未認証の場合はログインページにリダイレクト
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

// 非認証ユーザー専用ルートのラッパー（ログイン済みならホームにリダイレクト）
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, initialized, loading } = useAppSelector((state) => state.auth);

  // 初期化中はローディング表示
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 認証済みの場合はホームにリダイレクト
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

// ルーター設定
export const router = createBrowserRouter([
  // メインレイアウト（認証済みユーザー用）
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'search',
        element: (
          <ProtectedRoute>
            <div className="p-4">検索ページ（実装予定）</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <div className="p-4">通知ページ（実装予定）</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookmarks',
        element: (
          <ProtectedRoute>
            <div className="p-4">ブックマークページ（実装予定）</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/:username',
        element: <ProfilePage />,
      },
      {
        path: 'post/:id',
        element: <PostDetailPage />,
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.SETTINGS.PROFILE} replace />,
          },
          {
            path: 'profile',
            element: <ProfileSettingsPage />,
          },
          {
            path: 'account',
            element: <AccountSettingsPage />,
          },
          {
            path: 'notifications',
            element: <NotificationSettingsPage />,
          },
          {
            path: 'privacy',
            element: <PrivacySettingsPage />,
          },
        ],
      },
    ],
  },

  // 認証ページ（AuthLayoutで表示）
  {
    path: '/login',
    element: (
      <GuestRoute>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </GuestRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <GuestRoute>
        <AuthLayout>
          <SignupPage />
        </AuthLayout>
      </GuestRoute>
    ),
  },
  {
    path: '/confirm-signup',
    element: (
      <AuthLayout>
        <ConfirmSignupPage />
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <GuestRoute>
        <AuthLayout>
          <div>パスワードリセットページ（実装予定）</div>
        </AuthLayout>
      </GuestRoute>
    ),
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
