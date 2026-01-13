/**
 * ヘッダーコンポーネント
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../common/Avatar';
import { ROUTES } from '../../constants/routes';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-xl group-hover:shadow-brand-500/30 transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent hidden sm:inline">
            BeStyle
          </span>
        </Link>

        {/* 検索バー */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
            <input
              type="text"
              placeholder="検索..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`
                w-full pl-11 pr-4 py-2.5 text-sm
                bg-gray-100/80 rounded-xl
                border-2 border-transparent
                transition-all duration-300 ease-out
                focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
                placeholder-gray-400
              `}
            />
            <svg
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${searchFocused ? 'text-brand-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* 右側のナビゲーション */}
        <nav className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* ホームボタン */}
              <Link
                to={ROUTES.HOME}
                className="p-2.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </Link>

              {/* 通知ボタン */}
              <button className="p-2.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all duration-200 hover:scale-105 relative group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* 通知バッジ - パルスアニメーション付き */}
                {/* <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span> */}
              </button>

              {/* プロフィールドロップダウン */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="ring-2 ring-transparent group-hover:ring-brand-200 rounded-full transition-all duration-200">
                    <Avatar
                      src={user?.profileImageUrl}
                      name={user?.displayName || user?.username}
                      size="sm"
                    />
                  </div>
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-fade-in-down">
                      <div className="px-5 py-4 bg-gradient-to-br from-brand-50 to-accent-50 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">
                          {user?.displayName || user?.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate">@{user?.username}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to={ROUTES.PROFILE.VIEW(user?.username || '')}
                          className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          プロフィール
                        </Link>
                        <Link
                          to={ROUTES.SETTINGS.INDEX}
                          className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          設定
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-5 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          ログアウト
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="px-5 py-2.5 text-gray-600 font-medium hover:text-brand-600 transition-colors"
              >
                ログイン
              </Link>
              <Link
                to={ROUTES.AUTH.SIGNUP}
                className="px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-105"
              >
                新規登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
