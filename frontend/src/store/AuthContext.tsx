import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logout as logoutApi, getLoginUrl, getSignupUrl, User, LogoutResponse } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  signup: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証プロバイダー
 * アプリケーション全体で認証状態を管理
 * 
 * 使用例:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初回読み込み時にユーザー情報を取得
  useEffect(() => {
    refreshUser();
  }, []);

  /**
   * ユーザー情報を更新
   */
  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.authenticated) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('ユーザー情報の取得に失敗:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ログイン処理
   * Cognito Hosted UIにリダイレクト
   */
  const login = async () => {
    try {
      const { loginUrl } = await getLoginUrl();
      // state値はlocalStorageに保存してCSRF対策（必要に応じて）
      window.location.href = loginUrl;
    } catch (error) {
      console.error('ログインURL取得エラー:', error);
      throw error;
    }
  };

  /**
   * サインアップ処理
   * Cognito Hosted UIにリダイレクト
   */
  const signup = async () => {
    try {
      const { signupUrl } = await getSignupUrl();
      window.location.href = signupUrl;
    } catch (error) {
      console.error('サインアップURL取得エラー:', error);
      throw error;
    }
  };

  /**
   * ログアウト処理
   */
  const logout = async () => {
    try {
      const response: LogoutResponse = await logoutApi();
      setUser(null);
      
      // Cognitoからもログアウトする場合はリダイレクト
      if (response.cognitoLogoutUrl) {
        window.location.href = response.cognitoLogoutUrl;
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
      // エラーでもローカル状態はクリア
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 認証コンテキストを使用するフック
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
