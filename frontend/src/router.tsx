/**
 * アプリケーションルーター
 */

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
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

// 認証が必要なルートのラッパー
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 実際の認証チェックはuseRequireAuthフックで行う
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
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthLayout>
        <SignupPage />
      </AuthLayout>
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
      <AuthLayout>
        <div>パスワードリセットページ（実装予定）</div>
      </AuthLayout>
    ),
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
