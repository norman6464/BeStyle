/**
 * 設定ページ
 */

import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const settingsNavItems = [
  { label: 'プロフィール', to: ROUTES.SETTINGS.PROFILE },
  { label: 'アカウント', to: ROUTES.SETTINGS.ACCOUNT },
  { label: '通知', to: ROUTES.SETTINGS.NOTIFICATIONS },
  { label: 'プライバシー', to: ROUTES.SETTINGS.PRIVACY },
];

export const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="sticky top-14 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 mr-4 hover:bg-gray-100 rounded-full lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">設定</h1>
        </div>
      </div>

      <div className="flex">
        {/* サイドナビゲーション */}
        <nav className="hidden md:block w-64 border-r border-gray-200 min-h-screen p-4">
          {settingsNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                block px-4 py-3 rounded-lg mb-1 transition-colors
                ${isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* モバイルナビゲーション */}
        <div className="md:hidden w-full border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {settingsNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex-shrink-0 px-4 py-3 text-sm transition-colors
                  ${isActive ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

/**
 * プロフィール設定
 */
export const ProfileSettingsPage: React.FC = () => {
  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold mb-6">プロフィール設定</h2>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            表示名
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="表示名"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            自己紹介
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            placeholder="自己紹介を入力..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            場所
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="場所"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ウェブサイト
          </label>
          <input
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          保存
        </button>
      </form>
    </div>
  );
};

/**
 * アカウント設定
 */
export const AccountSettingsPage: React.FC = () => {
  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold mb-6">アカウント設定</h2>
      
      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">メールアドレス</h3>
          <p className="text-gray-500 text-sm mb-2">user@example.com</p>
          <button className="text-blue-600 text-sm hover:underline">
            変更する
          </button>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">パスワード</h3>
          <p className="text-gray-500 text-sm mb-2">••••••••</p>
          <button className="text-blue-600 text-sm hover:underline">
            変更する
          </button>
        </div>

        <div className="p-4 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-600 mb-2">アカウントの削除</h3>
          <p className="text-gray-500 text-sm mb-2">
            アカウントを削除すると、すべてのデータが完全に削除されます。
          </p>
          <button className="text-red-600 text-sm hover:underline">
            アカウントを削除
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 通知設定
 */
export const NotificationSettingsPage: React.FC = () => {
  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold mb-6">通知設定</h2>
      
      <div className="space-y-4">
        {[
          { label: 'いいね', description: '投稿にいいねされた時' },
          { label: '返信', description: '投稿に返信された時' },
          { label: 'フォロー', description: '新しいフォロワーが増えた時' },
          { label: 'メンション', description: 'メンションされた時' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <h3 className="font-medium">{item.label}</h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * プライバシー設定
 */
export const PrivacySettingsPage: React.FC = () => {
  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold mb-6">プライバシー設定</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">非公開アカウント</h3>
            <p className="text-gray-500 text-sm">
              承認したユーザーのみが投稿を閲覧できます
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">ダイレクトメッセージ</h3>
            <p className="text-gray-500 text-sm">
              全員からメッセージを受け取る
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
