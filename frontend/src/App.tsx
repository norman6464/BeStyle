/**
 * メインアプリケーションコンポーネント
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { router } from './router';
import { ErrorBoundary, Loading } from './components/common';
import { useAuthInit } from './hooks/useAuth';

// 認証初期化コンポーネント
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading, initialized } = useAuthInit();

  // 初期化完了まで待つ
  if (!initialized && loading) {
    return <Loading fullScreen message="認証情報を確認中..." />;
  }

  return <>{children}</>;
};

// アプリケーションのメインコンポーネント
const AppContent: React.FC = () => {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
