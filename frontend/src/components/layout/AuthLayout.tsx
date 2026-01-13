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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50" />
      
      {/* デコレーション要素 */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-radial from-brand-100/20 to-transparent -translate-x-1/2 -translate-y-1/2" />
      
      {/* パターン背景 */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* ヘッダー */}
      <header className="relative z-10 backdrop-blur-xl bg-white/60 border-b border-gray-200/50">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-xl group-hover:shadow-brand-500/30 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
              BeStyle
            </span>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-900/5 border border-gray-200/50 p-8 relative overflow-hidden">
            {/* カード装飾 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 bg-[length:200%_auto] animate-gradient-shift" />
            {children}
          </div>
          
          {/* 追加リンク */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              BeStyleは、あなたのスタイルを共有するためのプラットフォームです。
            </p>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="relative z-10 backdrop-blur-xl bg-white/60 border-t border-gray-200/50 py-6">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BeStyle. All rights reserved.
            </p>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                利用規約
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                プライバシー
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                ヘルプ
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
