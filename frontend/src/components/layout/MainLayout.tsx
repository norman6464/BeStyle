/**
 * メインレイアウトコンポーネント
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

interface MainLayoutProps {
  children?: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      {showHeader && <Header />}

      <div className="flex">
        {/* サイドバー */}
        {showSidebar && isAuthenticated && <Sidebar />}

        {/* メインコンテンツ */}
        <main
          className={`
            flex-1 min-h-screen
            ${showHeader ? 'pt-14' : ''}
            ${showSidebar && isAuthenticated ? 'lg:ml-64' : ''}
          `}
        >
          <div className="max-w-2xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * 全画面レイアウト（ヘッダー・サイドバーなし）
 */
export const FullScreenLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children || <Outlet />}
    </div>
  );
};

export default MainLayout;
