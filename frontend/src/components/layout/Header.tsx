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

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* ロゴ */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">BeStyle</span>
        </Link>

        {/* 検索バー */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="検索..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* ホームボタン */}
              <Link
                to={ROUTES.HOME}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
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
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* 通知バッジ */}
                {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
              </button>

              {/* プロフィールドロップダウン */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Avatar
                    src={user?.profileImageUrl}
                    name={user?.displayName || user?.username}
                    size="sm"
                  />
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">
                          {user?.displayName || user?.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate">@{user?.username}</p>
                      </div>
                      <Link
                        to={ROUTES.PROFILE.VIEW(user?.username || '')}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        プロフィール
                      </Link>
                      <Link
                        to={ROUTES.SETTINGS.INDEX}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        設定
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        ログアウト
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                ログイン
              </Link>
              <Link
                to={ROUTES.AUTH.SIGNUP}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
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
