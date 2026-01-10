/**
 * 認証ページ用レイアウト
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-blue-600">
            BeStyle
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {children}
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-screen-xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; 2024 BeStyle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
