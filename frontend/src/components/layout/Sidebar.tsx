/**
 * サイドバーコンポーネント
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Avatar } from '../common/Avatar';

interface SidebarProps {
  collapsed?: boolean;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  requireAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'ホーム',
    to: ROUTES.HOME,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: '検索',
    to: ROUTES.SEARCH,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    label: '通知',
    to: ROUTES.NOTIFICATIONS,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    requireAuth: true,
  },
  {
    label: 'ブックマーク',
    to: ROUTES.BOOKMARKS,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    ),
    requireAuth: true,
  },
  {
    label: '設定',
    to: ROUTES.SETTINGS.INDEX,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    requireAuth: true,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { isAuthenticated, user } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.requireAuth || isAuthenticated
  );

  return (
    <aside
      className={`
        fixed left-0 top-14 h-[calc(100vh-3.5rem)]
        bg-white border-r border-gray-200
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        hidden lg:block
      `}
    >
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-lg transition-colors
              ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }
              ${collapsed ? 'justify-center' : 'space-x-3'}
            `}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* プロフィールリンク */}
      {isAuthenticated && user && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <NavLink
            to={ROUTES.PROFILE.VIEW(user.username)}
            className={({ isActive }) => `
              flex items-center rounded-lg p-3 transition-colors
              ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100'}
              ${collapsed ? 'justify-center' : 'space-x-3'}
            `}
          >
            <Avatar
              src={user.profileImageUrl}
              name={user.displayName || user.username}
              size="sm"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.displayName || user.username}
                </p>
                <p className="text-sm text-gray-500 truncate">@{user.username}</p>
              </div>
            )}
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
